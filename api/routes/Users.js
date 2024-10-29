const express = require("express");
const router = express.Router();

// db, dùng trong mọi trang
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

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
            const {name, email, id} = await prisma.user.findUnique({
                where: {id: userData.id}
            })
            res.json({name, email, id})
        })
    } else {
        res.json(null)
    }
})

router.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

module.exports = router;