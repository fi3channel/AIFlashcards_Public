/**
 * Express router for managing test results.
 *
 * This module provides routes for saving and retrieving test results.
 * It uses LowDB with a JSON file as the storage backend.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const Result = require("../models/Result");

// Path to results DB file
const dbFile = path.join(__dirname, "../database/resultsdb.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { results: [] });

/**
 * Initialize the database.
 * Ensures that the `results` collection exists in the JSON file.
 */
async function initDB() {
  await db.read();
  db.data ||= { results: [] };
  await db.write();
}
initDB();

/**
 * @route POST /save
 * @description Save a new test result.
 * @body {string} username - The username of the user who took the test.
 * @body {string} testTitle - The title of the test.
 * @body {string|Date} takenAt - The timestamp when the test was taken.
 * @body {Array<{question: string, givenAnswer: string, correctAnswer: string}>} answers - The answers provided by the user.
 * @returns {object} 201 - Confirmation message and saved result.
 * @returns {object} 400 - If required fields are missing.
 */
router.post("/save", async (req, res) => {
  await db.read();
  const { username, testTitle, takenAt, answers } = req.body;

  if (!username || !testTitle || !takenAt || !answers) {
    return res.status(400).json({ error: "Invalid result data" });
  }

  const newResult = new Result(username, testTitle, takenAt, answers);
  db.data.results.push(newResult);
  await db.write();

  res
    .status(201)
    .json({ message: "Result saved successfully", result: newResult });
});

/**
 * @route POST /getByUser
 * @description Retrieve all test results for a given user.
 * @body {string} username - The username whose results should be retrieved.
 * @returns {Array} - List of result objects for the user.
 * @returns {object} 400 - If username is missing.
 */
router.post("/getByUser", async (req, res) => {
  await db.read();
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  const userResults = db.data.results.filter((r) => r.username === username);
  res.json(userResults);
});

module.exports = router;
