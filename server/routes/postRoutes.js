const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');



// Create post
router.post('/', authMiddleware, postController.createPost);


// Get all posts
router.get('/', authMiddleware, postController.getPosts);

module.exports = router;