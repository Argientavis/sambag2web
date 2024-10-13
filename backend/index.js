const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes'); // Adjust the path as necessary

dotenv.config();

const app = express();


app.use(cors({ origin:'https://sambag2.vercel.app', credentials: true }));


app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes);
