const express = require("express");
const router = express.Router();

// db, dùng trong mọi trang
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const fs = require('fs')
const path = require('path')
const parPath = path.join(__dirname, '..')
router.use('/uploads', express.static(path.join(parPath, 'uploads')))

// cái này chỉ dùng trong trang này thôi
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser())
const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'fhdjskahdfjkdsafhjdshakjhf'


router.get('/', async (req,res) => {
    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
})

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        }
    })
    res.json(newUser)
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    const userDoc = await prisma.user.findUnique({
        where: {email: email}
    })
    if(userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if(passOk) {
            jwt.sign({email:userDoc.email, id:userDoc.id}, jwtSecret, {}, (err, token) => {
                if(err) throw err
                res.cookie('token', token).json(userDoc)
            })
        } else {
            res.status(422).json('pass not ok')
        }
    } else {
        res.json('not found')
    }
})

router.get('/profile', (req,res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, jwtSecret, {} , async (err, userData) => {
            if(err) throw err
            const {name, email, id, avatar, phone, zalo} = await prisma.user.findUnique({
                where: {id: userData.id}
            })
            res.json({name, email, id, avatar, phone, zalo})
        })
    } else {
        res.json(null) 
    }
})

router.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

async function cleanUnusedPhotos() {
    try {
        const photosPost = await prisma.placePhoto.findMany({
            select: { url: true }
        });

        const photosInvoice = await prisma.invoicePhoto.findMany({
            select: { url: true }
        });

        const photosAvatar = await prisma.user.findMany({
            select: { avatar: true }
        });

        // Hợp nhất các danh sách ảnh từ các bảng khác nhau
        const photoUrlsInDatabase = [
            ...photosPost.map(photo => path.basename(photo.url)), // Tên file từ placePhoto
            ...photosInvoice.map(photo => path.basename(photo.url)), // Tên file từ invoicePhoto
            ...photosAvatar
                .filter(photo => photo.avatar) // Loại bỏ null hoặc undefined
                .map(photo => path.basename(photo.avatar)) // Tên file từ user.avatar
        ];

        const uploadsFolder = path.join(parPath, 'uploads');
        // Tạo một danh sách các file ảnh hiện có trong thư mục uploads
        const filesInFolder = fs.readdirSync(uploadsFolder);

        // Lọc những file không có trong database
        const unusedFiles = filesInFolder.filter(file => !photoUrlsInDatabase.includes(file));

        // Xóa những file không còn được sử dụng
        unusedFiles.forEach(file => {
            const filePath = path.join(uploadsFolder, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted unused photo: ${filePath}`);
        });

        console.log('Cleanup completed successfully!');
    } catch (error) {
        console.error('Error while cleaning up photos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

router.put('/change-avatar', async (req,res) => {
    const {id, updatedAvatar} = req.body
    const result = await prisma.user.update({
        where: {id: id},
        data: {avatar: updatedAvatar}
    })
    res.json(result)
    cleanUnusedPhotos()
})

router.post('/change-password', async (req, res) => {
    const { token } = req.cookies
    const { currentPassword, newPassword } = req.body;

    if(token) {
        jwt.verify(token, jwtSecret, {} , async (err, userData) => {
            if(err) throw err
            const user = await prisma.user.findUnique({
                where: {id: userData.id}
            })

            const isPasswordMatch = bcrypt.compareSync(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác.' });
            }

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: bcrypt.hashSync(newPassword, bcryptSalt),
                },
            });

            res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công.', user: updatedUser });
            })
    } else {
        res.json(null) 
    }
});

router.post('/update-profile', async (req, res) => {
    const {token} = req.cookies
    const { name, phone, zalo } = req.body; // Dữ liệu cập nhật

    if(token) {
        let userId
        jwt.verify(token, jwtSecret, {} , async (err, userData) => {
            if(err) throw err
            userId = userData.id; 
        })

        try {
            // Tìm và cập nhật thông tin user
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: name || undefined,
                    phone: phone || undefined,
                    zalo: zalo || undefined,
                },
            });
    
            res.status(200).json({
                message: 'Thông tin cá nhân đã được cập nhật thành công.',
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi cập nhật thông tin cá nhân.',
                error: error.message,
            });
        }
    } else {
        res.json(null) 
    }
});

router.post('/delete-account', async (req, res) => {
    const { token } = req.cookies;
    const { password } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại.' });
    }

    jwt.verify(token, jwtSecret, async (err, userData) => {
        if (err) {
            return res.status(401).json({ message: 'Token không hợp lệ.' });
        }

        const userId = userData.id;

        try {
            // Lấy thông tin người dùng
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại.' });
            }

            // Kiểm tra mật khẩu
            const isPasswordMatch = bcrypt.compareSync(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: 'Mật khẩu không chính xác.' });
            }

            // Xóa tài khoản
            await prisma.user.delete({
                where: { id: userId },
            });

            // Xóa cookie và gửi phản hồi
            res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'strict' });
            return res.status(200).json({ message: 'Tài khoản đã được xóa thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa tài khoản.' });
        }
    });
});

module.exports = router