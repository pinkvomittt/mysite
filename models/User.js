// models/User.js

const users = {}; // This is a placeholder. Replace with a real DB in the future.

function getUserByUsername(username) {
  return users[username] || null;
}

function saveUser(username, data) {
  users[username] = data;
}

module.exports = { getUserByUsername, saveUser };
