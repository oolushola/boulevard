const TruckModel = require('../../models/truck')
const { validationResult } = require('express-validator')
const responses = require('../../utils/response')

class Truck {
  static getTrucks(req, res, next) {
    const perPage = Number(req.query.perPage) || 1
    const currentPage = Number(req.query.currentPage) || 1
    TruckModel
      .find({})
      .select('-__v -createdAt -updatedAt')
      .populate('transporter truckType tonnage', 'companyName firstName lastName tonnage truckType -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .then(trucks => {
        responses.successResponse(
          res,
          200,
          'truck resources',
          trucks
        )
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static addTruck(req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(
        res, 
        422,
        'validation failed',
        errors.mapped()
      )
    }
    const transporter = req.body.transporter
    const truckType = req.body.truckType
    const tonnage = req.body.tonnage
    const truckNo = req.body.truckNo
    TruckModel
      .findOne({truckNo: truckNo})
      .then(truck => {
        if(truck) {
          return responses.errorResponse(
            res, 
            409,
            'truck resource already exists'
          )
        }
        const newTruck = new TruckModel({
          transporter: transporter,
          truckNo: truckNo,
          tonnage: tonnage,
          truckType: truckType
        })
        return newTruck.save()
        .then(result => {
          responses.successResponse(
            res,
            201,
            'truck resource added',
            result
          )
        })
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static getTruck(req, res, next) {
    const truckId = req.params.truckId
    TruckModel
      .findById(truckId)
      .select('-__v -createdAt -updatedAt')
      .populate('transporter truckType tonnage', 'companyName firstName lastName tonnage truckType -_id')
      .then(truck => {
        if(!truck) {
          return responses.errorResponse(
            res,
            404,
            'resource not found'
          )
        }
        responses.successResponse(
          res,
          200,
          'truck resource',
          truck
        )
      })
      .catch(err => {
        responses.serverErrorResponse(
          err,
          500,
          next
        )
      })
  }

  static updateTruck(req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(
        res,
        422, 
        'validation failed',
        errors.mapped()
      )
    }
    const truckId = req.params.truckId
    const truckNo = req.body.truckNo
    const transporter = req.body.transporter
    const tonnage = req.body.tonnage
    const truckType = req.body.truckType
    TruckModel
      .findById(truckId)
      .then(truck => {
        if(!truck) {
          return responses.errorResponse(
            res,
            404,
            'resource not found'
          )
        }
        truck.truckNo = truckNo
        truck.transporter = transporter
        truck.tonnage = tonnage
        truck.truckType = truckType
        return truck.save()
          .then(result => {
            responses.successResponse(
              res,
              200,
              'resource updated successfully',
              result
            )
          })
      })
      .catch(err => {
        responses.serverErrorResponse(
          err,
          500,
          next
        )
      })
  }

}

module.exports = Truck