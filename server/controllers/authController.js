const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const {username, email, password } = req.body;
    try {

        const existingUser = await User.findOne({ $or: [{username}, {email}] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        
        const user = new User({ username, email, password});
        await user.save();
        res.status(201).json({message: 'User registered' });
    } catch (err) {
        res.status(400).json({message: 'Registration failed', error: err.message });

    }
};


exports.login = async (req, res) => {
    const {email, password } = req.body;
    
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password '});
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token to the client(frontend)
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};
