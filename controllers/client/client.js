const ClientModel = require('../../models/client')
const multer = require('multer')
const responses = require('../../utils/response')
const { validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')
const { Console } = require('console')

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

const uploadLogo = multer({ storage: fileStorage, fileFilter: fileFilter }).single('clientLogo')

class clientController {
  static getClients(req, res, next) {
    const perPage = req.query.perPage || 10
    const currentPage = req.currentPage || 1
    ClientModel
      .find({})
      .populate('parentCompany products.items.productId', 'clientName productName -_id')
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

  static addClient(req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.mapped())
    }
    const hasParentCompany = JSON.parse(req.body.hasParentCompany)
    const parentCompany = req.body.parentCompany
    const clientName = req.body.clientName
    const clientAlias = req.body.clientAlias
    const contactInfo = req.body.contactInfo
    const personOfContact = req.body.personOfContact
    const expectedMargin = req.body.expectedMargin
    const bankName = req.body.bankName
    const accountNo = req.body.accountNo
    const accountName = req.body.accountName
    let companyLogoUrl = req.file
    if(!req.file) {
      return responses.errorResponse(res, 422, 'choose a logo')
    }
    companyLogoUrl = req.file.path
   
    ClientModel
      .findOne({ clientName: clientName })
      .then(doMatched => {
        if(doMatched) {
          return responses.errorResponse(res, 409, 'resource already exists')
        }
        const newClientInfo = new ClientModel({
          hasParentCompany: hasParentCompany,
          parentCompany: parentCompany,
          clientName: clientName,
          clientAlias: clientAlias,
          clientLogo: companyLogoUrl,
          contactInfo: contactInfo,
          personOfContact: personOfContact,
          expectedMargin: expectedMargin,
          bankName: bankName,
          accountNo: accountNo,
          accountName: accountName,
        })
        return newClientInfo.save()
        .then(client => {
          responses.successResponse(res, 201, 'resource created', client)
        })
      }) 
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static getClient(req, res, next) {
    const clientId = req.params.clientId
    ClientModel
      .findById(clientId)
      .populate('parentCompany', 'clientName -_id')
      .select('-__v -createdAt -updatedAt')
      .then(client => {
        if(!client) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        responses.successResponse(res, 200, 'resource details', client)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static updateClient(req, res, next) {
    const clientId = req.params.clientId
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed')
    }
    const hasParentCompany = JSON.parse(req.body.hasParentCompany)
    const parentCompany = req.body.parentCompany
    const clientName = req.body.clientName
    const clientAlias = req.body.clientAlias
    const contactInfo = req.body.contactInfo
    const personOfContact = req.body.personOfContact
    const expectedMargin = req.body.expectedMargin
    const bankName = req.body.bankName
    const accountNo = req.body.accountNo
    const accountName = req.body.accountName
    let clientLogo = req.file
    
    ClientModel
      .findById(clientId)
      .then(client => {
        if(!client) {
          return responses.errorResponse(res, 409, 'record already exists')
        }
        if(req.file) {
          deleteClientImage(client.clientLogo)
          clientLogo = req.file.path
        }
        else {
          clientLogo = client.clientLogo
        }
        client.hasParentCompany = hasParentCompany
        client.parentCompany = parentCompany
        client.clientName = clientName
        client.clientAlias = clientAlias
        client.clientLogo = clientLogo
        client.contactInfo = contactInfo
        client.personOfContact = personOfContact
        client.expectedMargin = expectedMargin
        client.bankName = bankName
        client.accountNo = accountNo
        client.accountName = accountName
        return client.save()
        .then(result => {
          responses.successResponse(res, 200, 'resource updated', result)
        })
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static addUserProduct(req, res, next) {
    const clientId = req.params.clientId
    const items = req.body.items
    ClientModel
      .findById(clientId)
      .then(client => {
        if(!client) {
          return responses.errorResponse(res, 404, 'client resource not found')
        }
        const productListings = [...items]
        const updatedProducts = productListings.map(product => {
        let checkClientProduct = client.products.items.findIndex(clientProduct => 
          clientProduct.productId.toString() === product.productId.toString())
          if(checkClientProduct < 0) {
            client.products.items.push({ productId: product.productId })
          }
        })    
        return client.save()
          .then(addedProducts => {
            responses.successResponse(res, 200, 'product resource added to client', addedProducts)
          })
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }
}

const deleteClientImage = (imagePath) => {
  const imageRootPath = path.join(__dirname, '..', '..')
  const fullImagePath = imageRootPath+'/'+imagePath
  if(fullImagePath) {
    return fs.unlink(fullImagePath, (err, data) => {
      if(err) {
        throw new Error('image resource does not exists.')
      }
      console.log('image deleted')
    })
  }
}



module.exports = { 
  clientController,
  uploadLogo
}