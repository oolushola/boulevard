const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/response')
const tonnageController = require('../../controllers/tonnage')

router.get(
  '/tonnages',
  tonnageController.getTonnages
)

module.exports = router