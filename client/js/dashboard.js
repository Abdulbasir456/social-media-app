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

            // Render comments section
            let commentsHTML = '';
            if (post.comments && post.comments.length > 0 ) {
                commentsHTML = post.comments.map(comment => `
                    <p><strong>${comment.author?.username || 'Unknown user'}:</strong> ${comment.body}</p>
                    `).join('');
            } else {
                commentsHTML = '<p>No comments yet </p>';
            }

            postElement.innerHTML = `
            <p><strong>${post.userId?.username || 'Unknown User'}</strong> · <small>${new Date(post.createdAt).toLocaleString()}</small></p>
            <p>${post.content || ''}</p>
            ${imageHTML}
            <p>❤️ ${post.likes?.length || 0} <button class="like-btn" data-id="${post._id}">Like</button></p>
            <hr>
            <p class="toggle-comments" data-id="${post._id}" style="cursor: pointer; color: blue;">Comments</p>
            <div class="comments-section" id="comments-${post._id}" style="display: none;">
                ${commentsHTML}
             </div>
             <div>
                <input type="text" class="comment-input" data-id="${post._id}" placeholder="Write a comment..." />
                <button class="comment-btn" data-id="${post._id}">Comment</button>
            </div>
            `;

            postsContainer.appendChild(postElement);
        });

        // Toggle event listener for comments
        postsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-comments')) {
                const postId = e.target.dataset.id;
                const commentsSection = document.getElementById(`comments-${postId}`);
                commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
            }
        });
            
    } catch (err) {
        console.error('Failed to fetch posts:', err);

    }
};


postsContainer.addEventListener('click', async (e) => {
    const postId = e.target.dataset.id;

    // Like button functionality
    if (e.target.classList.contains('like-btn')) {
        try {
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            await response.json();
            fetchPosts();  // Refresh posts after like
        } catch (err) {
            console.error('Failed to like post', err);
        }
    }

    // Comment button functionality
    if (e.target.classList.contains('comment-btn')) {
        const commentInput = document.querySelector(`.comment-input[data-id="${postId}"]`);
        const body = commentInput.value;

        if (!body.trim()) return;

        try {
            await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ body })
            });

            fetchPosts();  // Refresh posts to show new comments
        } catch (err) {
            console.error('Failed to post comment', err);
        }
    }
});


// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './index.html';
  });

// Fetch profile and posts initially
fetchPosts();
fetchProfile();
