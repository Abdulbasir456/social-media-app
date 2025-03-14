const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorisation')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token '});
    }
};