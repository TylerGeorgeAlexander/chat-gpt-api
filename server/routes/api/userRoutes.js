const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Register a user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.login);

// Logout a user
router.post('/logout', userController.logout);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update search history
router.post('/search-history', userController.updateUserSearchHistory);


module.exports = router;
