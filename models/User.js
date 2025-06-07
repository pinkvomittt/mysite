// models/User.js

const users = {}; // In-memory user store (for now)

function getUserByUsername(username) {
  return users[username] || null;
}

function saveUser(username, data) {
  users[username] = data;
}

module.exports = { getUserByUsername, saveUser };
