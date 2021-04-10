const express = require('express')
const { body } = require('express-validator')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const { clientController, uploadLogo } = require('../../controllers/client/client')

const router = express.Router()

router.get(
  '/clients',
  clientController.getClients
)


module.exports = router