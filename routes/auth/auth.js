const express = require('express')
const { body } = require('express-validator')
const multer = require('multer')
const { uploadPhoto, User } = require('../../controllers/user')
const UserModel = require('../../models/user')
const router = express.Router()
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
router.post(
    '/signup',
    [
        body('firstName', 'first name is required').trim().isString().isLength({ min: 2, max: 40 }),
        body('lastName', 'last name is required').trim().isString().isLength({ min: 2, max: 40}),
        body('email', 'email is required and must be valid').isEmail().trim()
            .custom((value, { req }) => {
                return UserModel.findOne({ email: req.body.email })
                    .then(user => {
                        if(user) {
                            return Promise.reject('user already exists')
                        }
                    })
            })
            .normalizeEmail(),
        body('password', 'Password is required').isLength({ min: 8 }).trim(),
        body('confirmPassword', 'Confirm password is required')
            .custom((value, {req}) => {
                if(value !== req.body.password) {
                    throw new Error('Password does not match')
                }
            }),
        body('phoneNo', 'Phone number is required').isMobilePhone().trim()
    ],
    uploadPhoto,
    User.signUp
)
router.post(
    '/login',
    [
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password is required').isLength({ min: 8 }).trim(),
    ],
    User.login
)
router.patch(
    '/update-user-status', 
    verifyToken,
    userAccess,
    User.changeUserStatus
)
module.exports = router