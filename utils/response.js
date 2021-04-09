class Responses{
    static errorResponse(res, code, errorMessage, errors) {
        res.status(code).json({ 
            errorMessage:errorMessage,  
            errorLog: errors 
        })
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