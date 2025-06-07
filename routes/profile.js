const express = require('express');
const router = express.Router();
const User = require('../models/User'); // your User model
const { ensureAuthenticated } = require('../middleware/auth'); // middleware to check login

// Show the profile edit form
router.get('/edit', ensureAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('profile-edit', { user });
});

// Handle profile update form submission
router.post('/edit', ensureAuthenticated, async (req, res) => {
  const { bio, favoriteColor } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      'profile.bio': bio,
      'profile.favoriteColor': favoriteColor
    });
    res.redirect(`/profile/${req.user.username}`);
  } catch (err) {
    console.error(err);
    res.render('profile-edit', { user: req.body, error: 'Failed to update profile' });
  }
});

// Public profile page by username
router.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send('User not found');
  res.render('profile', { user });
});

module.exports = router;
