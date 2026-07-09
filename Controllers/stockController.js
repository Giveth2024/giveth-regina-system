const pool = require('../config/db');
const { v4 : uuidv4 } = require("uuid");
const asyncHandler = require('../Helpers/asyncHandler');
const { validateFields, errorResponse, successResponses, checksIfNumber } = require('../Helpers/helpers');

exports.addStock = asyncHandler ( async (req, res) => {
   const { item_name, item_type,  category,  barcode,  unit_type,  full_quantity,  empty_quantity,  low_stock_alert_level,  cost_price,  selling_price } = req.body || {};

   const allowedTypes = ["Direct Sale", "Kitchen"];

   if(!allowedTypes.includes(item_type)) return errorResponse(res, "Error: The item_type must be Direct Sale / Kitchen", 409);

   // Validate fields
   const validation = validateFields(req.body, ["item_name", "item_type", "category", "barcode", "unit_type", "full_quantity", "empty_quantity", "low_stock_alert_level", "cost_price", "selling_price"]);

   // Check for any missing fields
   if (!validation.status) return errorResponse(res, validation.message, 400);

   // validate if we have a number
   const tempArray = [full_quantity, empty_quantity, low_stock_alert_level, cost_price, selling_price];

   for (const item of tempArray)
   {
    const checkIfNumber = checksIfNumber(item);

    if(!checkIfNumber.status) return errorResponse(res, `${checkIfNumber.message}. Make sure the quantity(both full and empty), low stock alert level, cost price and selling price are numbers`, 400);
   }
   
   // generate our data
   const itemId = uuidv4();

   // Calculate out profit.
    const expected_profit = selling_price - cost_price;

    await pool.query("INSERT INTO stock (id, item_name, item_type, category, barcode, unit_type, full_quantity, empty_quantity, low_stock_alert_level, cost_price, selling_price, expected_profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            itemId, 
            item_name, 
            item_type, 
            category, 
            barcode || null, 
            unit_type, 
            full_quantity || 0, 
            empty_quantity || 0, 
            low_stock_alert_level || 0, 
            cost_price || 0, 
            selling_price || 0, 
            expected_profit 
        ])
    
    return successResponses(res, 201, `${item_name} added successfully`);

});