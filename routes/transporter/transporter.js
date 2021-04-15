const express = require('express')
const router = express.Router()
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const { Transporter, uploadDocuments }  = require('../../controllers/transporter/transporter')
const { body } = require('express-validator')

router.get(
  '/transporters',
  verifyToken,
  userAccess.admin,
  Transporter.getTransporters
)

router.post(
  '/transporter',
  verifyToken,
  userAccess.admin,
  [
    body('assignedTo').notEmpty().isMongoId().trim(),
    body('firstName').isString().notEmpty().trim(),
    body('lastName').isString().notEmpty().trim(),
    body('companyName')
      .isString()
      .notEmpty()
      .trim()
      .custom((value, { req }) => {
        return TransporterModel
          .findOne({ companyName: value })
          .then(transporter => {
            if(transporter) {
              return Promise.reject('transporter resource exists')
            }
          })
      }),
    body('contact.contactInfo.*.email').trim().isEmail().normalizeEmail().notEmpty(),
    body('contact.contactInfo.*.phoneNo').isString().trim().notEmpty(),
    body('contact.contactInfo.*.address').isString().trim().notEmpty(),
    body('guarantor.fullName').isString().trim().notEmpty(),
    body('guarantor.phoneNo').isString().trim().notEmpty(),
    body('guarantor.email').isEmail().normalizeEmail(),
    body('guarantor.address').isString().notEmpty().trim(),
    body('nextOfKin.fullName').notEmpty().isString().trim(),
    body('nextOfKin.phoneNo').isString().trim(),
    body('nextOfKin.email').isEmail().normalizeEmail(),
    body('nextOfKin.fullName').isString().trim().notEmpty(),
    body('nextOfKin.phoneNo').trim().isString(),
    body('nextOfKin.email').isEmail().normalizeEmail().trim(),
    body('nextOfKin.address').isString().trim()
  ],
  uploadDocuments,
  Transporter.addTransporter
)

router.get(
  '/transporter/:transporterId',
  verifyToken,
  userAccess.admin,
  Transporter.getTransporter
)

router.put(
  '/transporter/:transporterId',
  verifyToken,
  userAccess.admin,
  [
    body('assignedTo').notEmpty().isMongoId().trim(),
    body('firstName').isString().notEmpty().trim(),
    body('lastName').isString().notEmpty().trim(),
    body('companyName')
      .isString()
      .notEmpty()
      .trim()
      .custom((value, { req }) => {
        return TransporterModel
          .findOne({ companyName: value, _id: { $ne: req.params.transporterId } })
          .then(transporter => {
            if(transporter) {
              return Promise.reject('transporter resource exists')
            }
          })
      }),
    body('contact.contactInfo.*.email').trim().isEmail().normalizeEmail().notEmpty(),
    body('contact.contactInfo.*.phoneNo').isString().trim().notEmpty(),
    body('contact.contactInfo.*.address').isString().trim().notEmpty(),
    body('guarantor.fullName').isString().trim().notEmpty(),
    body('guarantor.phoneNo').isString().trim().notEmpty(),
    body('guarantor.email').isEmail().normalizeEmail(),
    body('guarantor.address').isString().notEmpty().trim(),
    body('nextOfKin.fullName').notEmpty().isString().trim(),
    body('nextOfKin.phoneNo').isString().trim(),
    body('nextOfKin.email').isEmail().normalizeEmail(),
    body('nextOfKin.fullName').isString().trim().notEmpty(),
    body('nextOfKin.phoneNo').trim().isString(),
    body('nextOfKin.email').isEmail().normalizeEmail().trim(),
    body('nextOfKin.address').isString().trim()
  ],
  uploadDocuments,
  Transporter.updateTransporter
)

router.delete(
  '/transporter/:transporterId/document',
  verifyToken,
  userAccess.admin,
  Transporter.removeDocument
)

module.exports = router