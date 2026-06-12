# SIT708_10.1D_Backend

This repository contains the backend API for the LLM-Enhanced Learning Assistant App.

The backend is built with Node.js, Express.js, MongoDB Atlas, and Mongoose.  
It provides API endpoints for authentication, user interests, learning history, public profile sharing, and account upgrade features.

## Related Repository

Android application repository:  
https://github.com/Waho-Joe/SIT708_10.1D_Application

## Features

- User registration and login
- Interest category management
- Save and retrieve user learning interests
- Save and retrieve learning history
- User profile data API
- Public profile sharing API
- Account upgrade API

## Project Structure

```text
models/
  History.js
  Interest.js
  PublicProfile.js
  User.js
  UserInterest.js

routes/
  authRoutes.js
  historyRoutes.js
  interestRoutes.js
  profileRoutes.js
  upgradeRoutes.js

utils/
  seedInterests.js

server.js
package.json
package-lock.json
.env
