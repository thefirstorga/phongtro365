const express = require("express");
const router = express.Router();

// db, dùng trong mọi trang
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser())
const jwtSecret = 'fhdjskahdfjkdsafhjdshakjhf'

router.post('/', async (req, res) => {
    const {token} = req.cookies
    let renterId = null
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if(err) throw err
        renterId = userData.id
    })
    const {placeId, checkIn, checkOut, 
        numberOfGuests, name, phone, price} = req.body
    const newBooking = await prisma.booking.create({
        data: {
            placeId, renterId,
            checkIn: new Date(checkIn), 
            checkOut: new Date(checkOut), 
            numberOfGuests, name, phone, price
        }
    })
    res.json(newBooking)
})

router.get('/', (req, res) => {
    const {token} = req.cookies
    // const {token} = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err
        const {id} = userData
        const bookings = await prisma.booking.findMany({
            where: {
                renterId: id
            },
            include: {
                place: {
                    include: {
                        photos: true, // Lấy các ảnh từ bảng photos
                        perks: true   // Lấy các perks từ bảng perks
                    }
                }
            }
        })
        res.json(bookings)
    })
})

module.exports = router;