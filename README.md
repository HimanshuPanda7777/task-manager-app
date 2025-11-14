# **Task Manager App — MERN Stack**

A lightweight, modular, and production-ready **Task Manager** built using the **MERN stack** with JWT authentication and a modern, responsive interface.

---

## 📦 **Tech Stack**

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- bcrypt (password hashing)

### **Frontend**
- React (Vite)  
- Axios  
- TailwindCSS  
- React Router

---

# 🔧 **1. Local Setup Instructions**

## **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/task-manager-app.git
cd task-manager-app
Backend Setup
cd backend
npm install


Create a .env file in the backend directory:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
PORT=5000


Start the backend:

npm run dev


Backend runs at:

http://localhost:5000

Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

▶️ 2. How to Run the Application

Start backend:

cd backend
npm run dev


Start frontend:

cd frontend
npm run dev


Open the application:

http://localhost:5173

🧪 3. How to Run Tests & View Coverage

(Use these commands if tests are added to the project.)

Run tests:

npm test


Generate coverage report:

npm run test:coverage


Open coverage report:

/coverage/index.html

📡 4. API Endpoint Documentation
🔐 Authentication
POST /api/register

Register a new user.

Body

{
  "username": "user123",
  "password": "password"
}

POST /api/login

Log in and receive JWT.

Body

{
  "username": "user123",
  "password": "password"
}


Response

{
  "token": "JWT_TOKEN"
}


Use this token for all protected routes:

Authorization: Bearer <token>

🗂 Tasks API
GET /api/tasks

Retrieve all tasks of the authenticated user.

POST /api/tasks

Create a new task.

Body

{
  "title": "New Task"
}

PUT /api/tasks/:id

Update title, status, or description.

Body Example

{
  "status": "completed"
}

DELETE /api/tasks/:id

Delete a task.

📁 5. Project Structure
task-manager-app/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api/
    │   └── App.jsx
