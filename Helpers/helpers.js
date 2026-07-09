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
    const missingFields = requiredFields.filter(field => {
        if (body[field] === 0) return false // Accept 0
        if (body[field] === null) return false // Accept null
        
        return !body[field]
    });

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

function checksIfNumber(input)
{
    // Check is it a  number
    if (typeof input !== "number") {
        return {
            status: false,
            message: "The value is not a number"
        }
    }

    if (!Number.isFinite(input))
    {
        console.log(input)
        return {
            status: false,
            message : "Number of Infinity and NaN are not allowed"
        }
    }

    // We check if its an integer
    if (Number.isInteger(input)){
        return {
            status: true,
            message: "The value is an integer.",
        }
    }

    return {
        status: true,
        message: "The value is a decimal."
    }
    
}

module.exports = { successResponses, errorResponse, validateFields, checksIfNumber };