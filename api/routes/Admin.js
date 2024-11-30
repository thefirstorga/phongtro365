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

router.get('/', (req, res) => {

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
        res.json('not')
    }
    
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

router.get('/profile', (req,res) => {
    const {tokenAdmin} = req.cookies
    if(tokenAdmin) {
        jwt.verify(tokenAdmin, jwtSecret, {} , async (err, adminData) => {
            if(err) throw err
            const {email, id} = await prisma.user.findUnique({
                where: {id: adminData.id}
            })
            res.json({email, id})
        })
    } else {
        res.json(null) 
    }
})
module.exports = router