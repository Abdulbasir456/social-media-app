const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    
    const { content } = req.body;
   
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 
    
    
   if (!content && !req.file) { 
        return res.status(400).json({ message: 'Post must have content or image.' });
    }

    try {
        const post = await Post.create({
            userId: req.userId,     // from authMiddleware
            content: content || '', // default to empty string if not provided
            image: imageUrl         // either the uploaded file path or null
        });

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create post', error: err.message });
    }
};


// Get all posts (latest first)
exports.getPosts = async (req, res) => {

    try {
    
        const posts = await Post.find({ userId: req.userId }) // Filter by user
        .populate('userId', 'username')
        .sort({ createdAt: -1 });

        res.json(posts);
    }
    catch(err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err.message });

    }
};


