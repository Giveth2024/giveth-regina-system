const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("../Helpers/asyncHandler");
const {
  successResponses,
  generateInvoiceNumber,
  updateStockItem,
} = require("../Helpers/helpers");

exports.addSales = asyncHandler(async (req, res) => {
  const {
    user_id,
    debtor_id,
    creditor_id,
    total_amount,
    amount_paid,
    change_amount,
    items,
  } = req.body || {};

  // Create an id for sales
  const sales_id = uuidv4();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // generate invoice
    const invoice = await generateInvoiceNumber(connection);

    // Values for the query
    const valueQuery = [
      sales_id,
      invoice,
      user_id,
      debtor_id,
      creditor_id,
      total_amount,
      amount_paid,
      change_amount,
    ];

    // Write in the sales table
    await connection.query(
      `
        INSERT INTO sales (
        id,
        invoice_number,
        user_id,
        debtor_id,
        creditor_id,
        total_amount,
        amount_paid,
        change_amount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      valueQuery,
    );

    if (items.length === 0)
      throw new Error(`Items can't be empty!!!`);

    for (const item of items) {
      // Check if it exits
      const [rows] = await connection.query(
        `
                SELECT * FROM stock WHERE id = ?
            `,
        [item.stock_id],
      );

      if (rows.length === 0)
        throw new Error(`Item with id:${item.stock_id} Not Found!!!`,);

      // Genrate a sale_item Id for each item
      const saleItemId = uuidv4();

      const glassStatusValue =
        item.glass_status !== null ? item.glass_status : null;

      const saleItemQuery = `
            INSERT INTO sale_items (
                id,
                sale_id,
                stock_id,
                quantity,
                selling_price,
                glass_fine_per_unit,
                glass_status,
                subtotal,
                profit
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      const valueQuery = [
        saleItemId,
        sales_id,
        item.stock_id,
        item.quantity,
        item.selling_price,
        item.glass_fine_per_unit,
        glassStatusValue,
        item.subtotal,
        item.profit,
      ];

      await connection.query(saleItemQuery, valueQuery);

      // We need to updateStock table
      const result = await updateStockItem(
        item.stock_id,
        item.glass_status,
        item.quantity,
        rows,
        connection,
      );

      if (!result.success) throw new Error(result.message);
    }

    await connection.commit();

    return successResponses(res, 201, "Sales added successfully");
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
});
