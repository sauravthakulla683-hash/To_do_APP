const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Register (Sign Up)
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const Exists = await User.findOne({ email });
    if (Exists) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists (signup)" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Save new user
    const user = new User({ email, username, password: hash });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login (Sign In)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const exist = await User.findOne({ email });
    if (!exist) {
      console.log("User not found");
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, exist.password);
    if (!validPassword) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Exclude password from response
    const { password: pwd, ...others } = exist._doc;
    res.status(200).json(others);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
