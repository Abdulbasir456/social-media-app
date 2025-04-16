
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
const followBtn = document.getElementById('followBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');


// Get the JWT token from localStorage
const token = localStorage.getItem('token');

if (!token) {
  alert('You are not logged in. Redirecting to login page...');
  window.location.href = '/index.html';
}

// ✅ Decode JWT to get logged-in user ID
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}

const decodedToken = parseJwt(token);
const loggedInUserId = decodedToken?.id;

if (!loggedInUserId) {
  alert('Invalid or expired token. Please log in again.');
  localStorage.removeItem('token');
  window.location.href = '/index.html';
}


let currentlyViewingUserId = loggedInUserId;
// -------- API calls & event handlers (unchanged except actualUserId → loggedInUserId) --------

const fetchProfile = async (userId = null) => {
  try {
    const url = userId
      ? `http://localhost:5000/api/profile/${userId}`
      : 'http://localhost:5000/api/profile';
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.bio) {
      profileBio.textContent = data.bio;
    }
    if (data.profilePicture) {
      profilePicture.textContent = `Profile Picture: ${data.profilePicture}`;
    }

    followBtn.dataset.userId = data.userId._id;
    followBtn.textContent = 'Follow';
    followBtn.style.display = 'block';
  } catch (err) {
    console.error('Failed to fetch profile:', err);
  }
};

followBtn.addEventListener('click', async () => {
  const targetUserId = followBtn.dataset.userId;
  try {
    const response = await fetch(
      `http://localhost:5000/api/profile/${targetUserId}/follow`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    alert(data.message);
  } catch (err) {
    console.error('Error following/unfollowing user:', err);
  }
});

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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio, profilePicture: profilePictureUrl }),
    });
    const data = await response.json();

    if (data.bio) profileBio.textContent = data.bio;
    if (data.profilePicture)
      profilePicture.textContent = `Profile Picture: ${data.profilePicture}`;
    alert('Profile updated successfully');
  } catch (err) {
    console.error('Failed to update profile:', err);
    alert('Failed to update profile. Please try again.');
  }
});

postBtn.addEventListener('click', async () => {
  const content = postContent.value;
  const image = document.getElementById('postImage').files[0];

  const formData = new FormData();
  formData.append('content', content);
  if (image) formData.append('image', image);

  try {
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
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
      headers: { Authorization: `Bearer ${token}` },
    });

    const posts = await response.json();
    postsContainer.innerHTML = '';

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');

      let imageHTML = post.image
        ? `<img src="http://localhost:5000${post.image}" alt="Post image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">`
        : '';

      let commentsHTML = post.comments?.length
        ? post.comments
            .map(
              comment =>
                `<p><strong>${comment.author?.username || 'Unknown user'}:</strong> ${comment.body}</p>`
            )
            .join('')
        : '<p>No comments yet</p>';

      postElement.innerHTML = `
        <p><strong>${post.userId?.username || 'Unknown User'}</strong> · <small>${new Date(
        post.createdAt
      ).toLocaleString()}</small></p>
        <p>${post.content || ''}</p>
        ${imageHTML}
        <p>❤️ ${post.likes?.length || 0} <button class="like-btn" data-id="${
        post._id
      }">Like</button></p>
        <hr>
        <p class="toggle-comments" data-id="${
          post._id
        }" style="cursor: pointer; color: blue;">Comments</p>
        <div class="comments-section" id="comments-${
          post._id
        }" style="display: none;">
            ${commentsHTML}
        </div>
        <div>
            <input type="text" class="comment-input" data-id="${
              post._id
            }" placeholder="Write a comment..." />
            <button class="comment-btn" data-id="${post._id}">Comment</button>
        </div>
      `;

      postsContainer.appendChild(postElement);
    });

    postsContainer.addEventListener('click', e => {
      if (e.target.classList.contains('toggle-comments')) {
        const postId = e.target.dataset.id;
        const section = document.getElementById(`comments-${postId}`);
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
      }
    });
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  }
};

postsContainer.addEventListener('click', async e => {
    const postId = e.target.dataset.id;
  
    if (e.target.classList.contains('like-btn')) {
      try {
        await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ Fix: Fetch based on currently viewed user
        currentlyViewingUserId === loggedInUserId
          ? fetchPosts()
          : fetchUserPosts(currentlyViewingUserId);
      } catch (err) {
        console.error('Failed to like post', err);
      }
    }
  
    if (e.target.classList.contains('comment-btn')) {
      const commentInput = document.querySelector(
        `.comment-input[data-id="${postId}"]`
      );
      const body = commentInput.value;
      if (!body.trim()) return;
  
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/${postId}/comment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ body }),
          }
        );
  
        if (response.ok) {
          // ✅ Also reload the correct set of posts
          currentlyViewingUserId === loggedInUserId
            ? fetchPosts()
            : fetchUserPosts(currentlyViewingUserId);

        const commentsSection = document.getElementById(`comments-${postId}`);
        const newComment = document.createElement('p');
        newComment.innerHTML = `<strong>You:</strong> ${body}`;
        commentsSection.appendChild(newComment);
        commentInput.value = '';
        commentsSection.style.display = 'block';
        }
      } catch (err) {
        console.error('Failed to post comment', err);
      }
    }
  });

// ✅ No hardcoding, set follow button based on login
followBtn.setAttribute('data-user-id', loggedInUserId);

searchBtn.addEventListener('click', async () => {
  const username = searchInput.value.trim();
  if (!username) {
    alert('Please enter a username to search.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/profile/search/${username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const users = await response.json();
    searchResults.innerHTML = '';

    if (!users.length) {
      searchResults.textContent = 'No users found.';
      return;
    }

    users.forEach(user => {
      const li = document.createElement('li');
      li.innerHTML = `<button class="profile-btn" data-user-id="${user._id}">${user.username}</button>`;
      searchResults.appendChild(li);
    });
  } catch (err) {
    console.error('Error searching users:', err);
  }
});

searchResults.addEventListener('click', e => {
  if (e.target.classList.contains('profile-btn')) {
    const selectedUserId = e.target.dataset.userId;
    viewUserDashboard(selectedUserId);
  }
});

const viewUserDashboard = async userId => {

    currentlyViewingUserId = userId; // ✅ Update tracker
  try {
    const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    profileBio.textContent = data.bio || 'No bio available';
    profilePicture.textContent = `Profile Picture: ${data.profilePicture || 'No picture'}`;

    followBtn.dataset.userId = data.userId?._id || userId;
    followBtn.textContent = 'Follow';
    followBtn.style.display = 'block';

    // ✅ Only allow editing profile if viewing your own
    if (userId !== loggedInUserId) {
      updateProfileBtn.style.display = 'none';
      newBio.disabled = true;
      newProfilePicture.disabled = true;
    } else {
      updateProfileBtn.style.display = 'block';
      newBio.disabled = false;
      newProfilePicture.disabled = false;
    }

    await fetchUserPosts(userId);
  } catch (err) {
    console.error('Failed to load user dashboard:', err);
  }
};

const fetchUserPosts = async userId => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/posts/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(response.statusText);
    const posts = await response.json();

    postsContainer.innerHTML = '';
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      let imageHTML = post.image
        ? `<img src="http://localhost:5000${post.image}" alt="Post image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">`
        : '';
      let commentsHTML = post.comments?.length
        ? post.comments
            .map(
              comment =>
                `<p><strong>${comment.author?.username || 'Unknown user'}:</strong> ${comment.body}</p>`
            )
            .join('')
        : '<p>No comments yet</p>';

      postElement.innerHTML = `
        <p><strong>${post.userId?.username || 'Unknown User'}</strong> · <small>${new Date(
        post.createdAt
      ).toLocaleString()}</small></p>
        <p>${post.content || ''}</p>
        ${imageHTML}
        <p>❤️ ${post.likes?.length || 0} <button class="like-btn" data-id="${
        post._id
      }">Like</button></p>
        <hr>
        <p class="toggle-comments" data-id="${
          post._id
        }" style="cursor: pointer; color: blue;">Comments</p>
        <div class="comments-section" id="comments-${post._id}" style="display: none;">
            ${commentsHTML}
        </div>
        <div>
            <input type="text" class="comment-input" data-id="${
              post._id
            }" placeholder="Write a comment..." />
            <button class="comment-btn" data-id="${post._id}">Comment</button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (err) {
    console.error('Failed to fetch user posts:', err);
  }
};

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = './index.html';
});

// ✅ Load current logged-in user's dashboard
viewUserDashboard(loggedInUserId);











