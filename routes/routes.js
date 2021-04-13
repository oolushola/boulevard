const express = require('express')
const router = express.Router()

const loadingSiteRoutes = require('./preferences/loadingsite')
const authRoutes = require('./auth/auth')
const productRoutes = require('./preferences/product')
const truckTypeRoutes = require('./preferences/trucktype')
const tonnageRoute = require('./preferences/tonnage')
const clientRoute = require('./client/client')
const driverRoute = require('./driver/driver')


router.use(
  authRoutes,
  loadingSiteRoutes,
  productRoutes,
  truckTypeRoutes,
  tonnageRoute,
  clientRoute,
  driverRoute
)

module.exports = router 
