const jwt = require("jsonwebtoken");
const asyncHandler = require("../Helpers/asyncHandler");
const { errorResponse } = require("../Helpers/helpers");
const pool = require("../config/db");

const protect = asyncHandler (async (req, res, next) => {
    const token = req.cookies.token ;

    // Check if the token exists
    if(!token) return errorResponse(res, "Not authorized, No token provided!!!", 401);

    // We verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.query('SELECT id, full_name, email, username FROM users where id = ?', [decoded.id]);

    if (users.length === 0) return errorResponse(res, "Invalid User Token", 401);

    const user = users[0];

    req.user = user;


    next();

});

module.exports = { protect };