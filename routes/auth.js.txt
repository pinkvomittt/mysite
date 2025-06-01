const express = require('express');
const router = express.Router();

// Example route
router.get('/login', (req, res) => {
  res.render('login'); // Make sure login.ejs exists in your views folder
});

module.exports = router;
