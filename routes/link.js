const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Link = require('../models/Link')
const config = require('../config/config')
const shortid = require('shortid')

router.post('/generate', auth, async (req, res) => {
    try {
        const { baseUrl } = config
        const { from } = req.body

        const code = shortid.generate()

        const existing = await Link.findOne({ from })

        if (existing) {
            return res.json({ link: existing })
        }

        const to = baseUrl + '/t/' + code
        const link = await Link.create({
            code,
            to,
            from,
            owner: req.user.userId
        })

        res.status(201).json({ link })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId })
        res.json(links)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' })
    }
})

module.exports = router