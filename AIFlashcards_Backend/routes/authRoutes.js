/**
 * Express router for user authentication.
 *
 * This module provides routes for user registration and login.
 * It uses LowDB with a JSON file as a lightweight storage backend.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const User = require("../models/User");
const { AuthResponse } = require("../models/AuthResponse");

// Path to authentication database file
const dbFile = path.join(__dirname, "../database/authdb.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [] });

/**
 * Initialize the database.
 * Ensures that the `users` collection exists in the JSON file.
 */
async function initDB() {
  await db.read();
  db.data ||= { users: [] };
  await db.write();
}
initDB();

/**
 * @route POST /register
 * @description Register a new user.
 * @body {string} username - The desired username.
 * @body {string} password - The user's password (stored in plain text here, not secure).
 * @returns {object} 201 - A success message and the created user object.
 * @returns {object} 400 - If username/password are missing or user already exists.
 */
router.post("/register", async (req, res) => {
  await db.read();
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check if user already exists
  const existingUser = db.data.users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Create new user and save to DB
  const newUser = new User(username, password);
  db.data.users.push(newUser);
  await db.write();

  // Return standardized response
  const response = new AuthResponse("User registered successfully", newUser);
  res.status(201).json(response);
});

/**
 * @route POST /login
 * @description Authenticate an existing user.
 * @body {string} username - The user's username.
 * @body {string} password - The user's password.
 * @returns {object} 200 - A success message and the user object if credentials are valid.
 * @returns {object} 400 - If input fields are missing.
 * @returns {object} 401 - If credentials are invalid.
 */
router.post("/login", async (req, res) => {
  await db.read();
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Look up user in DB
  const user = db.data.users.find(
    (u) => u.username === username && u.password === password
  );

  // Reject invalid credentials
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Return standardized success response
  const response = new AuthResponse("Login successful", user);
  res.json(response);
});

module.exports = router;
