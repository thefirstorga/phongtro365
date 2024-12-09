const express = require("express");
const router = express.Router();

// db, dùng trong mọi trang
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser())
const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'fhdjskahdfjkdsafhjdshakjhf'

const createNotification = async (userId, type, message, placeId = null) => {
    let parsedPlaceId
    if(typeof placeId === 'number') parsedPlaceId = placeId
    else if(typeof placeId !== 'number') parsedPlaceId = parseInt(placeId)

    try {
      await prisma.notification.create({
        data: {
          userId,
          type,
          message,
          placeId: parsedPlaceId,  // Lưu placeId nếu có
        },
      });
    } catch (error) {
      console.error("Error creating notification", error);
    }
};

router.get('/check-admin', async (req, res) => {
    const admin = await prisma.admin.findFirst();

    if (admin) {
        return res.json({ hasAdmin: true });
    } else {
        return res.json({ hasAdmin: false });
    }

})

router.post('/register', async (req, res) => {
    const {email, password} = req.body
    const {tokenAdmin} = req.cookies

    if(tokenAdmin!=='') {
        jwt.verify(tokenAdmin, jwtSecret, {} , async (err, adminData) => {
            if(err) throw err
            const newAdmin = await prisma.admin.create({
                data: {
                    email,
                    createById: adminData.id,
                    password: bcrypt.hashSync(password, bcryptSalt)
                }
            })
            res.json(newAdmin)
        })
    } else {
        await prisma.admin.create({
            data: {
                email,
                password: bcrypt.hashSync(password, bcryptSalt)
            }
        })
    }
    
    res.json('not')
    
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    const adminDoc = await prisma.admin.findUnique({
        where: {email: email}
    })
    if(adminDoc) {
        const passOk = bcrypt.compareSync(password, adminDoc.password)
        if(passOk) {
            jwt.sign({email:adminDoc.email, id:adminDoc.id}, jwtSecret, {}, (err, tokenAdmin) => {
                if(err) throw err
                res.cookie('tokenAdmin', tokenAdmin).json(adminDoc)
            })
        } else {
            res.status(422).json('pass not ok')
        }
    } else {
        res.json('not found')
    }
})

router.post('/logout', (req, res) => {
    res.cookie('tokenAdmin', '').json(true)
})

router.get('/profile', async (req, res) => {
    const { tokenAdmin } = req.cookies;
    if (tokenAdmin) {
        try {
            jwt.verify(tokenAdmin, jwtSecret, {}, async (err, adminData) => {
                if (err) {
                    // Xử lý lỗi xác thực JWT
                    console.error("JWT verification failed:", err);
                    return res.status(401).json({ error: "Unauthorized" });
                }
                try {
                    // Truy vấn cơ sở dữ liệu để lấy thông tin admin
                    const user = await prisma.admin.findUnique({
                        where: { id: adminData.id }
                    });

                    // Kiểm tra nếu không tìm thấy admin trong cơ sở dữ liệu
                    if (!user) {
                        return res.status(404).json({ error: "Admin not found" });
                    }

                    // Destructure email và id từ user nếu có
                    const { email, id } = user;

                    // Trả dữ liệu admin về client
                    res.json({ email, id });
                } catch (dbErr) {
                    // Xử lý lỗi trong quá trình truy vấn cơ sở dữ liệu
                    console.error("Database query failed:", dbErr);
                    res.status(500).json({ error: "Internal server error" });
                }
            });
        } catch (jwtErr) {
            // Xử lý lỗi không mong muốn từ bên ngoài
            console.error("Unexpected error:", jwtErr);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        // Nếu không có tokenAdmin trong cookie
        res.json(null);
    }
});


router.get('/get-places', async (req, res) => {
    try {
        const places = await prisma.place.findMany({
            include: {
                photos: true,
                perks: true,
                reports: {
                    include: {
                        reporter: { // Bao gồm thông tin người báo cáo
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                                phone: true,
                                zalo: true,
                            },
                        },
                    },
                },
                owner: { // Bao gồm thông tin chủ nhà
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        phone: true,
                        zalo: true,
                    },
                },
            },
        });
        res.json({ places });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách places.' });
    }
});


// Đổi trạng thái của Place thành DELETE và chuyển trạng thái các Report liên quan sang DONE
router.post('/delete-place/:placeId', async (req, res) => {
    const { placeId } = req.params;

    try {
        // Tìm kiếm Place
        const place = await prisma.place.findUnique({
            where: { id: parseInt(placeId) },
            include: { owner: true }, // Bao gồm thông tin chủ nhà
        });

        if (!place) {
            return res.status(404).json({ message: 'Place không tồn tại' });
        }

        // Cập nhật trạng thái của Place thành DELETE
        await prisma.place.update({
            where: { id: parseInt(placeId) },
            data: { status: 'DELETE' },
        });

        // Cập nhật trạng thái các Report liên quan thành DONE
        await prisma.report.updateMany({
            where: { placeId: parseInt(placeId), status: 'PENDING' },
            data: { status: 'DONE' },
        });

        // Xóa các booking có trạng thái PENDING
        await prisma.booking.deleteMany({
            where: { placeId: parseInt(placeId), status: 'PENDING' },
        });

        // Cập nhật các booking có trạng thái APPROVED thành RENTED
        await prisma.booking.updateMany({
            where: { placeId: parseInt(placeId), status: 'APPROVED' },
            data: { 
                status: 'RENTED',
                checkOut: new Date()
            },
        });

        const message = `Ngôi nhà của bạn đã bị ban và không thể tiếp tục hoạt động.`;
        await createNotification(place.ownerId, 'Kết quả report', message, placeId);

        // Tăng violationCount của chủ nhà và kiểm tra trạng thái BLACKLISTED
        const newViolationCount = place.owner.violationCount + 1;
        const newStatus = newViolationCount > 3 ? 'BLACKLISTED' : place.owner.status;

        const updatedOwner = await prisma.user.update({
            where: { id: place.ownerId },
            data: {
                violationCount: newViolationCount,
                status: newStatus,
            },
        });

        const isBlacklisted = newViolationCount > 3;
        if (isBlacklisted) {
            // Xóa tất cả places của user bị BLACKLISTED 
            await prisma.place.deleteMany({
                where: { ownerId: place.ownerId },
            });
        }

        res.status(200).json({
            message: 'Place đã được chuyển sang trạng thái DELETE, các Report đã được xử lý, và Booking đã được cập nhật.',
            updatedPlace: {
                id: place.id,
                status: 'DELETE',
            },
            updatedOwner: {
                id: updatedOwner.id,
                violationCount: updatedOwner.violationCount,
                status: updatedOwner.status,
            },
        });
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu.' });
    }
});

// Xóa tất cả các Report liên quan đến Place
router.post('/mark-place-normal/:placeId', async (req, res) => {
    const { placeId } = req.params;

    try {
        // Xóa tất cả các Report liên quan
        await prisma.report.deleteMany({
            where: { placeId: parseInt(placeId) },
        });

        // Lấy danh sách cập nhật
        const updatedPendingReports = await prisma.place.findMany({
            where: { status: 'SEE' }, // Nhà vẫn đang hiển thị (không phải DELETE)
        });

        const updatedNormalPlaces = await prisma.place.findMany({
            where: { status: 'SEE' }, // Nhà bình thường (không bị báo cáo)
        });

        res.status(200).json({
            message: 'Tất cả các Report liên quan đã được xóa.',
            updatedPendingReports,
            updatedNormalPlaces,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu.' });
    }
});


module.exports = router