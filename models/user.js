const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    phoneNo: {
        required: true,
        type: String
    },
    accountStatus: {
        type: Boolean,
        default: true
    },
    userRole: {
        required: true,
        default: 'Admin',
        type: String
    }, 
    photo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel