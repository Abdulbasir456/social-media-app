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



postBtn.addEventListener('click', async () => {
    
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').files[0]; // input type="file"

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
        formData.append('image', image);
    }

    try {
        const response = await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                
                 'Authorization': `Bearer ${token}`,
                // Let fetch auto set it to multipart/form-data
            },
            body: formData
        });

        const result = await response.json();
        console.log('Post created!', result);
    } catch (err) {
        console.error('Failed to create post', err);
    }
});


const fetchPosts = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/posts', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const posts = await response.json();
        postsContainer.innerHTML = '';
 
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            let imageHTML = '';
            if (post.image) {
                imageHTML = `<img src="http://localhost:5000${post.image}" alt="Post image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">`;
            }

            postElement.innerHTML = `
            <p><strong>${post.userId?.username || 'Unknown User'}</strong> · <small>${new Date(post.createdAt).toLocaleString()}</small></p>
            <p>${post.content || ''}</p>
            ${imageHTML}
            <hr>
            `;

            postsContainer.appendChild(postElement);
        });


    } catch (err) {
        console.error('Failed to fetch posts:', err);

    }
};

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './index.html';
  });

// Fetch profile and posts initially
fetchPosts();
fetchProfile();
