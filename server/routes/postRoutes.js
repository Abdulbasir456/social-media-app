const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Create a new post (multipart form-data)
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// Get all posts
router.get('/', authMiddleware, postController.getPosts);

// Toggle like
router.post('/:id/like', authMiddleware, postController.toggleLike);

// Add comment (apply express.json() only here)
router.post('/:id/comment', authMiddleware, express.json(), postController.addComment);

module.exports = router;