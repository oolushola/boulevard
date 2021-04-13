const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driverSchema = new Schema({
  licenceNo: {
    type:String
  },
  driver:{
    firstName: {
      required: true,
      type: String
    },
    lastName: {
      required: true,
      type: String
    },
    phoneNo: []
  },
  motorBoy: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNo: []
  },
  documents: []
  
})

module.exports = mongoose.model('Driver', driverSchema)