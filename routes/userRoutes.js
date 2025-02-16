const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { check } = require("express-validator");

const router = express.Router();

router.post("/register", [
  check("email", "Valid email required").isEmail(),
  check("password", "Password must be 6+ chars").isLength({ min: 6 }),
], registerUser);
router.post("/login", loginUser);

module.exports = router;
