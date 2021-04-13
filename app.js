const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const path = require('path')
const routes = require('./routes/routes')

const PORT = process.env.PORT || 8080
const CONNECTION_URI = `${process.env.CONNECTION_STRING}`
const BASE_URL = '/api/v2'
const app = express()

app.use('/public/images', express.static(path.join(__dirname, 'public/images')))
app.use('/public/company-logo', express.static(path.join(__dirname, 'public/company-logo')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(BASE_URL, routes)

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


