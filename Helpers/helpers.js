// Helper to handle success responses
const successResponses = (res, statusCode=200, message = "success", data = null) => {
    return res.status(statusCode).json({
        success : true,
        message,
        data
    });
};

// Helper to handle error response.
const errorResponse = (res, message="Somethin went wrong!!!", statusCode=500, errors=null) => {
    return res.status(statusCode).json({
        success : false,
        message,
        errors
    });
};

const validateFields = (body, requiredFields) => {
    // Check if body exists
    if (!body) { 
        return {
            status: false,
            message: "Request body is missing!!!"
        }
    }

    // We deal with missing fields.
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        return (
            {
                status : false,
                message : `Missing required fields: ${missingFields.join(", ")} `
            }
        )
    };

    // We deal with extra fields
    const recievedFields = Object.keys(body);

    const extraFields = recievedFields.filter(field => !requiredFields.includes(field));

    if( extraFields.length > 0) {
        return {
            status : false,
            message: `Unexpected Field(s): ${extraFields.join(", ")}`
        }
    }

    return {
        status : true
    };
}

module.exports = { successResponses, errorResponse, validateFields };