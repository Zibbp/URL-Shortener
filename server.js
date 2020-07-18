const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

connectDB();

// Route files
const urls = require("./routes/urls");

app.use(express.json());
app.use(express.static("./public"));

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 mins
  max: 50,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/", urls);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
