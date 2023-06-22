const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Register a user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.login);

// Get user profile
router.get('/profile', userController.getUserProfile);

module.exports = router;
