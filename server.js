const express = require("express");
const dotenv = require("dotenv");
dotenv.config()
const morgan = require('morgan');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');

const db = require('./config/db');

// Routes
const authRoutes = require('./Routes/authRoutes');
const stockRoutes = require('./Routes/stockRoutes');
const salesRoutes = require('./Routes/salesRoutes');
const webRoutes = require('./Routes/webRoutes');
const { errorResponse } = require("./Helpers/helpers");

const app = express();
const PORT = process.env.PORT;

// Middlware
// HTTP Header Security
app.use(helmet());

// Response Compression
app.use(compression());

// For dev
if (process.env.NODE_ENV === 'development')
{
    console.log("Morgan is activatied in development mode:)");
    app.use(morgan('dev'));
}

// 4. Rate Limiting (Allows 100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, 
    standardHeaders: 'draft-7', // Use standard RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: { message: 'Too many requests from this IP, please try again later.' }
});

// Body Parsers
app.use(express.json());
app.use(cookieParser());

//Auth routes
app.use("/api/giveth/auth", authRoutes);
app.use("/api/giveth/stock", stockRoutes);
app.use("/api/giveth/sales", salesRoutes);

app.get("/", (req, res) => {
    res.json({message: "Server is running"});
});

// load html files
app.use(express.static(path.join(__dirname, "public")));

// Web Routes
app.use("/frontend", webRoutes);

// Error for routes that are not created 
app.use((req, res) => {
    return errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// Global Error Handler
app.use((err, req, res, next) => {

    // Database errors
    if (err.code === "ER_NO_SUCH_TABLE") return errorResponse(res, err.sqlMessage, 404);
    if (err.code === "ER_DUP_ENTRY") return errorResponse(res, err.sqlMessage, 409);
    if (err.code === "ER_BAD_NULL_ERROR") return errorResponse(res, err.sqlMessage, 409);
    
    // Handle a syntax error for badly malformed JSON
    if (err.type === "entity.parse.failed")
    {
        return errorResponse(res, "Invald JSON format", 400);
    }

    // JWT ERROR HANDLING
    // Invalid JSON web token
    if (err.name === "TokenExpiredError") return errorResponse(res, "JWT Token Expired", 401);

    // Malformed token
    if (err.name === "JsonWebTokenError") return errorResponse(res, "JWT Token Malformed", 401);

    console.error(err);

    res.status(500).json({
        success : false,
        message: err.message || "Internal Server Error"
    });

    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});