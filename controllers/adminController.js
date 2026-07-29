const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      unit,
      category,
      barcode,
      quantity,
      cost_price,
      selling_price,
      profit,
      reorder_level,
      expiry_date,
      total_units_per_package,
    } = req.body;

    // Validate that every field is either a string, number, or null.
    const values = {
      name,
      unit,
      category,
      barcode,
      quantity,
      cost_price,
      selling_price,
      profit,
      reorder_level,
      expiry_date,
      total_units_per_package,
    };

    for (const [key, value] of Object.entries(values)) {
      if (
        value !== null &&
        typeof value !== "string" &&
        typeof value !== "number"
      ) {
        return res.status(400).json({
          success: false,
          errors: {
            message: `${key} must be a string, number or null.`,
          },
        });
      }
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const id = uuidv4();

    const image = "cloudinary-" + name + "-image";

    const sql = `
            INSERT INTO products
            (
                id,
                name,
                unit,
                category,
                barcode,
                quantity,
                cost_price,
                selling_price,
                profit,
                reorder_level,
                image,
                expiry_date,
                total_units_per_package
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    await connection.execute(sql, [
      id,
      name,
      unit,
      category,
      barcode,
      quantity,
      cost_price,
      selling_price,
      profit,
      reorder_level,
      image,
      expiry_date,
      total_units_per_package,
    ]);

    const stockId = uuidv4();

    await connection.execute(
      `
            INSERT INTO stock (
                id,
                product_id
            )
            VALUES (?, ?)
            `,
      [stockId, id],
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      data: {
        message: "Product added successfully.",
        product_id: id,
      },
    });
  } catch (error) {
    console.error(error);

    await connection.rollback();

    return res.status(500).json({
      success: false,
      errors: {
        message: "Internal server error.",
      },
    });
  } finally {
    connection.release();
  }
};

exports.addPurchase = async (req, res) => {
  let connection;

  try {
    //=========================================
    // STEP 1: Get data from request body
    //=========================================
    const { type, product_id, quantity, cost_price } = req.body;

    //=========================================
    // STEP 2: Validate request type
    //=========================================
    if (type !== "product") {
      return res.status(400).json({
        success: false,
        errors: {
          message: "Invalid purchase type.",
        },
      });
    }

    //=========================================
    // STEP 3: Validate input types
    //=========================================
    const values = {
      product_id,
      quantity,
      cost_price,
    };

    for (const [key, value] of Object.entries(values)) {
      if (
        value !== null &&
        typeof value !== "string" &&
        typeof value !== "number"
      ) {
        return res.status(400).json({
          success: false,
          errors: {
            message: `${key} must be a string, number or null.`,
          },
        });
      }
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        errors: {
          message: "Quantity must be greater than 0.",
        },
      });
    }

    if (cost_price <= 0) {
      return res.status(400).json({
        success: false,
        errors: {
          message: "Cost price must be greater than 0.",
        },
      });
    }

    const [rows] = await pool.execute(
      `
            SELECT balance
            FROM balance
            WHERE id = 1
            `,
    );

    const balance = Number(rows[0].balance);

    //=========================================
    // STEP 4: Calculate total purchase amount
    //=========================================
    const total_amount = quantity * cost_price;

    if (total_amount > balance) {
      return res.status(400).json({
        success: false,
        errors: {
          message: "Insufficient balance to complete this purchase.",
        },
      });
    }

    //=========================================
    // STEP 5: Connect to database
    //=========================================
    connection = await pool.getConnection();

    //=========================================
    // STEP 6: Begin transaction
    //=========================================
    await connection.beginTransaction();

    //=========================================
    // STEP 7: Ensure product exists
    //=========================================
    const [products] = await connection.execute(
      `
            SELECT id
            FROM products
            WHERE id = ?
            AND deleted_at IS NULL
            `,
      [product_id],
    );

    if (products.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        errors: {
          message: "Product not found.",
        },
      });
    }

    //=========================================
    // STEP 8: Insert purchase
    //=========================================
    const purchaseId = uuidv4();

    await connection.execute(
      `
            INSERT INTO purchases
            (
                id,
                product_id,
                quantity,
                cost_price,
                total_amount
            )
            VALUES (?, ?, ?, ?, ?)
            `,
      [purchaseId, product_id, quantity, cost_price, total_amount],
    );

    //=========================================
    // STEP 9: Update stock table
    //=========================================
    await connection.execute(
      `
            UPDATE stock
            SET
                total_purchases = total_purchases + ?,
                current_quantity = current_quantity + ?
            WHERE product_id = ?
            `,
      [quantity, quantity, product_id],
    );

    //=========================================
    // STEP 10: Update product quantity
    //=========================================
    await connection.execute(
      `
            UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?
            `,
      [quantity, product_id],
    );

    // update the balance table
    await connection.execute(
      `
            UPDATE balance
            SET balance = balance - ?
            WHERE id = 1
            `,
      [total_amount],
    );

    //=========================================
    // STEP 11: Everything succeeded
    // Commit transaction
    //=========================================
    await connection.commit();

    return res.status(201).json({
      success: true,
      data: {
        message: "Purchase recorded successfully.",
        purchase_id: purchaseId,
      },
    });
  } catch (error) {
    console.error(error);

    //=========================================
    // Rollback if transaction has started
    //=========================================
    if (connection) {
      await connection.rollback();
    }

    return res.status(500).json({
      success: false,
      errors: {
        message: "Internal server error.",
      },
    });
  } finally {
    //=========================================
    // Always release the connection
    //=========================================
    if (connection) {
      connection.release();
    }
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        errors: {
          message: "Search value is required.",
        },
      });
    }

    const [products] = await pool.execute(
      `
            SELECT
                id,
                name,
                barcode,
                quantity,
                cost_price,
                selling_price,
                unit,
                category
            FROM products
            WHERE deleted_at IS NULL
            AND
            (
                id = ?
                OR barcode = ?
                OR name LIKE ?
            )
            LIMIT 20
            `,
      [search, search, `%${search}%`],
    );

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      errors: {
        message: "Internal server error.",
      },
    });
  }
};

exports.createSale = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { payment_type, amount_paid, items } = req.body;

    // Basic validation
    if (!payment_type || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        errors: {
          message: "Invalid request.",
        },
      });
    }

    await connection.beginTransaction();

    // Generate invoice number
    const invoice_number = await generateInvoiceNumber(connection);

    const sale_id = uuidv4();

    let total_amount = 0;

    const saleItems = [];

    // Loop through every product
    for (const item of items) {
      const [productRows] = await connection.execute(
        `
                SELECT
                    id,
                    name,
                    quantity,
                    selling_price,
                    cost_price
                FROM products
                WHERE id = ?
                AND deleted_at IS NULL
                `,
        [item.id],
      );

      if (productRows.length === 0) {
        throw new Error(`${item.name} does not exist.`);
      }

      const product = productRows[0];

      // Enough stock?
      if (Number(product.quantity) < Number(item.sale_quantity)) {
        throw new Error(`${product.name} has insufficient stock.`);
      }

      const selling_price = Number(product.selling_price);

      const cost_price = Number(product.cost_price);

      const quantity = Number(item.sale_quantity);

      const subtotal = selling_price * quantity;

      const profit = (selling_price - cost_price) * quantity;

      total_amount += subtotal;

      saleItems.push({
        id: uuidv4(),

        sale_id,

        product_id: product.id,

        quantity,

        selling_price,

        subtotal,

        profit,
      });
    }

    // Calculate change on server
    const change_amount = Number(amount_paid) - total_amount;

    if (change_amount < 0) {
      throw new Error("Amount paid is less than the total amount.");
    }

    // Insert sale
    await connection.execute(
      `
            INSERT INTO sales
            (
                id,
                invoice_number,
                payment_type,
                total_amount,
                amount_paid,
                change_amount
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
      [
        sale_id,
        invoice_number,
        payment_type,
        total_amount,
        amount_paid,
        change_amount,
      ],
    );

    // Insert every sale item
    for (const item of saleItems) {
      await connection.execute(
        `
                INSERT INTO sale_items
                (
                    id,
                    sale_id,
                    product_id,
                    quantity,
                    selling_price,
                    subtotal,
                    profit
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
        [
          item.id,
          item.sale_id,
          item.product_id,
          item.quantity,
          item.selling_price,
          item.subtotal,
          item.profit,
        ],
      );

      // Reduce product quantity
      await connection.execute(
        `
                UPDATE products
                SET quantity = quantity - ?
                WHERE id = ?
                `,
        [item.quantity, item.product_id],
      );

      // Update stock table
      await connection.execute(
        `
                UPDATE stock
                SET
                    total_sales = total_sales + ?,
                    current_quantity = current_quantity - ?
                WHERE product_id = ?
                `,
        [item.quantity, item.quantity, item.product_id],
      );
    }

    // Update balance after successful sale
await connection.execute(
    `
    UPDATE balance
    SET balance = balance + ?
    WHERE id = 1
    `,
    [total_amount]
);


    await connection.commit();

    return res.status(201).json({
      success: true,

      data: {
        invoice_number,

        total_amount,

        amount_paid,

        change_amount,

        message: "Sale completed successfully.",
      },
    });
  } catch (error) {
    console.error(error);

    await connection.rollback();

    return res.status(500).json({
      success: false,

      errors: {
        message: error.message,
      },
    });
  } finally {
    connection.release();
  }
};

// Invoice Generator
async function generateInvoiceNumber(connection) {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const time =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const prefix = `INV-${date}-${time}`;

  const [rows] = await connection.execute(
    `
        SELECT COUNT(*) AS total
        FROM sales
        WHERE invoice_number LIKE ?
        `,
    [`${prefix}-%`],
  );

  const sequence = rows[0].total + 1;

  return `${prefix}-${sequence}`;
}
