const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransporterSchema = new Schema({
  assignedTo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    required: true,
    type: String
  },
  companyName: {
    type: String
  },
  contact: [{
    email: {
      type: String,
      required: true
    },
    phoneNo: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  }],
  bankDetails: {
    accountName: {
      required: true,
      type: String,
    },
    accountNo: {
      required: true,
      type: Number
    },
    bankName: {
      required: true,
      type: String
    }
  },
  guarantor: {
    fullName: {
      required: true,
      type: String
    },
    phoneNo: {
      required: true,
      type: String
    },
    email: {
      type: String
    },
    address: {
      type: String,
      required: true
    }
  },
  nextOfKin: {
    fullName: {
      required: true,
      type: String
    },
    phoneNo: {
      type: String
    },
    email: {
      type: String
    },
    address: {
      type: String,
      required: true
    }
  },
  moves: {
    default: 0,
    type: Number
  },
  documents: []

}, { timestamps: true })

module.exports = mongoose.model('Transporter', TransporterSchema)