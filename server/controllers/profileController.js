const Profile = require('../models/Profile');

//Fetch User Profile
exports.getProfile = async (req, res ) => {
    try {

        const profile = await Profile.findOne({ userId: req.userId }).populate('userId', 'username');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile', error: err.message});
   }
};


// Update User Profile
exports.updateProfile = async (req, res ) => {
    const { bio, profilePicture } = req.body;
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId: req.userId },
            { bio, profilePicture },
            { new: true, upsert: true }
        ).populate('userId', 'username');
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err.message});

    }
};