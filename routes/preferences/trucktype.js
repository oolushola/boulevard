const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const truckTypeController = require('../../controllers/preferences/trucktype')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const TruckTypeModel = require('../../models/preferences/trucktype')

router.get(
  '/truck-types', 
  truckTypeController.getTruckTypes
)

router.post(
  '/truck-type',
  verifyToken,
  userAccess.admin,
  [
    body('truckTypeCode').trim().notEmpty().isLength({ min: 2, max: 4 }),
    body('truckType')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return TruckTypeModel
          .find({ truckTypeCode: req.body.truckTypeCode })
          .or([{
            truckType: req.body.truckType
          }])
          .then((truckType) => {
            if(truckType.length > 0) {
              return Promise.reject(`${value} or ${req.body.truckTypeCode} already exists`)
            }
          })
        })
  ],
  truckTypeController.addTruckType
)

router.get(
  '/truck-type/:truckTypeId',
  truckTypeController.getTruckType
)

router.put(
  '/truck-type/:truckTypeId',
  verifyToken,
  userAccess.admin,
  [
    body('truckTypeCode').trim().notEmpty().isLength({ min: 2, max: 4 }),
    body('truckType')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return TruckTypeModel
          .find({ _id: { $ne: req.params.truckTypeId} })
          .or([
            {
              truckType: req.body.truckType,
            },
            {
              truckTypeCode: req.body.truckTypeCode
            }
        ])
          .then((truckType) => {
            if(truckType.length > 0) {
              return Promise.reject(`${value} or ${req.body.truckTypeCode} already exists`)
            }
          })
        })
  ],
  truckTypeController.updateTruckType
)

module.exports = router