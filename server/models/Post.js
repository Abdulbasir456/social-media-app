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
    }
        
});

module.exports = mongoose.model('Post', postSchema);