const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const responses = require('../utils/response')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const transport = require('nodemailer-sendgrid-transport')
const dotenv = require('dotenv').config()

const transporter = nodemailer.createTransport(new transport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}))

const multer = require('multer')
const { response } = require('express')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+'-'+file.originalname)        
    }
})

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/svg'){
        cb(null, true)
    } 
    else {
        cb(null, false)
    }
}

const uploadPhoto = multer({ storage: fileStorage, fileFilter: fileFilter }).single('photo')

class User {
    static signUp(req, res, next) {
        const firstName = req.body.firstName 
        const lastName = req.body.lastName
        const email = req.body.email
        const password = req.body.password
        const phoneNo = req.body.phoneNo

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            responses.errorResponse(next, 422, 'validation error', errors.array())
        }
        
        if(!req.file) {
            responses.errorResponse(next, 422, 'photo is required', '')
        }
        bcrypt.hash(password, 12)
            .then(hashedPassword => {
            const user = new UserModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                photo: req.file.path,
                phoneNo: phoneNo
            })
            return user.save()
        })
        .then(userInfo => {
            const token = jwt.sign({ 
                userId: userInfo._id, 
                fullName: `${userInfo.firstName} ${userInfo.lastName}` }, 
                process.env.TOKEN_SECRET, 
                { expiresIn: 86400000 })
            responses.successResponse(
                res, 
                201, 
                'user account created successfully.', 
                { token, userInfo }
            )
            transporter.sendMail({
                from: process.env.SENDER,
                to: userInfo.email,
                subject: process.env.SIGNUP_SUBJECT,
                bcc: process.env.ADMIN_ACCOUNT,
                html: `
                    <h1>Hurray! ${ userInfo.firstName }, </h1>
                    <p>Waiting on content from the content  team</p>
                `
            })
        })
        .catch(err => {
            responses.serverErrorResponse(err, 500, next)
        })
    }

    static login(req, res, next) {
        const email = req.body.email
        const password = req.body.password
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            responses.errorResponse(next, 422, 'validation error', errors.array())
        }
        let userInfo;
        UserModel.findOne({ email: email })
            .then(userDoc => {
                if(!userDoc) {
                    responses.errorResponse(next, 404, 'user not found')
                }
                userInfo = userDoc
                return bcrypt.compare(password, userDoc.password)
                    .then(doMatched => {
                        if(!doMatched) {
                            responses.errorResponse(next, 404, 'email and password incorrect')
                        }
                        const token = jwt.sign({ 
                            userId: userInfo._id, 
                            fullName: `${userInfo.firstName} ${userInfo.lastName}` 
                        }, 
                        process.env.TOKEN_SECRET, 
                        { expiresIn: 86400000 })
                        responses.successResponse(res, 200, { token, userInfo })
                    })

            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })

    }
}

module.exports = {
    User, 
    uploadPhoto
}