const { Decimal128 } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
  hasParentCompany: {
    required: true,
    type: Boolean
  },
  parentCompany: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  clientName: {
    required: true,
    type: String
  },
  clientAlias: {
    required: true,
    type: String
  },
  clientLogo: {
    required: true,
    type: String
  },
  contactInfo: [{
    email: {
      type: String,
      required: true
    },
    phoneNo: {
      type: String,
      required: true
    },
    streetName: {
      required: true,
      type: String
    }, 
    city: {
      required: true,
      type: String
    },
    state: {
      required: true,
      type: String
    },
    country: {
      required: true,
      type: String,
    }
  }],
  personOfContact: [{
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String
    },
    phoneNo: {
      required: true, 
      type: String
    }
  }],
  clientStatus: {
    type: Boolean,
    default: true
  },
  expectedMargin: {
    type: Decimal128
  },
  bankName: {
    type: String
  },
  accountNo: {
    type: String
  },
  accountName: {
    type: String
  },
  loadingSites: [{
    loadingSiteId: {
      type: Schema.Types.ObjectId,
      ref: 'LoadingSite'
    }
  }],
  products: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    }]
  }
}, { timestamps: true })

module.exports = mongoose.model('Client', clientSchema)