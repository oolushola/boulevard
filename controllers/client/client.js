const ClientModel = require('../../models/client')
const multer = require('multer')
const responses = require('../../utils/response')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/company-logo')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString()+'-'+file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/svg' ||
    file.mimetype === 'image/gif') {
    cb(null, true)
  }
  else {
    cb(null, false)
  }
}

const uploadLogo = multer({ storage: fileStorage, fileFilter: fileStorage }).single('logo')

class clientController {
  static getClients(req, res, next) {
    const perPage = req.query.perPage || 10
    const currentPage = req.currentPage || 1
    ClientModel
      .find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-__v -updatedAt -createdAt')
      .then(clients => {
        if(clients.length <= 0) {
          return responses.successResponse(res, 200, 'no client resource yet', [])
        }
        return responses.successResponse(res, 200, 'no client resource yet', clients)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }
}

module.exports = { 
  clientController,
  uploadLogo
}