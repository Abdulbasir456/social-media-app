# Social Media App

A full-stack social media application built with:

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt

## Project Status
- **User authentication (registration & login) completed**
- **User profile functionality added** 
  - Users can now update their bio and profile picture.  
  - The dashboard fetches and displays the latest profile data.  
- **Post creation and fetching added**
  - Users can create posts.
  - Users can view their posts in the feed, sorted latest first.
  - Improved styling for better post display.
  **UI Enhancements:**
  - Dashboard page is now fully responsive.
  - Post display styling optimised for different screen sizes.
- **Like functionality added**  
  - Users can now like **any post**, not just their own.
  - Likes update dynamically on the UI.
- **Comment functionality added** 
  - Users can comment on **any post**. 
  - Comments are stored and displayed under posts.
- **User search functionality added**
  - Users can search for other users by username.
  - Search results display relevant user profiles dynamically.
- **Follow/Unfollow feature implemented**
  - Users can follow or unfollow other users.
- **UI Enhancements:**
  - Login and Register pages redesigned with improved styling.
  - Dashboard UI updated for a cleaner layout and better user experience.



## Folder Structure

## Setup Instructions
**Clone the repository:** `git clone <repository-url>`

## Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your MongoDB URI and JWT secret. 
4. Run the server: `node server.js`

**Frontend Setup:**
- Open `client/index.html` in your browser.

## Environment Variables (in server/.env)