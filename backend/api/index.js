const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/auth.routes.js');
  
dotenv.config();

const app = express();

// Allow CORS from your frontend
app.use(cors({ origin: 'https://sambag2.vercel.app', credentials: true }));
app.options('*', cors());

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Base route for the API
app.get("/api", (req, res) => {
  res.send("Hello, welcome to the API!");
});

// Use the auth routes under /api
app.use('/api', authRoutes); // This maps /api/login to the login function

// Export the app as a serverless function for Vercel
module.exports = (req, res) => {
  app(req, res); // Handle requests through Express
};
