const express = require('express')
const router = express.Router()
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const transporterController  = require('../../controllers/transporter/transporter')

router.get(
  '/transporters',
  verifyToken,
  userAccess.admin,
  transporterController.getTransporters
)

module.exports = router