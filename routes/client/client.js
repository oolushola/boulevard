const express = require('express')
const router  = express.Router()
const userAccess = require('../../utils/middleware/user-access')
const verifyToken = require('../../utils/middleware/verifyToken')
const { clientController, uploadLogo } = require('../../controllers/client/client')
const { body } = require('express-validator')
const ClientModel = require('../../models/client')
const client = require('../../models/client')

router.get(
  '/clients',
  verifyToken,
  userAccess.admin,
  clientController.getClients
)

router.post(
  '/client',
  verifyToken,
  userAccess.admin,
  // [
  //   body('hasParentCompany').isBoolean(),
  //   body('parentCompany')
  //     .custom((value, { req }) => {
  //       if(value === "" && req.body.hasParentCompany === Number(1)) {
  //         throw new Error('parent company is required')
  //       }
  //     })
  //     .isMongoId(),
  //   body('clientName').isString().trim().notEmpty(),
  //   body('clientAlias').notEmpty().trim().isString().isLength({ min: 2, max: 5 }),
  //   body('clientLogo').isMimeType(),
  //   body('contactInfo.*.email').isEmail().isString().normalizeEmail(),
  //   body('contactInfo.*.phoneNo').isMobilePhone().trim(),
  //   body('contactInfo.*.streetName').isString().notEmpty(),
  //   body('contactInfo.*.city').isString().notEmpty(),
  //   body('contactInfo.*.state').isString().notEmpty(),
  //   body('contactInfo.*.country').isString().notEmpty(),
  //   body('personOfContact.*.name').isString().notEmpty(),
  //   body('personOfContact.*.email').isString(),
  //   body('personOfContact.*.phoneNo').isString().notEmpty(),
  //   body('expectedMargin').isNumeric(),
  //   body('bankName').isString().trim(),
  //   body('accountNo').isString().trim(),
  //   body('accountName').isString().trim(),
  // ],
  uploadLogo,
  clientController.addClient
)

router.get(
  '/client/:clientId',
  verifyToken,
  userAccess.admin,
  clientController.getClient
)

router.put(
  '/client/:clientId',
  verifyToken,
  userAccess.admin,
  [
    body('hasParentCompany').isBoolean(),
    body('parentCompany')
      .custom((value, { req }) => {
        if(value === "" && req.body.hasParentCompany === Number(1)) {
          throw new Error('parent company is required')
        }
      })
      .isMongoId(),
   body('clientName').isString().trim().notEmpty()
    .custom((value, { req }) => {
      return ClientModel
        .findOne({ clientName: value, _id: { $ne: req.params.clientId } })
        .then(matchedClient => {
          if(matchedClient) {
            return Promise.reject('resource already exists')
          }
        })
    }),
    body('clientAlias').notEmpty().trim().isString().isLength({ min: 2, max: 5 }),
    body('clientLogo').isMimeType(),
    body('contactInfo.*.email').isEmail().isString().normalizeEmail(),
    body('contactInfo.*.phoneNo').isMobilePhone().trim(),
    body('contactInfo.*.streetName').isString().notEmpty(),
    body('contactInfo.*.city').isString().notEmpty(),
    body('contactInfo.*.state').isString().notEmpty(),
    body('contactInfo.*.country').isString().notEmpty(),
    body('personOfContact.*.name').isString().notEmpty(),
    body('personOfContact.*.email').isString(),
    body('personOfContact.*.phoneNo').isString().notEmpty(),
    body('expectedMargin').isNumeric(),
    body('bankName').isString().trim(),
    body('accountNo').isString().trim(),
    body('accountName').isString().trim(),
  ],
  uploadLogo,
  clientController.updateClient
)

router.patch(
  '/client/:clientId/product',
  verifyToken,
  userAccess.admin,
  clientController.addClientProduct
)

router.delete(
  '/client/:clientId/product',
  verifyToken,
  userAccess.superAdminAccess,
  clientController.removeClientProduct
)

router.patch(
  '/client/:clientId/loading-site',
  verifyToken,
  userAccess.admin,
  clientController.assignLoadingSite
)

router.delete(
  '/client/:clientId/loading-site',
  verifyToken,
  userAccess.admin,
  clientController.removeLoadingSite
)

module.exports = router