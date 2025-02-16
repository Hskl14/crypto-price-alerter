const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const logger = require('../utils/logger');
const config = require('../config');

async function registerUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User with email already exists" });

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user.id }, config.app.jwtSecret, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Error | userController.register | ${error}`);
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, config.app.jwtSecret, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = { registerUser, loginUser };
