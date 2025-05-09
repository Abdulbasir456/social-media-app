# API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Authentication

- **POST** `/auth/register`
  - **Description:** Register a new user.
  - **Request Body:** `{ "username": "string", "password": "string" }`
  - **Response:** Created user object with JWT token.

- **POST** `/auth/login`
  - **Description:** Log in an existing user.
  - **Request Body:** `{ "email": "string", "password": "string" }`
  - **Response:** Authenticated user object with JWT token.


### User Profile

- **GET** `/user/profile`
  - **Description:** Fetch the authenticated user's profile.
  - **Headers:** `{ "Authorization": "Bearer <JWT_TOKEN>" }`
  - **Response:** `{ "username": "string", "email": "string", "bio": "string", "profilePicture": "string" }`

- **POST** `/user/profile`
  - **Description:** Update the authenticated user's profile.
  - **Headers:** `{ "Authorization": "Bearer <JWT_TOKEN>" }`
  - **Request Body:** `{ "bio": "string", "profilePicture": "string" }`
  - **Response:** `{ "message": "Profile updated successfully" }`


### Posts

- **POST** `/posts`  
  - **Description:** Create a new post.  
  - **Headers:** `{ "Authorization": "Bearer <JWT_TOKEN>" }`  
  - **Request Body:** `{ "content": "string" }`  
  - **Response:** `{ "message": "Post created successfully", "post": { "id": "string", "content": "string", "createdAt": "date" } }`  

- **GET** `/posts`  
  - **Description:** Fetch all posts of authenticated user (latest first).  
  - **Headers:** `{ "Authorization": "Bearer <JWT_TOKEN>" }`  
  - **Response:** `[{ "id": "string", "content": "string", "createdAt": "date" }]` 


### Post Interactions  

- **POST** `/posts/:id/like`  
  - **Description:** Toggle like on a post.  
  - **Headers:** `{ "Authorization": "Bearer <JWT_TOKEN>" }`  
  - **Response:** `{  "success": true, "likesCount": 5, "liked": true }`  

  - **POST** `/posts/:id/comment`  
  - **Description:** Add a comment to a post.  
  - **Headers:** `{ "Authorization": "Bearer <JWT_TOKEN>" }`  
  - **Request Body:** `{ "text": "string" }`  
  - **Response:** `{ "message": "Comment added successfully", "comment": { "id": "string", "text": "string", "createdAt": "date" } }`


### User Search & Follow System

- **GET** /users/search?username=abc  
  - **Description:** Search for users by username.  
  - **Headers:** { "Authorization": "Bearer <JWT_TOKEN>" }  
  - **Response:** [{ "id": "string", "username": "string", "bio": "string", "profilePicture": "string" }]

- **POST** /users/:id/follow  
  - **Description:** Follow a user by their ID.  
  - **Headers:** { "Authorization": "Bearer <JWT_TOKEN>" }  
  - **Response:** { "message": "Followed successfully" }

- **POST** /users/:id/unfollow  
  - **Description:** Unfollow a user by their ID.  
  - **Headers:** { "Authorization": "Bearer <JWT_TOKEN>" }  
  - **Response:** { "message": "Unfollowed successfully" }
