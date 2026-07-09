const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require('morgan');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const compression = require('compression');

const db = require('./config/db');

// Routes
const authRoutes = require('./Routes/authRoutes');

const app = express();
const PORT = process.env.PORT;

// Middlware
// HTTP Hader Security
app.use(helmet());

// Response Compression
app.use(compression());

// For dev
app.use(morgan('dev'));

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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success : false,
        message: "Internal Server Error"
    });
});

//Auth routes
app.use("/api/giveth", authRoutes);

app.get("/", (req, res) => {
    res.json({message: "Server is running"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});