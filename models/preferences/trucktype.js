const mongoose = require('mongoose')
const Schema = mongoose.Schema

const truckTypeSchema = new Schema({
  truckTypeCode: {
    required: true,
    type: String
  },
  truckType: {
    required: true,
    type: String
  }
}, { timestamps: true })

module.exports = mongoose.model('TruckType', truckTypeSchema)