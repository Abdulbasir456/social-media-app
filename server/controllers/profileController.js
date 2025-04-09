const Profile = require('../models/Profile');
const User = require('../models/User');

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


// Follow/Unfollow User
exports.followUser = async (req, res) => {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.userId;

      console.log("Target User ID:", targetUserId);
      console.log("Current User ID:", currentUserId);
  
      // Cannot follow oneself
      if (targetUserId === currentUserId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
  
      // Fetch both profiles in a single query
      const [currentUserProfile, targetUserProfile] = await Promise.all([
        Profile.findOne({ userId: currentUserId }),
        Profile.findOne({ userId: targetUserId })
      ]);
  
      if (!targetUserProfile) {
        return res.status(404).json({ message: "User to follow not found" });
      }
  
      // Check if the current user already follows the target user
      const isFollowing = currentUserProfile.following.includes(targetUserId);
  
      if (isFollowing) {
        // Unfollow
        currentUserProfile.following.pull(targetUserId);
        targetUserProfile.followers.pull(currentUserId);
        await Promise.all([currentUserProfile.save(), targetUserProfile.save()]);
        return res.json({ message: "Successfully unfollowed the user" });
      } else {
        // Follow
        currentUserProfile.following.push(targetUserId);
        targetUserProfile.followers.push(currentUserId);
        await Promise.all([currentUserProfile.save(), targetUserProfile.save()]);
        return res.json({ message: "Successfully followed the user" });
      }
  
    } catch (err) {
      console.error('Failed to follow/unfollow user:', err.message);  // Improved error logging
      res.status(500).json({ message: 'Failed to follow/unfollow user', error: err.message });
    }
  };


  exports.getOtherUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const profile = await Profile.findOne({ userId }).populate('userId', 'username');
        if (!profile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
    }
};


// Search for users by username
exports.searchUsers = async (req, res) => {
    try {
        const username = req.params.username;

        // Find users whose username matches (case-insensitive)
        const users = await User.find({ username: { $regex: new RegExp(username, 'i') } });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Format the users to include userId in the response
        const formattedUsers = users.map(user => ({
            _id: user._id,   // MongoDB Object ID
            username: user.username,
            email: user.email,
            bio: user.bio || 'No bio available',
            profilePicture: user.profilePicture || 'No picture available',
            userId: user._id  // Include userId for consistency
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching users', error: error.message });
    }
};








  


