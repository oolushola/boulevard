const mongoose = require('mongoose')
const Schema = mongoose.Schema

const loadingSiteSchema = new Schema({
    loadingSiteCode: {
        type: String,
        required: true
    },
    loadingSite: {
        type: String,
        required: true
    },
    loadingSiteDesc: {
        type: String
    }

}, { timestamps: true })

const loadingSiteModel = mongoose.model('LoadingSite', loadingSiteSchema)

module.exports = loadingSiteModel