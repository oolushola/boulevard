const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const truckTypeController = require('../../controllers/trucktype')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const TruckTypeModel = require('../../models/preferences/trucktype')

router.get(
  '/truck-types', 
  truckTypeController.getLoadingSites
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

module.exports = router