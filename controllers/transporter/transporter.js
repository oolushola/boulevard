const TransporterModel = require('../../models/transporter')
const { validationResult } = require('express-validator')
const responses = require('../../utils/response')
const multer = require('multer')
const crypto = require('crypto')
const brcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/transporter/documents')
  },
  filename: (req, file, cb) => {
    const fileName = crypto.randomBytes(10).toString('hex');
    const extention = file.mimetype.split('/')[1]
    cb(null, new Date().toISOString()+'-'+fileName+'.'+extention)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'||
    file.mimetype === 'application/pdf') {
      cb(null, true)
    }
    else {
      cb(null, false)
    }
}

const uploadDocuments = multer({ storage:fileStorage, fileFilter: fileFilter }).array('documents', 12)

class Transporter {
  static getTransporters(req, res, next) {
    const perPage = req.query.perPage || 10
    const currentPage = req.query.currentPage || 1
    TransporterModel
      .find({})
      .select('-__v -createdAt -updatedAt -password')
      .populate('assignedTo', 'firstName -_id')
      .sort({ companyName: 'desc' })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .then(transporters => {
        if(transporters.length <= 0) {
          return responses.successResponse(res, 200, 'no resource yet', transporters)
        }
        responses.successResponse(res, 200, 'transporters resource', transporters)
      })
      .catch(err => {
        responses.errorResponse(err, 500, next)
      })
  }

  static addTransporter(req, res, next) {
    const assignedTo = req.body.assignedTo
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const companyName = req.body.companyName
    const contact = JSON.parse(req.body.contact).contactInfo
    const bankDetails = JSON.parse(req.body.bankDetails)
    const guarantor = JSON.parse(req.body.guarantor)
    const nextOfKin = JSON.parse(req.body.nextOfKin)
    const documents = req.files
    const description = req.body.description
    let fileNameAndPath = []

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.mapped())
    }
    if(documents.length > 0) {
      documents.map((documentName, index) => {
        fileNameAndPath.push({
          caption: description[index],
          documentUrl: documentName.path
        })
      })
    }

    brcrypt.hash(lastName, 12)
    .then(hashedPassword => {
      const newTransporter = new TransporterModel({
        assignedTo: assignedTo,
        firstName: firstName,
        lastName: lastName,
        companyName: companyName,
        contact: contact,
        bankDetails: bankDetails,
        guarantor: guarantor,
        nextOfKin: nextOfKin,
        username: contact[0].email,
        password: hashedPassword,
        documents: fileNameAndPath
      })
      return newTransporter.save()
    })
    .then(transporter => {
      responses.successResponse(res, 201, 'transporter resource created', transporter)
    })
    .catch(err => {
      responses.serverErrorResponse(err, 500, next)
    })     
  }

  static getTransporter(req, res, next) {
    const transporterId = req.params.transporterId
    TransporterModel
      .findOne({ _id: transporterId })
      .select('-__v -createdAt -updatedAt -password')
      .then(transporter => {
        if(!transporter) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        return responses.successResponse(res, 200, 'transporter resource', transporter)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static updateTransporter(req, res, next) {
    const transporterId = req.params.transporterId
    const assignedTo = req.body.assignedTo
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const companyName = req.body.companyName
    const contact = JSON.parse(req.body.contact).contactInfo
    const bankDetails = JSON.parse(req.body.bankDetails)
    const guarantor = JSON.parse(req.body.guarantor)
    const nextOfKin = JSON.parse(req.body.nextOfKin)
    const documents = req.files
    const description = req.body.description
    let fileNameAndPath = []

    if(documents.length > 0) {
      documents.map((document, index) => {
        fileNameAndPath.push({
          caption: description[index],
          documentUrl: document.path
        })
      })
    }

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.mapped())
    }
    TransporterModel
      .findById(transporterId)
      .then(transporter => {
        if(!transporter) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        let checkDocument
        const transporterDocs = [...transporter.documents]
        fileNameAndPath.map((document, index) => {
          checkDocument = transporterDocs.findIndex(doc => doc.caption === document.caption)
          if(checkDocument < 0) {
            transporter.documents.push({
              caption: document.caption,
              documentUrl: document.documentUrl
            })
          }
        })
        transporter.assignedTo = assignedTo
        transporter.firstName = firstName
        transporter.lastName = lastName
        transporter.companyName = companyName
        transporter.contact = contact
        transporter.bankDetails = bankDetails
        transporter.guarantor = guarantor
        transporter.nextOfKin = nextOfKin
        return transporter.save()
        .then(updatedResult => {
          responses.successResponse(res, 200, 'transporter resource updated', updatedResult)
        })
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static removeDocument(req, res, next) {
    const transporterId = req.params.transporterId
    const documentName = req.query.name
    TransporterModel
      .findById(transporterId)
      .then(transporter => {
        if(!transporter) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        const transporterDocs = [...transporter.documents]
        const documentIndex = transporterDocs.findIndex(doc => doc.caption === documentName)
        if(documentIndex >= 0) {
          const documentPath = transporterDocs[documentIndex].documentUrl
          transporter.documents.splice(documentIndex, 1)
          deleteImage(documentPath)
          return transporter.save()
            .then(() => {
              responses.successResponse(res, 200, `${documentName} removed`)
            })
        }
        responses.errorResponse(res, 404, 'document resource not found')
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }
}

const deleteImage = (imagePath) => {
  const rootPath = path.join(__dirname, '..', '..')
  fs.unlink(rootPath+'/'+imagePath, (err, resp) => {
    if(err) {
      console.log('ERROR: IMAGE_PATH_UNDEFINED')
      return false
    }
    console.log('document deleted successfully')
  })
}

module.exports = {
  Transporter,
  uploadDocuments
}