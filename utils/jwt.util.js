const jwt = require('jsonwebtoken');

const SECRET_KEY = '@NtcTraining123';

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
