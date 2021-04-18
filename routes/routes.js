const express = require('express')
const loadingSiteRoutes = require('./preferences/loadingsite')
const authRoutes = require('./auth/auth')
const productRoutes = require('./preferences/product')
const truckTypeRoutes = require('./preferences/trucktype')
const tonnageRoute = require('./preferences/tonnage')
const clientRoute = require('./client/client')
const driverRoute = require('./driver/driver')
const transporterRoute = require('../routes/transporter/transporter')
const truckRoute = require('../routes/truck/truck')

const router = express.Router()

router.use(
  authRoutes,
  loadingSiteRoutes,
  productRoutes,
  truckTypeRoutes,
  tonnageRoute,
  clientRoute,
  driverRoute,
  transporterRoute,
  truckRoute
)

module.exports = router 
