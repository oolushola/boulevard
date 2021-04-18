const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckSchema = new Schema({
  transporter: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Transporter'
  },
  truckNo: {
    required: true,
    type: String
  },
  truckType: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'TruckType'
  },
  tonnage: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Tonnage'
  }
}, { timestamps: true })

const truckModel = mongoose.model('Truck', TruckSchema)
module.exports = truckModel