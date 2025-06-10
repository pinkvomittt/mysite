const express = require('express');
const router = express.Router();

// Example route
router.get('/login', (req, res) => {
  res.render('login'); // Make sure login.ejs exists in your views folder
});

module.exports = router;
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // your real login logic here
  if (username === 'test' && password === 'password') {
    req.session.user = { username };
    res.redirect('/profile');
  } else {
    res.send('Invalid credentials');
  }
});
