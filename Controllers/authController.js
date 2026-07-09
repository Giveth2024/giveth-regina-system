const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4 : uuidv4 } = require('uuid');

const asyncHandler = require("../Helpers/asyncHandler");
const { errorResponse, successResponses } = require("../Helpers/helpers");

exports.register = asyncHandler (async (req, res) => {
    const { full_name, username, email, password, phone_number } = req.body || {};

    if(!full_name || !username || !password || !email || !phone_number)
    {
      return errorResponse(res, "Please fill out all required fields!", 400);
    }

    // Check if the user already exits
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUsers.length > 0) return errorResponse(res, "Username or Email is already Registered!", 409);

    // Hash password (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to the database
    const [result] = await pool.query('INSERT INTO users (id, full_name, username, email, password, phone_number) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), full_name, username, email, hashedPassword, phone_number]);

    return successResponses(res, 201, "Registration was successful", {result : result});

});