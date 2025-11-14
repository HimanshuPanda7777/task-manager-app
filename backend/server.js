// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

const PORT = process.env.PORT || 5000;

// Basic health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// TODO: mount routers (we'll create them next steps)
const authRouter = require('./routes/auth');   // create file later
const tasksRouter = require('./routes/tasks'); // create file later
app.use('/api', authRouter);   // auth routes: /api/register, /api/login
app.use('/api', tasksRouter);  // task routes: /api/tasks...

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
