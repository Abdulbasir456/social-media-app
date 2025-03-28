const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        required: false,// Allow empty content
        trim: true
    },

    createdAt: {

        type: Date,
        default: Date.now
    },

    image: {
        type: String,
        default: null
    },
    
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    comments: [
        {
            body: String,
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
        
});

module.exports = mongoose.model('Post', postSchema);