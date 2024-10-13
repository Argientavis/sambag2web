const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes'); // Path to auth.routes.js

dotenv.config();

const app = express();

// Allow CORS from your frontend
app.use(cors({ origin: 'https://sambag2.vercel.app', credentials: true }));
app.options('*', cors());

// Base route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the API!");
});

app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes); // Maps the /api routes

// Export the app for Vercel's serverless functions
module.exports = app;
