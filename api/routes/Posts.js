const express = require("express");
const router = express.Router();

// db, dùng trong mọi trang
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const imageDownloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')

// lưu ý đoạn path này nha
const path = require('path')
const parPath = path.join(__dirname, '..')
router.use('/uploads', express.static(path.join(parPath, 'uploads')))

const bcrypt = require('bcryptjs')
const bcryptSalt = bcrypt.genSaltSync(10)
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser())
const jwtSecret = 'fhdjskahdfjkdsafhjdshakjhf'


router.post('/upload-by-link', async (req, res) => {
    const {link} = req.body
    const newName = 'photo' + Date.now() + '.jpg'
    await imageDownloader.image({
        url: link,
        dest: parPath + '\\uploads\\' + newName
    })
    res.json(newName)
})

// const photosMiddleware = multer({dest: path.join(parPath, 'uploads/')})
const photosMiddleware = multer({dest: 'uploads/'}) // đoạn này chỉ như này thôi
router.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = []
    for(let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i] // lấy ra trg path và originalname trong response
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1] 
        const newPath = path + '.' + ext
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace('uploads\\', ''))
    }
    res.json(uploadedFiles)
})

//hàm bổ sung để xóa các ảnh thừa trong folder upload
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

router.post('/places', (req, res) => {
    const {token} = req.cookies
    const {
        title, address, latitude, longitude,
        addedPhotos, 
        description, perks, extraInfo, 
        area, duration, price
    } = req.body
    jwt.verify(token, jwtSecret, {} , async (err, userData) => {
        if(err) throw err
        const placeData = await prisma.place.create({
            data: {
                owner: {
                    connect: { id: userData.id } // Thay thế bằng id của User thực tế
                },
                title, address, latitude, longitude,
                description, extraInfo, 
                area, duration, price,
                photos: {
                    create: addedPhotos.map(photo => ({ url: photo })), // Tạo các bản ghi PlacePhoto
                },
                perks: {
                    create: perks.map(perk => ({ perk: perk })), // Tạo các bản ghi PlacePerk
                },
            }
        })
        res.json(placeData)
        // res.json(userData)
        cleanUnusedPhotos()
    })
})

router.get('/user-places', (req, res) => {
    const {token} = req.cookies
    // const {token} = req.body
    jwt.verify(token, jwtSecret, {} , async (err, userData) => {
        const {id} = userData
        res.json(await prisma.place.findMany({
            where: {
                ownerId: id
            },
            include: {
                photos: true,
                bookings: true
            }
        }))
    })
})


// hàm này cực kỳ quan trọng nha, thay thế cho hàm ở trên
// router.get('/user-places', (req, res) => {
//     // const { token } = req.cookies;
//     const {token} = req.body
//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//         if (err) return res.status(403).json({ error: 'Invalid token' });
//         const { id } = userData;

//         try {
//             // Nhà đang chờ duyệt (có ít nhất một booking PENDING)
//             const pendingPlaces = await prisma.place.findMany({
//                 where: {
//                     ownerId: id,
//                     bookings: {
//                         some: {
//                             status: 'PENDING'
//                         }
//                     }
//                 },
//                 include: {
//                     photos: true,
//                     bookings: {
//                         select: {
//                             id: true,
//                             status: true
//                         }
//                     }
//                 }
//             });

//             // Nhà đã thuê (có ít nhất một booking APPROVED)
//             const approvedPlaces = await prisma.place.findMany({
//                 where: {
//                     ownerId: id,
//                     bookings: {
//                         some: {
//                             status: 'APPROVED'
//                         }
//                     }
//                 },
//                 include: {
//                     photos: true,
//                     bookings: {
//                         select: {
//                             id: true,
//                             status: true
//                         }
//                     }
//                 }
//             });

//             res.json({
//                 pendingPlaces,
//                 approvedPlaces
//             });
//         } catch (error) {
//             console.error("Error fetching user places:", error);
//             res.status(500).json({ error: 'Something went wrong while fetching places.' });
//         }
//     });
// });


router.get('/place/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const place = await prisma.place.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                photos: true,
                perks: true,
                owner: { // Lấy thông tin chủ trọ
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        phone: true,
                        zalo: true,
                    },
                },
                bookings: { // Lấy các booking liên quan
                    include: {
                        invoices: { // Lấy invoices liên quan tới booking
                            include: {
                                photos: true, // Lấy ảnh của Invoice
                            },
                        },
                    },
                },
                reports: { // Bao gồm thông tin đầy đủ của người báo cáo
                    include: {
                        reporter: { // Lấy thông tin người báo cáo
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
            },
        });

        if (!place) {
            return res.status(404).json({ message: 'Place không tồn tại' });
        }

        res.json({ place });
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin Place.' });
    }
});

// rout này kha khá giống route ở trên, nhưng cái này phục vụ chức năng cho người chủ nhà
// nó sẽ liệt kê ra các lượt book để chờ duyệt
router.get('/placedetail/:id', async (req, res) => {
    const { id } = req.params;
    const place = await prisma.place.findUnique({
      where: { id: parseInt(id, 10) },
      include: { 
        photos: true, 
        perks: true,
        bookings: true,
        reports: { // Bao gồm thông tin đầy đủ của người báo cáo
            include: {
                reporter: { // Lấy thông tin người báo cáo
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
    }
    });
  
    res.json({ place });
});

router.put('/places/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title, address, latitude, longitude,
        addedPhotos,
        description, perks, extraInfo, price,
        area, duration
    } = req.body;

    try {
        // Xóa các ảnh và perks cũ trước khi thêm mới
        await prisma.placePhoto.deleteMany({
            where: { placeId: parseInt(id, 10) }
        });
        await prisma.placePerk.deleteMany({
            where: { placeId: parseInt(id, 10) }
        });

        // Cập nhật thông tin của Place và thêm các ảnh và perks mới
        const updatedPlace = await prisma.place.update({
            where: { id: parseInt(id, 10) },
            data: {
                title,
                address, latitude, longitude,
                description,
                extraInfo,
                area, price,
                duration,
                photos: {
                    create: addedPhotos.map(photo => ({ url: photo })), // Thêm các ảnh mới
                },
                perks: {
                    create: perks.map(perk => ({ perk: perk })), // Thêm các perks mới
                },
            }
        });
        cleanUnusedPhotos()
        res.json(updatedPlace);
    } catch (error) {
        console.error("Error updating Place:", error);
        res.status(500).json({ error: "Something went wrong while updating the place." });
    }
});


router.get('/places', async (req, res) => {
    try {
      // Lấy danh sách tất cả các places
      const places = await prisma.place.findMany({
        include: { photos: true, perks: true },
      });
  
      // Tính số tiền nhỏ nhất và lớn nhất
      const priceStats = await prisma.place.aggregate({
        _min: {
          price: true, // Trường 'price' là trường giá tiền trong database
        },
        _max: {
          price: true,
        },
      });
  
      // Kết hợp dữ liệu và trả về JSON
      res.json({
        places,
        minPrice: priceStats._min.price || 0, // Giá trị nhỏ nhất (nếu không có, trả về 0)
        maxPrice: priceStats._max.price || 0, // Giá trị lớn nhất (nếu không có, trả về 0)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình lấy dữ liệu' });
    }
});

router.post('/delete-home/:placeId', async (req, res) => {
    const { token } = req.cookies;
    const {placeId} = req.params
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

            // Xóa nhà
            await prisma.place.delete({
                where: { id: parseInt(placeId, 10) },
            });

            return res.status(200).json({ message: 'Nhà này đã được xóa thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa nhà này.' });
        }
    });
})

router.put('/hidden-home/:placeId', async (req, res) => {
    const { placeId } = req.params;

    try {
        // Lấy thông tin hiện tại của Place
        const place = await prisma.place.findUnique({
            where: { id: parseInt(placeId) },
        });

        if (!place) {
            return res.status(404).json({ message: 'Place không tồn tại' });
        }

        // Kiểm tra trạng thái hiện tại và chuyển đổi
        const newStatus = place.status === 'SEE' ? 'HIDDEN' : 'SEE';

        // Cập nhật trạng thái của Place
        const updatedPlace = await prisma.place.update({
            where: { id: parseInt(placeId) },
            data: { status: newStatus },
        });

        res.status(200).json({
            message: `Trạng thái của Place đã được chuyển đổi thành ${newStatus}.`,
            updatedPlace,
        });
    } catch (error) {
        console.error('Error updating place status:', error);
        res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu.' });
    }
});

router.post('/add-report', async (req, res) => {
    const {token} = req.cookies
    const {reason, placeId} = req.body

    jwt.verify(token, jwtSecret, async (err, userData) => {
        if (err) {
            return res.status(401).json({ message: 'Token không hợp lệ.' });
        }

        const userId = userData.id;

        try {
            // Tạo report
            await prisma.report.create({
                data: {
                    reporterId: userId,
                    reason: reason,
                    placeId: parseInt(placeId, 10)
                }
            });
            return res.status(200).json({ message: 'Report đã được gửi cho admin' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa tài khoản.' });
        }
    });
})
  

module.exports = router;