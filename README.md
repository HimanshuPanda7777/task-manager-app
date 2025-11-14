Task Manager App — MERN Stack
A lightweight, modular, and production-ready Task Manager built using the MERN stack with JWT authentication and a modern, responsive interface.

📦 Tech Stack
Backend: Node.js, Express.js, MongoDB + Mongoose, JWT Authentication, bcrypt
Frontend: React (Vite), Axios, TailwindCSS, React Router

🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

MongoDB (local or cloud instance)

1. Clone & Setup
bash
git clone https://github.com/YOUR_USERNAME/task-manager-app.git
cd task-manager-app

# Backend Setup
cd backend
npm install

# Create environment file
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EOF

npm run dev
2. Frontend Setup (New Terminal)
bash
cd frontend
npm install
npm run dev
3. Access Application
Backend API: http://localhost:5000

Frontend App: http://localhost:5173

🧪 Testing
bash
# Run tests
npm test

# Generate coverage report
npm run test:coverage
📚 API Documentation
Authentication Endpoints
Register User

bash
POST /api/register
Content-Type: application/json

{
  "username": "user123",
  "password": "password"
}
Login

bash
POST /api/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password"
}

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Task Endpoints (Protected)
Get All Tasks

bash
GET /api/tasks
Authorization: Bearer <your_jwt_token>
Create Task

bash
POST /api/tasks
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "pending"
}
Update Task

bash
PUT /api/tasks/:id
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "completed"
}
Delete Task

bash
DELETE /api/tasks/:id
Authorization: Bearer <your_jwt_token>
📁 Project Structure
text
task-manager-app/
├── backend/
│   ├── routes/           # API route definitions
│   ├── controllers/      # Business logic handlers
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/          # MongoDB schemas (User, Task)
│   ├── config/          # Database configuration
│   ├── utils/           # Helper functions
│   └── server.js        # Express server setup
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components (Login, Dashboard)
    │   ├── context/      # React context for state management
    │   ├── hooks/        # Custom React hooks
    │   ├── services/     # API service functions
    │   ├── utils/        # Helper functions
    │   └── App.jsx       # Main application component
    ├── public/           # Static assets
    └── package.json
🔐 Security Features
JWT-based authentication

Password hashing using bcrypt

Protected API routes with middleware

Input validation and sanitization

CORS configuration

🎨 UI/UX Features
Fully responsive design using TailwindCSS

Dark/Light mode support

Real-time task updates

Drag-and-drop task organization

Loading states and error handling

Mobile-first approach

🛠 Development Scripts
Backend Scripts
bash
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
Frontend Scripts
bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test            # Run tests
npm run lint        # Run ESLint
🌐 Deployment
Backend Deployment (Example: Heroku)
bash
# Add environment variables in Heroku dashboard
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGO_URI=your_production_mongodb_uri

# Deploy
git push heroku main
Frontend Deployment (Example: Netlify/Vercel)
bash
# Build command
npm run build

# Output directory
dist
🔧 Environment Variables
Backend (.env)
env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
Frontend (.env)
env
VITE_API_BASE_URL=http://localhost:5000/api
📝 API Response Format
Success Response
json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Task Title",
    "status": "completed"
  },
  "message": "Task created successfully"
}
Error Response
json
{
  "success": false,
  "error": "Validation Error",
  "message": "Title is required",
  "statusCode": 400
}
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License.

Note: Replace YOUR_USERNAME in the clone URL with your actual GitHub username. Update MongoDB connection string and JWT secret with your actual values in production.
