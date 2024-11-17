const express = require("express");
const router = express.Router();

// db, dùng trong mọi trang
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser())
const jwtSecret = 'fhdjskahdfjkdsafhjdshakjhf'

const { addMonths } = require('date-fns');

router.post('/', async (req, res) => {
    const {token} = req.cookies
    let renterId = null
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if(err) throw err
        renterId = userData.id
    })
    const {placeId} = req.body

    const newBooking = await prisma.booking.create({
        data: {
            placeId, renterId,
        }
    })
    res.json(newBooking)
})

router.post('/cancel-booking', async (req, res) => {
    const { token } = req.cookies;
    let renterId = null;

    // Xác thực token và lấy renterId (người dùng)
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        renterId = userData.id;

        // Lấy placeId từ request body
        const { placeId } = req.body;

        // Tìm booking của người dùng (renterId) và placeId
        const booking = await prisma.booking.findFirst({
            where: {
                renterId,
                placeId,
                status: "PENDING"
            },
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Xóa booking
        await prisma.booking.delete({
            where: {
                id: booking.id, // Xóa dựa trên id của booking
            },
        });

        // Trả về phản hồi thành công
        res.json({ message: 'Booking canceled successfully' });
    });
});


router.get('/', (req, res) => {
    const {token} = req.cookies
    // const {token} = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err
        const {id} = userData
        const bookings = await prisma.booking.findMany({
            where: {
                renterId: parseInt(id, 10)
            },
            include: {
                place: {
                    include: {
                        photos: true, // Lấy các ảnh từ bảng photos
                        perks: true,   // Lấy các perks từ bảng perks
                        bookings: true
                    }
                }
            }
        })
        res.json(bookings)
    })
})

router.post('/accept', async (req, res) => {
    const { token } = req.cookies;
    const { bookingId, placeId } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        try {
            // Bước 1: Lấy `duration` của hợp đồng từ `Place`
            const place = await prisma.place.findUnique({
                where: { id: parseInt(placeId,10) },
                select: { duration: true }
            });

            if (!place) {
                return res.status(404).json({ error: 'Place not found' });
            }

            // Tính `checkOut` dựa trên `duration`
            const checkOutDate = addMonths(new Date(), place.duration);

            // Bước 2: Đổi trạng thái của `booking` được chọn thành `APPROVED` và cập nhật `checkOut`
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'APPROVED',
                    checkOut: checkOutDate
                }
            })

            // Bước 3: Xóa các booking có `status` là `PENDING` cùng `placeId`
            await prisma.booking.deleteMany({
                where: {
                    placeId: parseInt(placeId,10),
                    status: 'PENDING'
                }
            })

            res.json({ message: 'Booking has been approved, checkOut date set, and other pending bookings are removed.' });
        } catch (error) {
            console.error("Error approving booking:", error);
            res.status(500).json({ error: 'Something went wrong while approving booking.' });
        }

    });
});

router.post('/invoice', async (req, res) => {
    const {
        bookingId, title, description, addedPhotos
    } = req.body
    const newInvoice = await prisma.invoice.create({
        data: {
            booking: {connect: {id: bookingId}},
            title, description,
            photos: {
                create: addedPhotos.map(photo => ({ url: photo })), // Tạo các bản ghi PlacePhoto
            }
        }
    })
    res.json(newInvoice)
})

router.get('/getinvoices/:id', async (req,res) => {
    const { id } = req.params;
    const invoices = await prisma.invoice.findMany({
        where: {bookingId: parseInt(id, 10)},
        include: {
            photos: true
        }
    })
    res.json(invoices)
})

router.put('/continue-rent', async (req, res) => {
    const { bookingId, placeId } = req.body;

    try {
        // Lấy thông tin `duration` của `place`
        const place = await prisma.place.findUnique({
            where: { id: parseInt(placeId,10) },
            select: { duration: true } // Chỉ lấy `duration`
        });

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        // Lấy thông tin `checkOut` hiện tại của booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: { checkOut: true }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Tính `checkOut` mới
        const newCheckOut = addMonths(new Date(booking.checkOut), place.duration);

        // Cập nhật `checkOut` mới
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                checkOut: newCheckOut
            }
        });

        // Bước 3: Xóa các booking có `status` là `PENDING` cùng `placeId`
        await prisma.booking.deleteMany({
            where: {
                placeId: parseInt(placeId,10),
                status: 'PENDING'
            }
        })

        res.json({ message: 'Booking updated successfully', updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the booking.' });
    }
});

router.put('/not-continue-rent', async (req, res) => {
    const {bookingId} = req.body
    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            isContinue: true
        }
    });
    res.json({ message: 'Booking updated successfully', updatedBooking });
})

router.put('/not-rent-request', async (req, res) => {
    const {bookingId} = req.body
    const result = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: 'WAIT'
        }
    })
    res.json(result)
})

router.put('/undo-not-rent-request', async (req, res) => {
    const {bookingId} = req.body
    const result = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: 'APPROVED'
        }
    })
    res.json(result)
})

router.put('/not-rent-response', async (req, res) => {
    const {bookingId} = req.body
    const result = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: 'RENTED',
            checkOut: new Date()
        }
    })
    res.json(result)
})

module.exports = router;