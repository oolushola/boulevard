const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const tonnageController = require('../../controllers/tonnage')
const TonnageModel = require('../../models/preferences/tonnage')

router.get(
  '/tonnages',
  tonnageController.getTonnages
)

router.post(
  '/tonnage',
  verifyToken,
  userAccess.admin,
  [
    body('tonnage')
      .isNumeric()
      .notEmpty()
      .trim()
      .custom((value, { req }) => {
        return TonnageModel
          .findOne({ tonnage: req.body.tonnage })
          .then(tonnage => {
            if(tonnage) {
              return Promise.reject(`${value} already exists`)
            }
          })
      })
  ],
  tonnageController.addTonnage
)

router.get(
  '/tonnage/:tonnageId',
  tonnageController.getTonnage
)

module.exports = router