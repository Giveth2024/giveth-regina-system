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

async function generateInvoiceNumber(connection) {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const datePart = `${year}${month}${day}`;

    const [rows] = await connection.query(
        `
        SELECT invoice_number
        FROM sales
        WHERE invoice_number LIKE ?
        ORDER BY invoice_number DESC
        LIMIT 1
        `,
        [`INV-${datePart}-%`]
    );

    let sequence = 1;

    if (rows.length > 0) {
        const lastInvoice = rows[0].invoice_number;

        const lastSequence = parseInt(lastInvoice.split("-")[2], 10);

        sequence = lastSequence + 1;
    }

    return `INV-${datePart}-${String(sequence).padStart(4, "0")}`;
}

// Update the stock table for each sale item
async function updateStockItem(stockId, glassStatus=null, quantity, tableRows, connection){

    // console.log(tableRows[0].full_quantity);
    if(tableRows[0].full_quantity <= quantity)
    {
        return {
            success : false,
            message : `Avaliable Stock for ${tableRows[0].item_name}: ${tableRows[0].full_quantity}\n Requested: ${quantity}`
        }
    }

    if (glassStatus === "Drinking Here")
    {            
        await connection.query(`
        UPDATE stock
        SET
            full_quantity = full_quantity - ?,
            empty_quantity = empty_quantity + ?
        WHERE id = ?
        AND full_quantity >= ?
    `, [quantity, quantity, stockId, quantity]);

    } 
    else
    {
        await connection.query(`
            UPDATE stock
            SET full_quantity = full_quantity - ?
            WHERE id = ?
            AND full_quantity >= ?
        `, [quantity, stockId, quantity]);
    }

    return {
        success : true
    }

}

module.exports = { successResponses, errorResponse, validateFields, checksIfNumber, generateInvoiceNumber, updateStockItem };