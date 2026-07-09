const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4 : uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

const asyncHandler = require("../Helpers/asyncHandler");
const { errorResponse, successResponses, validateFields } = require("../Helpers/helpers");

exports.register = asyncHandler (async (req, res) => {
    const { full_name, username, email, password, phone_number } = req.body || {};

    // Validate fields
    const validate = validateFields(req.body, ["full_name", "username", "email", "password", "phone_number"]);

    // Ensure all fields are required
    if (!validate.status) return errorResponse(res, validate.message, 400);

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

exports.login = asyncHandler( async (req, res) => {
  const { identifier, password } = req.body || {} // Identifier can be email or username
  
  // Validate fields
  const validate = validateFields(req.body, ["identifier", "password"]);

  // Ensure all fields are required
  if (!validate.status) return errorResponse(res, validate.message, 400);

  // Look up by username or email
  const [users] = await pool.query('SELECT * FROM users WHERE email = ? OR username =?', [identifier, identifier]);

  // For security reasons. (don't reveal if user exists or not)
  if (users.length === 0) return errorResponse(res, "Invalid credentials", 401);

  const user = users[0];

  // Check if the passwords match
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return errorResponse(res, "Invalid credentials", 401);

  const payload = {
    id : user.id,
    username : user.username,
    email : user.email
  }

  // We sign the credentials along with jwt
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn : process.env.JWT_EXPIRES_IN}
  )

  const isProduction = process.env.NODE_ENV === "production";

  // Set up the cookie
  res.cookie('token', token, {
    httpOnly : true,
    secure : isProduction,
    sameSite : 'strict', // Helps to prevent CSRF attacks
    maxAge : 24 * 60 * 60 * 1000
  });

  return successResponses(res, 200, "Login successful!!", {
    full_name : user.full_name
  });

});
