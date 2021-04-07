const userModel = require('../../models/user')

class Priviledges { 
    static superAdminAccess(req, res, next) {
        const userId = req.userId
        userModel.findById(userId)
            .then(user => {
                if(user.userRole !== 'Super Admin') {
                    const error = new Error('Access denied. You do not have permission to change user role')
                    error.statusCode = 403
                    next(error)
                }
                next()
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500
                    next(err)
                }
            })
        
    }
}

module.exports = Priviledges