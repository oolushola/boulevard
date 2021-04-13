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
  
}

module.exports = Driver