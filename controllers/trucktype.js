const TruckTypeModel = require('../models/preferences/trucktype')
const responses = require('../utils/response')

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
}

module.exports = TruckType