const express = require('express')
const driverController = require('../../controllers/driver/driver')
const { body } = require('express-validator')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const DriverModel = require('../../models/driver')
const Driver = require('../../controllers/driver/driver')

const router = express.Router()

router.get(
  '/drivers', 
  driverController.allDrivers
)

router.post(
  '/driver',
  verifyToken,
  userAccess.admin,
  [
    body().isObject(),
    body('driver.firstName').notEmpty().trim().isString().isLength({ min: 2 }),
    body('driver.lastName').trim().isString(),
    body('driver.phoneNo')
      .isArray({ min: 1 })
      .notEmpty(),
    body('motorBoy.firstName').trim().isString(),
    body('motorBoy.lastName').trim().isString(),
    body('motorBoy.phoneNo').isArray()
  ],
  driverController.addDriver
)

module.exports = router