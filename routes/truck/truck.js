const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const truckController = require('../../controllers/truck/truck')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const TruckModel = require('../../models/truck')

router.get(
  '/trucks',
  verifyToken,
  userAccess.admin,
  truckController.getTrucks
)

router.post(
  '/truck',
  verifyToken,
  userAccess.admin,
  [
    body('transporter').isMongoId().notEmpty().trim(),
    body('truckNo').isString().notEmpty().trim(),
    body('truckType').isMongoId().notEmpty().trim(),
    body('tonnage').isMongoId().notEmpty().trim()
  ],
  truckController.addTruck
)

router.get(
  '/truck/:truckId',
  verifyToken,
  userAccess.admin,
  truckController.getTruck
)

router.put(
  '/truck/:truckId',
  verifyToken,
  userAccess.admin,
  [
    body('transporter').isMongoId().notEmpty().trim(),
    body('truckNo')
      .isString()
      .notEmpty()
      .trim()
      .custom((value, { req }) => {
        const truckId = req.params.truckId
        return TruckModel.findOne({ truckNo: value, _id: { $ne: truckId }})
          .then(truck => {
            if(truck) {
              return Promise.reject('resource already exist')
            }
          })
      }),
    body('truckType').isMongoId().notEmpty().trim(),
    body('tonnage').isMongoId().notEmpty().trim()
  ],
  truckController.updateTruck
)

module.exports = router