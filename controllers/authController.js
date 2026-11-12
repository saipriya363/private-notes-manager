// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

// Helper: generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// -------- Registration ----------
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Password policy: at least 6 chars and at least one number
  const pwRegex = /^(?=.*\d).{6,}$/;
  if (!pwRegex.test(password)) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters and contain a number.' });
  }

  try {
    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Create user – password will be hashed by pre‑save hook
    await User.create({ name, email, password });
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// -------- Login ----------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

