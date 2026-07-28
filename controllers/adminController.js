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
            total_units_per_package
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
            total_units_per_package
        };

        for (const [key, value] of Object.entries(values)) {

            if (
                value !== null &&
                typeof value !== "string" &&
                typeof value !== "number"
            ) {
                return res.status(400).json({
                    success: false,
                    errors : {
                        message: `${key} must be a string, number or null.`
                    }
                });
            }

        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        const id = uuidv4();

        const image="cloudinary-" + name +"-image";

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
            total_units_per_package
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
            [
                stockId,
                id
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            data : {
                message: "Product added successfully.",
                product_id: id
            }
        });

    } catch (error) {

        console.error(error);

        
        await connection.rollback();

        return res.status(500).json({
            success: false,
            errors : {
                message: "Internal server error."
            }
        });

    }
    finally 
    {
        connection.release();
    }
};


exports.addPurchase = async (req, res) => {

    let connection;

    try {

        //=========================================
        // STEP 1: Get data from request body
        //=========================================
        const {
            type,
            product_id,
            quantity,
            cost_price
        } = req.body;

        //=========================================
        // STEP 2: Validate request type
        //=========================================
        if (type !== "product") {
            return res.status(400).json({
                success: false,
                errors: {
                    message: "Invalid purchase type."
                }
            });
        }

        //=========================================
        // STEP 3: Validate input types
        //=========================================
        const values = {
            product_id,
            quantity,
            cost_price
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
                        message: `${key} must be a string, number or null.`
                    }
                });
            }

        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                errors: {
                    message: "Quantity must be greater than 0."
                }
            });
        }

        if (cost_price <= 0) {
            return res.status(400).json({
                success: false,
                errors: {
                    message: "Cost price must be greater than 0."
                }
            });
        }

        //=========================================
        // STEP 4: Calculate total purchase amount
        //=========================================
        const total_amount = quantity * cost_price;

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
            [product_id]
        );

        if (products.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                errors: {
                    message: "Product not found."
                }
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
            [
                purchaseId,
                product_id,
                quantity,
                cost_price,
                total_amount
            ]
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
            [
                quantity,
                quantity,
                product_id
            ]
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
            [
                quantity,
                product_id
            ]
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
                purchase_id: purchaseId
            }
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
                message: "Internal server error."
            }
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