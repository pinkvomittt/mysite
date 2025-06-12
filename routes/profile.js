const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User'); // Make sure this path is correct

// ✅ Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// GET /profile - serve profile.html
router.get('/', isAuthenticated, (req, res) => {
  res.render('profile');
});

// POST /profile - save customization settings
router.post('/', isAuthenticated, express.json(), async (req, res) => {
  const { bio, favoriteColor } = req.body;

  try {
    await User.findByIdAndUpdate(req.session.userId, {
      bio,
      favoriteColor
    });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Optional: GET /profile/data - return profile data as JSON
router.get('/data', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('bio favoriteColor');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile data' });
  }
});

module.exports = router;
