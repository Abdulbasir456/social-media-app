const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const {username, password } = req.body;
    try {
        const user = new User({ username, password});
        await user.save();
        res.status(201).json({message: 'User registered' });
    } catch (err) {
        res.status(400).json({message: 'Registration failed', error: err.message });

    }
};
