const TruckTypeModel = require('../models/preferences/trucktype')
const responses = require('../utils/response')
const { validationResult } = require('express-validator')

class TruckType {
  static getLoadingSites(req, res, next) {
    TruckTypeModel
      .find()
      .then(truckTypes => {
        if(truckTypes.length <= 0) {
          return responses.successResponse(res, 200, 'no resource found', truckTypes)
        }
        responses.successResponse(res, 200, 'truck type resource lists', truckTypes)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static addTruckType(req, res, next) {
    const { truckTypeCode, truckType } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.array())
    }

    const newTruckType = new TruckTypeModel({ 
      truckTypeCode: truckTypeCode,
      truckType: truckType
    })
    return newTruckType.save()
      .then(result => {
        responses.successResponse(res, 201, 'resource created successfully', result)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }
}

module.exports = TruckType