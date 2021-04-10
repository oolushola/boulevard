const ProductModel = require('../../models/preferences/product')
const responses = require('../../utils/response')
const { validationResult } = require('express-validator')
const { response } = require('express')

class Product {
    static allProducts(req, res, next) {
        ProductModel
            .find()
            .select('-__v -updatedAt -createdAt')
            .exec()
            .then(products => {
                if(products.length <=0 ) {
                    return responses.successResponse(res, 200, 'No products yet.')
                }
                responses.successResponse(res, 200, 'product logs', products)
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })
    }

    static createProduct(req, res, next) {
        const productName = req.body.productName
        const productDesc = req.body.productDesc
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            responses.errorResponse(res, 422, 'validation failed', errors.array())
        }

        ProductModel.findOne({
            productName: productName
        })
        .then(product => {
            if(product) {
                return responses.errorResponse(res, 409, 'record already exists')
            }
            const newProduct = new ProductModel({
                productName: productName,
                productDesc: productDesc
            })
            return newProduct.save()
            .then(result => {
                responses.successResponse(res, 201, 'product added.', result)
            })
        })
        .catch(err => {
            responses.serverErrorResponse(err, 500, next)
        })
    }

    static getProduct(req, res, next) {
        const productId = req.params.productId
        ProductModel
            .findById(productId)
            .then(product => {
                if(!product) {
                    return responses.errorResponse(res, 404, 'product not found')
                }
                responses.successResponse(res, 200, 'product info', product)
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })
    }

    static updateProduct(req, res, next) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return responses.errorResponse(res, 422, 'validation failed', errors.array())
        }
        const productName = req.body.productName
        const productDesc = req.body.productDesc
        const productId = req.params.productId
        ProductModel
            .findById(productId)
            .select('-__v')
            .then(product => {
                if(!product) {
                    return responses.errorResponse(res, 404, 'resource not found')
                }
                ProductModel
                    .findOne({ productName: productName, _id: { $ne: productId }})
                    .then(doExists => {
                            if(doExists) {
                                return responses.errorResponse(res, 409, 'resource already exists')
                            }
                            product.productName = productName
                            product.productDesc = productDesc
                            return product.save()
                            .then(updatedProduct => {
                                responses.successResponse(res, 200, 'product updated successfully', updatedProduct)
                            })
                    })
                    
            })
            .catch(err => {
                responses.serverErrorResponse(err, 500, next)
            })
        
    }

    static deleteProduct(req, res, next) {

    }
}

module.exports = Product