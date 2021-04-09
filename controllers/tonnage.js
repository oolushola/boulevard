const TonnageModel = require('../models/preferences/tonnage')
const responses = require('../utils/response')

class Tonnages {
  static getTonnages(req, res, next) {
    const currentPage = req.query.currentPage || 1
    const perPage = req.query.perPage || 10
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
}

module.exports = Tonnages