const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require('morgan');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const db = require('./config/db');

// Routes
const authRoutes = require('./Routes/authRoutes');
const { errorResponse } = require("./Helpers/helpers");

const app = express();
const PORT = process.env.PORT;

// Middlware
// HTTP Hader Security
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
app.use("/api/giveth", authRoutes);

app.get("/", (req, res) => {
    res.json({message: "Server is running"});
});

// Error for routes that are not created 
app.use((req, res) => {
    return errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    // Handle a syntax error for badly malformed JSON
    if (err.type === "entity.parse.failed")
    {
        return errorResponse(res, "Invald JSON format", 400);
    }

    res.status(500).json({
        success : false,
        message: "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});