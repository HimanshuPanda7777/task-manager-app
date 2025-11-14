// routes/tasks.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/tasks
 * Return all tasks belonging to the authenticated user
 */
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

/**
 * POST /api/tasks
 * Create a new task for authenticated user
 * Body: { title: string (required), description?: string, status?: 'pending'|'completed' }
 */
router.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { title, description = '', status = 'pending' } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'pending' or 'completed'." });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user id in token.' });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? String(description).trim() : '',
      status,
      userId: userId // store the string; mongoose accepts string ObjectId
    });

    await task.save();
    res.status(201).json({ message: 'Task created.', task });
  } catch (err) {
    console.error('POST /tasks error:', err);
    if (err && err.stack) console.error(err.stack);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
});


/**
 * PUT /api/tasks/:id
 * Update a task (only the owner can update)
 * Body may include any of: { title, description, status }
 */
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const updates = {};

    const { title, description, status } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string.' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = String(description).trim();
    }

    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'pending' or 'completed'." });
      }
      updates.status = status;
    }

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    Object.assign(task, updates);
    await task.save();

    res.json({ message: 'Task updated.', task });
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid task id.' });
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task (only owner can delete)
 */
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const deleted = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!deleted) return res.status(404).json({ error: 'Task not found.' });

    res.json({ message: 'Task deleted.' });
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err);
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid task id.' });
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;
