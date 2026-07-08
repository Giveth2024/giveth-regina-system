const mysql = require('mysql2/promise');
require('dotenv').config();

// create a pool instead of a single connection
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

async function TestConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Successfully connected to the MySQL Database");
        connection.release();
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
        process.exit(1);
    }
    
}

TestConnection();

module.exports = pool;