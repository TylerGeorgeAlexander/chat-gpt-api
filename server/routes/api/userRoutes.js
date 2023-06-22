const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { extractUserId, requireAuth } = require('../../middleware/authMiddleware');

// Register a user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.login);

// Logout a user
router.post('/logout', userController.logout);

// Get user profile
router.get('/profile', requireAuth, userController.getUserProfile);

// Get search history
router.get('/search-history', requireAuth, userController.getSearchHistory);

// Update search history
router.post('/search-history', requireAuth, userController.updateUserSearchHistory);

// Chat
router.post('/chat', requireAuth, userController.chat);

module.exports = router;
