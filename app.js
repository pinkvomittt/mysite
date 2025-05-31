const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  secret: 'yourSecretKey',        // Replace with your own secret
  resave: false,
  saveUninitialized: false
}));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import auth routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Start server on port 3000
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
});
