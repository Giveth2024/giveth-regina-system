const successResponses = (res, statusCode=200, message = "success", data = null) => {
    return res.status(statusCode).json({
        success : true,
        message,
        data
    });
};

const errorResponse = (res, message="Somethin went wrong!!!", statusCode=500, errors=null) => {
    return res.status(statusCode).json({
        success : false,
        message,
        errors
    });
};

module.exports = { successResponses, errorResponse };