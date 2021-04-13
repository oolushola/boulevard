const TransporterModel = require('../../models/transporter')
const responses = require('../../utils/response')

class Transporter {
  static getTransporters(req, res, next) {
    const perPage = req.query.perPage || 1
    const currentPage = req.query.currentPage || 1
    TransporterModel
      .find({})
      .select('-__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort("-1")
      .then(transporters => {
        if(transporters.length <= 0) {
          return responses.successResponse(res, 200, 'no resource yet', transporters)
        }
        responses.successResponse(res, 200, 'transporters resource', transporters)
      })
      .catch(err => {
        responses.errorResponse(err, 500, next)
      })
  }
}

module.exports = Transporter