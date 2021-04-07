const userModel = require('../../models/user')

class Priviledges { 
    static superAdminAccess(req, res, next) {
        console.log(req.userType)
    }
}

module.exports = Priviledges