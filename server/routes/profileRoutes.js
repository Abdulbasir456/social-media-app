const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch User Profile (Protected Route)
router.get('/', authMiddleware, profileController.getProfile);

//Updat User Profile (Protected Route)
router.post('/', authMiddleware, profileController.updateProfile);

module.exports = router;