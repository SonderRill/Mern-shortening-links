const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/config').jwtSecret
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/getAuth', auth, (req, res) => {

    return res.status(200).json({ info: 'norm' })

})

router.post('/register',
    [
        check('email', 'Некорректный emai').isEmail(),
        check('password', 'Mинимальная длина 6 символов').isLength({ min: 6 })

    ], async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                })
            }

            const { email, password } = req.body

            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({ msg: 'Такой email уже занят' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            await User.create({
                email,
                password: hashedPassword
            })

            res.status(201).json({ msg: 'Пользователь создан' })
        } catch (error) {
            console.log(error)
        }

    })

router.post('/login',
    [
        check('email', 'Некорректный emai').normalizeEmail().isEmail(),
        check('password', 'Mинимальная длина 6 символов').exists()

    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ msg: 'Такой пользователь не найден' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ msg: 'Неверный пароль попробуйте снова' })
        }

        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: '1h' }
        )

        return res.json({
            token,
            userId: user.id
        })

    })


module.exports = router