const Post = require('../models/Post');
const User = require('../models/User');


// Create a new post
exports.createPost = async (req, res) => {

    const { content } = req.body;

    if (!content || content.trim() === '') {
        return  res.status(400).json({ message: 'Post content cannot be empty' });
    }

    try {
        const post = await Post.create({
            userId: req.userId,
            content
        });

        res.status(201).json(post);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create post', error: err.message });
    }
};

// Get all posts (latest first)
exports.getPosts = async (req, res) => {

    try {
        const posts = await Post.find()
        .populate('userId', 'username')
        .sort({ createdAt: -1 });

        res.json(posts);
    }
    catch(err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err.message });

    }
};


