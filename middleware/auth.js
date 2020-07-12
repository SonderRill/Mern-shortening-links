const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/config').jwtSecret

module.exports = (req, res, next) => {
    if (req.methods === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }

        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded
        next()


    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}