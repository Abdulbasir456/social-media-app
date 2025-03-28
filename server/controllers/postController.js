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


// Add like to the post
exports.toggleLike = async (req, res ) => {
    try {
        const post  = await Post.findById(req.params.id);
        const userId = req.userId;

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({ success: true, likesCount: post.likes.length, liked: !isLiked });
    } catch (err) {

        res.status(500).json({ message: 'Failed to toggle like', error: err.message });

    }
};


exports.addComment = async (req, res ) => {
    try {
        const { body } = req.body || {};
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ message: 'Post not found' });
        }

        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }


        post.comments.push({ body, author: req.userId, createdAt: new Date() });
        await post.save();

        res.json({ success: true, comments: post.comments });

    } catch (err) {
        console.error('Error adding comment', err);
        res.status(500).json({ message: 'Failed to add comment', error: err.message });

    }
};


