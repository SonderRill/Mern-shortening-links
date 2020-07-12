const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    links: [{ type: mongoose.Types.ObjectId, ref: 'Link' }]
})

module.exports = mongoose.model('users', UserSchema)