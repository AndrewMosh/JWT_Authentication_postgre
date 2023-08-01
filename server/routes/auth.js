const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { db } = require("../db");

// Secret key for JWT token
const secretKey = "random-secret-key";

// Helper function to create a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: "1h",
  });
};

// Route: /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const newUser = await db("template1")
      .insert({ username, password: hashedPassword })
      .returning("*");

    const token = generateToken(newUser[0]);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch the user from the database
    const user = await db("template1").where("username", username).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
