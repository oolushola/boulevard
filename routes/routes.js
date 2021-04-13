const express = require('express')
const loadingSiteRoutes = require('./preferences/loadingsite')
const authRoutes = require('./auth/auth')
const productRoutes = require('./preferences/product')
const truckTypeRoutes = require('./preferences/trucktype')
const tonnageRoute = require('./preferences/tonnage')
const clientRoute = require('./client/client')
const driverRoute = require('./driver/driver')
const transporterRouter = require('../routes/transporter/transporter')

const router = express.Router()

router.use(
  authRoutes,
  loadingSiteRoutes,
  productRoutes,
  truckTypeRoutes,
  tonnageRoute,
  clientRoute,
  driverRoute,
  transporterRouter
)

module.exports = router 