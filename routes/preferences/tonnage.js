const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const tonnageController = require('../../controllers/preferences/tonnage')
const TonnageModel = require('../../models/preferences/tonnage')
const tonnage = require('../../models/preferences/tonnage')

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

router.put(
  '/tonnage/:tonnageId',
  verifyToken,
  userAccess.admin,
  [
    body('tonnage')
    .trim()
    .isNumeric()
    .notEmpty()
    .custom((value, { req }) => {
      return TonnageModel
        .findOne({_id: { $ne: req.params.tonnageId }, tonnage: value })
        .then(doMatch => {
          if(doMatch) {
            return Promise.reject(`${value}T already exists`)
          }
        })
    })
  ],
  tonnageController.updateTonnage
)

module.exports = router