const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes'); // Adjust the path as necessary

dotenv.config();

const app = express();


app.use(cors({ origin: "https://sambag2.vercel.app", credentials: true }));

// Handle preflight OPTIONS requests
app.options("*", cors({ origin: "https://sambag2.vercel.app", credentials: true }));

// Optional: Set CORS headers manually if needed for certain responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://sambag2.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes);
