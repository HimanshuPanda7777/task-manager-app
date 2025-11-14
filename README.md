# Task Manager App — MERN Stack

A lightweight, modular, and production-ready Task Manager built using the MERN stack with JWT authentication and a modern, responsive interface.

## 📦 Tech Stack

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT Authentication, bcrypt  
**Frontend:** React (Vite), Axios, TailwindCSS, React Router

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### 1. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/task-manager-app.git
cd task-manager-app

# Backend
cd backend
npm install
echo "MONGO_URI=<your-mongodb-uri>" > .env
echo "JWT_SECRET=<your-secret-key>" >> .env
echo "PORT=5000" >> .env
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev

2. Access Application
Backend: http://localhost:5000

Frontend: http://localhost:5173

🧪 Testing
bash
npm test
npm run test:coverage
📚 API Documentation
Authentication
POST /api/register

json
{"username": "user123", "password": "password"}
POST /api/login

json
{"username": "user123", "password": "password"}
Response: {"token": "JWT_TOKEN"}

Protected Routes: Authorization: Bearer <token>

Tasks
GET /api/tasks - Get user's tasks

POST /api/tasks - Create task

PUT /api/tasks/:id - Update task

DELETE /api/tasks/:id - Delete task

📁 Project Structure
text
task-manager-app/
├── backend/
│   ├── routes/          # API routes
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation
│   ├── models/          # MongoDB models
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── pages/       # React pages
    │   ├── components/  # UI components
    │   ├── api/         # API services
    │   └── App.jsx      # Main app
    └── public/          # Static assets
🔐 Security Features
JWT authentication

Password hashing (bcrypt)

Protected routes

Input validation

🎨 UI/UX Features
Responsive design (TailwindCSS)

Modern interface

Real-time updates

Replace YOUR_USERNAME with your GitHub username when cloning.
