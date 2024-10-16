const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/auth.routes'); // Adjusted path to access auth.routes.js

dotenv.config();

const app = express();

// Allow CORS from your frontend
app.use(cors({ origin: 'https://sambag2.vercel.app', credentials: true }));
app.options('*', cors());

// Base route for the API
app.get("/", (req, res) => {
  res.send("Hello, welcome to the API!");
});

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Use the auth routes under /api
app.use('/api',authRoutes); // This maps /api/login to the login function

// Export the app for Vercel's serverless functions
module.exports = app;
