const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

router.get('/', isAuthenticated, (req, res) => {
  res.render('profile');
});

router.post('/', isAuthenticated, express.json(), async (req, res) => {
  const { bio, favoriteColor } = req.body;
  try {
    await User.findByIdAndUpdate(req.session.userId, { bio, favoriteColor });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

