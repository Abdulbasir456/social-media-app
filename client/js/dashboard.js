// DOM Elements
const profileBio = document.getElementById('profileBio');
const profilePicture = document.getElementById('profilePicture');
const newBio = document.getElementById('newBio');
const newProfilePicture = document.getElementById('newProfilePicture');
const updateProfileBtn = document.getElementById('updateProfileBtn');
const postContent = document.getElementById('postContent');
const postBtn = document.getElementById('postBtn');
const postsContainer = document.getElementById('posts');
const logoutBtn = document.getElementById('logoutBtn');

// Get the JWT token from localStorage
const token = localStorage.getItem('token');

if (!token) {
  alert('You are not logged in. Redirecting to login page...');
  window.location.href = '/index.html';
}


// Fetch User Profile
const fetchProfile = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();
        if (data.bio) {
            profileBio.textContent = data.bio;
        }

        if (data.profilePicture) {
            profilePicture.textContent = `Profile Picture: ${data.profilePicture}`;
        }
    } catch (err) {
        console.error('Failed to fetch profile:', err);
    }
};

updateProfileBtn.addEventListener('click', async () => {
    const bio = newBio.value;
    const profilePictureUrl = newProfilePicture.value;

    if (!bio && !profilePictureUrl) {
        alert('Please enter at least one field to update');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ bio, profilePicture: profilePictureUrl }),
        });
        const data = await response.json();
        if (data.bio) {
            profileBio.textContent = data.bio;
        }
        if (data.profilePicture) {
            profilePicture.textContent = `Profile Picture: ${data.profilePicture}`;
          }
          alert('Profile updated successfully');

    } catch (err) {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile. Please try again.');
    }
});


// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './index.html';
  });

// Initial Fetch
fetchProfile();
  