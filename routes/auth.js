const express = require('express');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  res.render('login'); 
});

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'test' && password === 'password') {
    req.session.user = { username };
    req.session.userId = 'some_user_id'; // You might want to assign a userId here
    res.redirect('/profile');
  } else {
    res.send('Invalid credentials');
  }
});

module.exports = router;
