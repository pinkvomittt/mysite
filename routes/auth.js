const express = require('express');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  res.render('login', { error: null }); // pass null initially
});

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'test' && password === 'password') {
    req.session.user = { username };
    req.session.userId = 'some_user_id'; // Replace with real ID from DB later
    res.redirect('/profile');
  } else {
    res.render('login', { error: 'Something went wrong' }); // render with error
  }
});

module.exports = router;
