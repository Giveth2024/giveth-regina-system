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