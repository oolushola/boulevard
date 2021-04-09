const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const truckTypeController = require('../../controllers/trucktype')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')

router.get(
  '/truck-types', 
  truckTypeController.getLoadingSites)

module.exports = router