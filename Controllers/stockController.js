const pool = require('../config/db');
const { v4 : uuidv4 } = require("uuid");
const asyncHandler = require('../Helpers/asyncHandler');
const { validateFields, errorResponse, successResponses, checksIfNumber } = require('../Helpers/helpers');

// Add stock
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

// Delete Stock
exports.deleteStock = asyncHandler(async (req, res) => {
   const { id } = req.params;

   // carry out a soft delete where deleted is null
   const [results] = await pool.query('UPDATE stock SET deleted_at = NOW() WHERE id = ? AND deleted_at is NULL', [ id ]);

   // check if the item was deleted
   if (results.affectedRows === 0) return errorResponse(res, `Stock with id:${id} cannot be found or was already deleted`, 404);

   return successResponses(res, 200, `Stock with id:${id} deleted successfully`);
});

// Updating stock
exports.updateStock = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const {
    item_name,
    item_type,
    category,
    barcode,
    unit_type,
    full_quantity,
    empty_quantity,
    low_stock_alert_level,
    cost_price,
    selling_price
   } = req.body || {}

   // Validate fields
   const validation = validateFields(req.body, ["item_name", "item_type", "category", "barcode", "unit_type", "full_quantity", "empty_quantity", "low_stock_alert_level", "cost_price", "selling_price"]);

   // Check for any missing fields
   if (!validation.status) return errorResponse(res, validation.message, 400);

   // validate if we have a number
   const tempArray = [full_quantity, empty_quantity, low_stock_alert_level, cost_price, selling_price];

   for (const item of tempArray)
   {
    const checkIfNumber = checksIfNumber(item);

    if(!checkIfNumber.status) {
        if(item === null) continue; // Skip if number

        return errorResponse(res, `${checkIfNumber.message}. Make sure the quantity(both full and empty), low stock alert level, cost price and selling price are numbers`, 400);
    }
   }

   // Check if it exists
   const [stock] = await pool.query('SELECT id FROM stock WHERE id=? and deleted_at is NULL', [id]);
   if (stock.length === 0) return errorResponse(res, `Stock with id:${id} can't be found`, 404);

   // Check if selleing price and cost pirce are we make sure that are null, if they are we use the one in the DB
   const finalCost = cost_price !== null ? cost_price : stock[0].cost_price;
   const finalSelling = selling_price !== null ? selling_price : stock[0].selling_price;
   // But if the selling price and cost price are both null them we make it null or calculate the expected profit.
   const expected_profit = selling_price === null || cost_price === null ? null : finalSelling - finalCost;

   const queryFields = [item_name, item_type, category, barcode, unit_type, full_quantity, empty_quantity, low_stock_alert_level, cost_price, selling_price, expected_profit, id]

   // COALESCE(?, column_name) preserves the old value if the parameter is NULL
   const updateQuery = await pool.query(`UPDATE stock 
        SET 
            item_name = COALESCE(?, item_name),
            item_type = COALESCE(?, item_type),
            category = COALESCE(?, category),
            barcode = COALESCE(?, barcode),
            unit_type = COALESCE(?, unit_type),
            full_quantity = COALESCE(?, full_quantity),
            empty_quantity = COALESCE(?, empty_quantity),
            low_stock_alert_level = COALESCE(?, low_stock_alert_level),
            cost_price = COALESCE(?, cost_price),
            selling_price = COALESCE(?, selling_price),
            expected_profit = COALESCE(?, expected_profit)
        WHERE id = ? AND deleted_at IS NULL`, queryFields);

    return successResponses(res, 200, `Stock with id:${id} updated successfully.`);

});