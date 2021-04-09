const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productDesc: {
        type: String
    }
})

module.exports = mongoose.model('Product', productSchema)