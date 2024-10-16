const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');

dotenv.config();

const app = express();

// Allow CORS from your frontend
app.use(cors({ origin: 'https://sambag2.vercel.app', credentials: true }));
app.options('*', cors());

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Base route for the API (root)
app.get('/', (req, res) => {
  res.send("Hello, welcome to the API!"); // Message when accessing /
});

app.get("/login", (req, res) => {
  res.send("Hello, welcome to the API!"); // Message when accessing /
});


// Auth routes (under /api)
app.use('/api', authRoutes);

// Handle 404 for other routes
app.use((req, res) => {
  res.status(404).send("404: Not Found");
});

// Export the app as a serverless function for Vercel
module.exports = (req, res) => {
  app(req, res); // Handle requests through Express
};
