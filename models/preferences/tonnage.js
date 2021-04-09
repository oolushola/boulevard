const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TonnageSchema = new Schema({
  tonnage: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Tonnage', TonnageSchema)