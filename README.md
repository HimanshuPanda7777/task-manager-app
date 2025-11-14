🎯 Task Manager App (MERN Stack)

A lightweight, production-ready, and fully responsive Task Manager application built on the MERN stack. It provides secure, user-specific task management using modern authentication patterns.

📦 Tech Stack

This application utilizes a modern, modular architecture, leveraging the following technologies:

Backend (Node.js/Express)

Technology

Description

Node.js

JavaScript runtime environment.

Express.js

Minimalist web framework for building APIs.

MongoDB + Mongoose

NoSQL database and its object data modeling (ODM) library.

JWT Authentication

Secure token-based authentication for protected routes.

bcrypt

Library used for securely hashing user passwords.

Frontend (React/Vite)

Technology

Description

React (Vite)

Frontend library for building user interfaces, bundled with Vite.

Tailwind CSS

Utility-first CSS framework for rapid and responsive styling.

Axios

Promise-based HTTP client for API requests.

React Router

Declarative routing library for navigation.

1. Local Setup Instructions

Prerequisites

Ensure you have Node.js (LTS recommended) and a MongoDB instance (local or cloud) available.

Step 1: Clone the Repository

git clone [https://github.com/YOUR_USERNAME/task-manager-app.git](https://github.com/YOUR_USERNAME/task-manager-app.git)
cd task-manager-app


Step 2: Backend Configuration

Navigate to the backend directory:

cd backend


Install dependencies:

npm install


Create a file named .env in the backend/ directory and populate it with your configuration details:

MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret-key-for-jwt-signing>
PORT=5000


Step 3: Frontend Configuration

Navigate to the frontend directory:

cd ../frontend


Install dependencies:

npm install


2. Running the Application

To run the application, start both the backend API server and the frontend development server concurrently.

Start Backend (API Server)

cd backend
npm run dev


The backend will run on http://localhost:5000.

Start Frontend (Dev Server)

cd frontend
npm run dev


The frontend will run on http://localhost:5173.

Open your browser to: http://localhost:5173

3. API Endpoint Documentation

All endpoints are prefixed with /api. Protected routes require a valid JWT passed in the Authorization header as Bearer <token>.

Authentication Endpoints

Method

Path

Description

POST

/api/register

Registers a new user.

POST

/api/login

Authenticates a user and returns a JWT.

Example: Login Request

{
  "username": "user123",
  "password": "password"
}


Example: Login Response

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


Task Endpoints (Protected)

Method

Path

Description

GET

/api/tasks

Retrieves all tasks for the authenticated user.

POST

/api/tasks

Creates a new task.

PUT

/api/tasks/:id

Updates an existing task (title, status, description).

DELETE

/api/tasks/:id

Deletes a specified task.

Example: Create Task Body

{
  "title": "New Task Title",
  "description": "Optional description for the task."
}


Example: Update Task Body

{
  "status": "completed"
}


4. Project Structure

The repository is structured into two main directories for clear separation of concerns (backend API vs. frontend client).

task-manager-app/
│
├── backend/
│   ├── routes/              # Express route definitions (API paths)
│   ├── controllers/         # Core business logic for handling requests
│   ├── middleware/          # JWT authentication middleware
│   ├── models/              # Mongoose schemas and models
│   └── server.js            # Main entry file and server setup
│
└── frontend/
    ├── src/
    │   ├── pages/           # Top-level components for routing (e.g., Home, Login)
    │   ├── components/      # Reusable UI components (e.g., TaskCard, Navbar)
    │   ├── api/             # Axios instance and API call functions
    │   └── App.jsx          # Main application component and router configuration


5. Running Tests & Coverage (If Implemented)

If unit and integration tests are added to the project, use the following commands:

Run Tests

npm test


Generate Coverage Report

npm run test:coverage


The coverage report will be available at: /coverage/index.html
