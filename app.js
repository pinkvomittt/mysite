app.get('/test', (req, res) => {
  res.send('Test route is working');
});
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Setup session middleware
app.use(session({
  secret: 'yourSecretKey', // Replace with your own secret
  resave: false,
  saveUninitialized: false
}));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Import and use profile routes
const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);

// ❌ DO NOT use app.listen() on Vercel

// ✅ Export the app for Vercel
module.exports = app;

