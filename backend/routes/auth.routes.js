const express = require('express');
const { checkAuth,signup,login } = require('../controller/auth.controller.js');
const {verificationToken} = require('../middleware/accessToken.middleware.js')
const router = express.Router();


router.get('check-auth',verificationToken,checkAuth)
router.post('/signup', signup);
router.post('/login', login)

module.exports = router;
