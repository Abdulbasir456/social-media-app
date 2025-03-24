const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// Get all posts
router.get('/', authMiddleware, postController.getPosts);

router.post('/:id/like', authMiddleware, postController.toggleLike);

module.exports = router;