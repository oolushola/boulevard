const DriverModel = require('../../models/driver')
const responses = require('../../utils/response')
const { validationResult } = require('express-validator')

class Driver {
  static allDrivers(req, res, next) {
    const perPage = req.query.perPage || 10
    const currentPage = req.query.currentPage || 1
    DriverModel
      .find({})
      .select('-__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .then(drivers => {
        if(drivers.length <= 0) return responses.successResponse(
          res, 200, 'drivers resource is empty', drivers
        )
        responses.successResponse(res, 200, 'drivers resource', drivers) 
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static addDriver(req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.mapped())
    }
    const driverFirstName = req.body.driver.firstName
    const driverLastName = req.body.driver.lastName
    const driverPhoneNos = req.body.driver.phoneNo
    const motorboyFirstName = req.body.motorBoy.firstName
    const motorboyLastName = req.body.motorBoy.lastName
    const motorboyPhoneNos = req.body.motorBoy.phoneNo
    const licenceNo = req.body.licenceNo
    
      const newDriver = new DriverModel({
        licenceNo: licenceNo,
        driver: {
          firstName: driverFirstName,
          lastName: driverLastName,
          phoneNo: driverPhoneNos,
        },
        motorBoy: {
          firstName: motorboyFirstName,
          lastName: motorboyLastName,
          phoneNo: motorboyPhoneNos
        }
      })
      return newDriver.save()
        .then(driver => {
          responses.successResponse(res, 201, 'driver resource added', driver)
        })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static getDriver(req, res, next) {
    const driverId = req.params.driverId
    DriverModel
      .findById(driverId)
      .select('-createdAt -updatedAt -__v')
      .then(driver => {
        if(!driver) {
          return responses.errorResponse(res, 404, 'driver resource not found')
        }
        responses.successResponse(res, 200, 'driver resource', driver)
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

  static updateDriver(req, res, next) {
    const driverId = req.params.driverId
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return responses.errorResponse(res, 422, 'validation failed', errors.mapped())
    }
    const licenceNo = req.body.licenceNo
    const driver = req.body.driver
    const motorBoy = req.body.motorBoy
    const documents = req.body.documents
    DriverModel
      .findById(driverId)
      .then(driverResult => {
        if(!driverResult) {
          return responses.errorResponse(res, 404, 'resource not found')
        }        
        driverResult.licenceNo = licenceNo
        driverResult.driver.firstName = driver.firstName
        driverResult.driver.lastName = driver.lastName
        driverResult.driver.phoneNo = driver.phoneNo
        driverResult.motorBoy.firstName = motorBoy.firstName
        driverResult.motorBoy.lastName = motorBoy.lastName
        driverResult.motorBoy.phoneNo = motorBoy.phoneNo
        driverResult.documents = documents
        return driverResult.save()
          .then(result => {
              responses.successResponse(res, 200, 'resource updated', result)
          })
      })
      .catch(err => {
        responses.serverErrorResponse(err, 500, next)
      })
  }

}

module.exports = Driver