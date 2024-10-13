const express = require('express');
const { checkAuth, signup, login, logout } = require('../controller/auth.controller.js');
const { verificationToken } = require('../middleware/accessToken.middleware.js');
const router = express.Router();

// Define the routes
router.get('/check-auth', verificationToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login); // Ensure this route is correctly defined
router.post('/logout', logout);

// Export the router
module.exports = router;
