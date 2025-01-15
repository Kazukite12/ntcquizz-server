const { createUser, findUserByUsername, findUserById,findUserByEmail } = require('./user.service');
const { generateToken } = require('../../utils/jwt.util');
const bcrypt = require('bcrypt');
const { generateOtp,sendOtpInBackground} = require('../../utils/otpGenerator')

const otpStore = new Map(); // Temporary storage for OTPs (use Redis or DB in production)

module.exports = {
  
  register: async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
      // Check if username is already taken
      const existingUserByUsername = await new Promise((resolve, reject) => {
        console.log('Checking for existing username...');
        findUserByUsername(username, (err, user) => {
          if (err) {
            console.error('Error during findUserByUsername:', err);
            return reject(err);
          }
          console.log('Username check complete.');
          resolve(user);
        });
      });

      if (existingUserByUsername) {
        return res.status(403).json({ message: 'Username has already been taken.' });
      }

      // Check if email is already registered
      const existingUserByEmail = await new Promise((resolve, reject) => {
        console.log('Checking for existing email...');
        findUserByEmail(username, (err, user) => {
          if (err) {
            console.error('Error during findUserByUsername:', err);
            return reject(err);
          }
          console.log('Username check complete.');
          resolve(user);
        });
      });

      if (existingUserByEmail) {
        return res.status(403).json({ message: 'Email has been registered.' });
      }

      // Generate and send OTP
      const otp = generateOtp();
      otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // TTL: 5 minutes

      sendOtpInBackground (email, otp);

      return res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred.', error });
    }
  },

  verifyOtp: (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (storedOtp.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    otpStore.delete(email); // OTP verified, remove from storage
    
    // Proceed with user creation
    const { username, password } = req.body;
    createUser({ username, email, password }, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    findUserByUsername(username, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = generateToken({ id: user.id, username: user.username });
      res.status(200).json({ message: 'Login successful', token });
    });
  },

  getProfile: (req, res) => {
    const userId = req.user.id;

    findUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ user });
    });
  },
};
