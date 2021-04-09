const TruckTypeModel = require('../models/preferences/trucktype')
const responses = require('../utils/response')
const { validationResult } = require('express-validator')
const { response } = require('express')

class TruckType {
  static getTruckTypes(req, res, next) {
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

  static getTruckType(req, res, next) {
    const truckTypeId = req.params.truckTypeId
    TruckTypeModel.findById(truckTypeId)
      .then(truckType => {
        if(!truckType) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        return responses.successResponse(res, 200, 'truck type details', truckType)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static updateTruckType(req, res, next) {
    const truckTypeId = req.params.truckTypeId
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.array())
    }
    TruckTypeModel.findById(truckTypeId)
    .select('-__v -updatedAt -createdAt')
    .then(matchedTruckType => {
      if(!matchedTruckType) {
        return responses.errorResponse(res, 404, 'resource not found')
      }
      const truckTypeCode = req.body.truckTypeCode
      const truckType = req.body.truckType
      matchedTruckType.truckTypeCode = truckTypeCode
      matchedTruckType.truckType = truckType
      return matchedTruckType.save()
    })
    .then(result => {
      responses.successResponse(res, 200, 'truck type updated', result)
    })
    .catch(err => {
      responses.serverErrorResponse(err, 500, next)
    })
  }
}

module.exports = TruckType