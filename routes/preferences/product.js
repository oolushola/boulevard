const express = require('express')
const { body } = require('express-validator')
const verifyToken = require('../../utils/middleware/verifyToken')
const userAccess = require('../../utils/middleware/user-access')
const productController = require('../../controllers/product')

const router = express.Router()

router.get(
    '/products', 
    verifyToken, 
    productController.allProducts
)
router.post(
    '/product', 
    verifyToken,
    [
        body('productName').notEmpty().trim(),
        body('productDesc').notEmpty().trim()
    ],
    userAccess.admin,
    productController.createProduct
)
router.get(
    '/product/:productId', 
    verifyToken,
    productController.getProduct
)
router.put(
    '/product/:productId', 
    verifyToken,
    [
        body('productName').notEmpty().trim(),
        body('productDesc').notEmpty().trim()
    ],
    userAccess.admin,
    productController.updateProduct
)
router.delete('/product/:productId', verifyToken)

module.exports = router