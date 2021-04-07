const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if(!token) {
        const error = new Error('No token found')
        error.statusCode = 400
        throw error
    }
    let verifiedToken;
    try {
        const extractedToken = token.split(' ')[1]
        verifiedToken = jwt.verify(extractedToken, process.env.TOKEN_SECRET)
        req.userId = verifiedToken.userId
        req.fullName = verifiedToken.fullName
        req.userType = verifiedToken.userType
        next()
    }
    catch(err) {
        err = new Error('Token either invalid or expired')
        err.statusCode = 401
        throw err
    }
    
}

module.exports = verifyToken