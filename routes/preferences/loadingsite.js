const express = require('express')
const { body } = require('express-validator')
const loadingSiteController = require('../../controllers/loading-site')
const LoadingSite = require('../../models/preferences/loadingsite')
const verifyToken = require('../../utils/middleware/verifyToken')

const router = express.Router()

router.get(
    '/loading-sites',
    verifyToken,
    loadingSiteController.getLoadingSites
)
router.post(
    '/loading-site',
    verifyToken,
    [
        body('loadingSiteCode', 'loading site code is required.').isLength({ min: 3, max: 5 }).isString(),
        body('loadingSite').trim().isString()
            .custom((value, { req }) => {
                return LoadingSite.findOne({ loadingSite: req.body.loadingSite })
                    .then((matched) => {
                        if(matched) {
                            return Promise.reject('loading site already exists')
                        }
                    })
            }),
        body('loadingSiteDesc').isString()
    ],
    loadingSiteController.createLoadingSite
)
router.get('/loading-site/:loadingSiteId', verifyToken, loadingSiteController.getLoadingSite)
router.put(
    '/loading-site/:loadingSiteId',
    verifyToken,
    [
        body('loadingSiteCode', 'loading site code is required.').isLength({ min: 3, max: 5 }).isString(),
        body('loadingSite').trim().isString(),
        body('loadingSiteDesc').isString()
    ],
    loadingSiteController.updateLoadingSite

)

module.exports = router