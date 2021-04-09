const TonnageModel = require('../models/preferences/tonnage')
const responses = require('../utils/response')
const { validationResult } = require('express-validator')
class Tonnages {
  static getTonnages(req, res, next) {
    const currentPage = Number(req.query.currentPage) || 1
    const perPage = Number(req.query.perPage) || 10
    TonnageModel
      .find({})
      .select('-__v -updatedAt -createdAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .then(tonnages => {
        if(tonnages.length <= 0 ) {
          return responses.successResponse(res, 200, 'no resource added yet', tonnages)
        }
        responses.successResponse(res, 200, 'tonnage lists', tonnages)
    })
    .catch(err => {
      responses.serverErrorResponse(err, 500, next)
    })
  }

  static addTonnage(req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.array())
    }
    const tonnage = req.body.tonnage
    const newTonnage = new TonnageModel({
      tonnage: tonnage
    })
    return newTonnage
      .save()
      .then(tonnage => {
        responses.successResponse(res, 201, 'tonnage added successfully', tonnage)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static getTonnage(req, res, next) {
    const tonnageId = req.params.tonnageId
    TonnageModel
      .findById(tonnageId)
      .select('-__v -updatedAt -createdAt')
      .then(tonnage => {
        if(!tonnage) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        responses.successResponse(res, 200, 'tonnage info', tonnage)
      })
      .catch(err => {
        responses.errorResponse(err, 500, next)
      })
  }

  static updateTonnage(req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.array())
    }
    const tonnageId = req.params.tonnageId
    const tonnage = req.body.tonnage
    TonnageModel
      .findById(tonnageId)
      .then(matchedTonnage => {
        if(!matchedTonnage) {
          return responses.errorResponse(res, 404, 'resource not found')
        }
        matchedTonnage.tonnage = tonnage
        return matchedTonnage.save()
      })
      .then(result => {
        responses.successResponse(res, 200, 'tonnage updated', result)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }
}

module.exports = Tonnages