class Responses{
    static errorResponse(code, errorMessage, errors) {
        const error = new Error(errorMessage)
        error.statusCode = code
        error.errorData = errors
        throw error
    }

    static successResponse(res, statusCode, message, data) {
        res.status(statusCode).json({
            message: message,
            result: data
        })
    }

    static serverErrorResponse(err, statusCode, nextObj) {
        if(!err.statusCode) {
            err.satusCode = statusCode
            nextObj(err)
        }
    }
}

module.exports = Responses