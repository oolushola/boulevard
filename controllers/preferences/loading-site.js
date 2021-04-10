const LoadingSite = require('../../models/preferences/loadingsite')
const { validationResult } = require('express-validator')
const responses = require('../../utils/response')
const { response } = require('express')

class LoadingSites {
    static getLoadingSites(req, res, next) {
        LoadingSite.find().select('-__v')
            .then(loadingSites => {
                responses.successResponse(
                    res, 
                    200, 
                    'loading sites listings', 
                    loadingSites
                )
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })
    }

    static getLoadingSite(req, res, next) {
        const loadingSiteId = req.params.loadingSiteId.toString()
        LoadingSite.findById(loadingSiteId)
            .then(loadingSiteData => {
                if(!loadingSiteData) {
                    responses.errorResponse(404, 'record not found')
                }
                responses.successResponse(res, 200, `${loadingSiteData.loadingSite} info`, loadingSiteData)
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })

    }

    static createLoadingSite(req, res, next) {
        const loadingSiteCode = req.body.loadingSiteCode
        const loadingSiteName = req.body.loadingSite
        const loadingSiteDesc = req.body.loadingSiteDesc
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            responses.errorResponse(422, 'Validation failed', errors.array())
        }
        const newLoadingSite = new LoadingSite({
            loadingSiteCode: loadingSiteCode,
            loadingSite: loadingSiteName,
            loadingSiteDesc: loadingSiteDesc
        })
        return newLoadingSite.save()
            .then(result => {
               responses.successResponse(res, 201, 'loading site created', result)
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })
    }

    static updateLoadingSite(req, res, next) {
        const loadingSiteId = req.params.loadingSiteId.toString()
        const loadingSiteCode = req.body.loadingSiteCode
        const loadingSiteName = req.body.loadingSite
        const loadingSiteDesc = req.body.loadingSiteDesc
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            responses.errorResponse(422, 'validation failed', errors.array())
        }
        LoadingSite
            .findOne({ loadingSite: loadingSiteName, _id: { $ne: loadingSiteId} })
            .then(loadingSiteData => {
                if(loadingSiteData) {
                    const err = new Error('record already exists')
                    err.statusCode = 409
                    next(err)
                }
                return LoadingSite.findByIdAndUpdate(loadingSiteId, 
                    { $set: {
                        loadingSiteCode: loadingSiteCode,
                        loadingSite: loadingSiteName,
                        loadingSiteDesc: loadingSiteDesc
                     }
                })
                .then(result => {
                    responses.successResponse(res, 200, 'record updated successfully', result)
                })
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })
    }


}

module.exports = LoadingSites