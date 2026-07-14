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

    return successResponses(res, 200, `Stock with id:${id} updated successfully.`, {
        data : updateQuery
    });

});

// Get all stock
exports.getStock = asyncHandler(async (req, res) => {
    // Grab optional params from url
    const { category, item_type, search, unit_type, low_stock, out_of_stock, no_empty_bottles, sort_by, order } = req.query;
    let limit = parseInt(req.query.limit, 10);
    let page = parseInt(req.query.page, 10);
    const max_selling_price = parseFloat(req.query.max_selling_price, 10);
    const min_selling_price = parseFloat(req.query.min_selling_price, 10);
    const max_cost_price = parseFloat(req.query.max_cost_price, 10);
    const min_cost_price = parseFloat(req.query.min_cost_price, 10);

    // set the query
    let sqlQuery = "SELECT * FROM stock WHERE deleted_at is NULL";

    // Array for params
    const queryParams = [];

    // Add category if its in the url
    if (category) {
        sqlQuery += " AND category = ?";
        queryParams.push(category);
    }

    // item type if it exists in the url
    if (item_type)
    {
        sqlQuery += " AND item_type = ?";
        queryParams.push(item_type);
    }

    // unit type if it exists in the url
    if (unit_type)
    {
        sqlQuery += " AND unit_type = ?";
        queryParams.push(unit_type);
    }

    // if true we handle low stock levels
    if (low_stock === "true")
    {
        sqlQuery += " AND full_quantity <= low_stock_alert_level";

    }

    // if true we handle no stock
    if (out_of_stock === "true")
    {
        sqlQuery += " AND full_quantity = 0";
    }

    // if true we handle no empty bottles
    if (no_empty_bottles === "true")
    {
        sqlQuery += " AND empty_quantity = 0";
    }

    // Search for id, barcode and item Name
    if (search) {
        sqlQuery += " AND (id = ? OR barcode = ? OR item_name LIKE ?)";

        // Create a wildcard to look for what you want anywhere in MYSQL
        const wildCard = `%${search}%`;

        queryParams.push(search, search, wildCard);
    }

    // Add selling price filter
    if(!isNaN(max_selling_price))
    {
        sqlQuery += " AND selling_price <= ?";
        queryParams.push(max_selling_price);
    }

    if(!isNaN(min_selling_price))
    {
        sqlQuery += " AND selling_price >= ?";
        queryParams.push(min_selling_price);
    }

    // Add cost price filter
    if(!isNaN(max_cost_price))
    {
        sqlQuery += " AND cost_price <= ?";
        queryParams.push(max_cost_price);
    }

    if(!isNaN(min_cost_price))
    {
        sqlQuery += " AND cost_price >= ?";
        queryParams.push(min_cost_price);
    }

    console.log("Executing Query:", sqlQuery);
    console.log("With Params:", queryParams);

    if(!Number.isInteger(limit) || limit <= 0) limit = 50;
    if(!Number.isInteger(page) || page <= 0) page = 1;

    // calculate how many times to skip
    const offset = (page - 1) * limit;
    
    // Get the list of columns that can be sorted
    const allowedSortColumns = ["item_name", "selling_price", "cost_price", "full_quantity", "empty_quantity", "expected_profit", "created_at"];
    const activeSortColumn = allowedSortColumns.includes(sort_by) ? sort_by : 'item_name';

    // Determine the order
    const activeOrder = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

    // Add it to the query
    sqlQuery += ` ORDER BY ${activeSortColumn} ${activeOrder}`;
    
    // Add limits
    sqlQuery += ' LIMIT ? OFFSET ?'
    queryParams.push(limit, offset);


    const [items] = await pool.query(sqlQuery, queryParams);

    if (items.length === 0) return errorResponse(res, "Item Can't be Found", 404);

    return successResponses(res, 200, "Items have been Fetched Successfully", {
        rowsRequested : limit,
        currentPage : page,
        filtersApplied : {
            search : search || null,
            category : category || 'all',
            item_type : item_type || 'all',
            unit_type : unit_type || 'all',
            low_stock : low_stock === "true",
            out_of_stock : out_of_stock === "true",
            no_empty_bottles : no_empty_bottles === "true",
            sort_by : activeSortColumn,
            order : activeOrder,
            price_bounds : {
                max_selling_price : !isNaN(max_selling_price) ? max_selling_price : null,
                min_selling_price : !isNaN(min_selling_price) ? min_selling_price : null,
                max_cost_price : !isNaN(max_cost_price) ? max_cost_price : null,
                min_cost_price : !isNaN(min_cost_price) ? min_cost_price : null
            }
        },
        count : items.length,
        data : items
    });
}); 

// GET STOCK REQUESTS
/*
16. Products with empty bottle
SELECT *
FROM stock
WHERE deleted_at IS NULL
AND empty_quantity = 0;

17. Products with empty bottle but within the beer category

18 Products with no empty bottles
SELECT *
FROM stock
WHERE deleted_at IS NULL
AND empty_quantity = 0;

19. Recently Added (added a created_at column)

20 Alaphaetical order

20 Reverse Alaphaetical order

24. Multiple Filters together
SELECT *
FROM stock
WHERE deleted_at IS NULL
AND item_type = 'Direct Sale'
AND category = 'Beer'
AND full_quantity > 20
AND selling_price < 5000;

25. Items that where deleted

*/