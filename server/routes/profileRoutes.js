
/*
const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

// Fetch User Profile (Protected Route)
router.get('/', authMiddleware, profileController.getProfile);

//Updat User Profile (Protected Route)
router.post('/', authMiddleware, profileController.updateProfile);

// Follow/Unfollow a user
router.post('/:id/follow', authMiddleware, profileController.followUser);


module.exports = router;
*/

const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch User Profile (Protected Route)
router.get('/', authMiddleware, profileController.getProfile);

// Update User Profile (Protected Route)
router.post('/', authMiddleware, profileController.updateProfile);

// Get all users (this route needs to be placed before the dynamic ID route)
//router.get('/users', authMiddleware, profileController.getAllUsers);

// Follow/Unfollow a user
router.post('/:id/follow', authMiddleware, profileController.followUser);

// Fetch another user's profile
router.get('/:id', authMiddleware, profileController.getOtherUserProfile);


// Search for users by username
router.get('/search/:username', authMiddleware, profileController.searchUsers);


// Fetch posts by user ID
//router.get('/api/posts/user/:id', authMiddleware, profileController.getUserPosts);



module.exports = router;

