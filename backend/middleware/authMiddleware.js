// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // accept either id or _id in token
    const id = payload.id || payload._id;
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    req.user = { id: id.toString(), username: payload.username || null };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
