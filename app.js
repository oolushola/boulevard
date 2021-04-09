const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const path = require('path')

const loadingSiteRoutes = require('./routes/preferences/loadingsite')
const authRoutes = require('./routes/auth/auth')
const productRoutes = require('./routes/preferences/product')
const truckTypeRoutes = require('./routes/preferences/trucktype')

const PORT = process.env.PORT || 8080
const CONNECTION_URI = `${process.env.CONNECTION_STRING}`
const BASE_URL = '/api/v2'
const app = express()

app.use('/public/images', express.static(path.join(__dirname, 'public/images')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(BASE_URL, authRoutes)
app.use(BASE_URL, loadingSiteRoutes, productRoutes, truckTypeRoutes)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    const errorData = error.errorData
    const message = error.message
    res.status(status).json({
        data: errorData,
        message: message
    })
    next()
})

app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 404,
        data: 'oops! seems lost? Go home!'
    })
})

mongoose.connect(CONNECTION_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
})
.then((client) => {
    app.listen(PORT, ()=> {
        console.log(`SERVER RUNNING ON PORT:${PORT}`)
    })
})
.catch(err => {
    console.log(err)
})


