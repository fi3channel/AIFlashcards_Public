/**
 * Express router for managing test operations.
 *
 * This module provides CRUD (Create, Read, Update, Delete) routes
 * for handling tests and their associated questions.
 *
 * It uses LowDB with a JSON file as the storage backend.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const Test = require("../models/Test");
const Question = require("../models/Question");

// Path to test DB file
const dbFile = path.join(__dirname, "../database/testdb.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { tests: [] });

/**
 * Initialize the database.
 * Ensures that the `tests` collection exists in the JSON file.
 */
async function initDB() {
  await db.read();
  db.data ||= { tests: [] };
  await db.write();
}
initDB();

/**
 * @route POST /create
 * @description Create a new test for a given user.
 * @body {string} username - The username of the test owner.
 * @body {string} title - Title of the test.
 * @body {Array<{text: string, answer: string}>} questions - List of question objects.
 * @returns {object} 201 - The created test object.
 * @returns {object} 400 - If input validation fails.
 * @returns {object} 409 - If a test with the same title already exists for the user.
 */
router.post("/create", async (req, res) => {
  await db.read();
  const { username, title, questions } = req.body;

  if (!username || !title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Invalid test data" });
  }

  const existingTest = db.data.tests.find(
    (t) =>
      t.username === username && t.title.toLowerCase() === title.toLowerCase()
  );

  if (existingTest) {
    return res
      .status(409)
      .json({ error: "Test with this title already exists for this user" });
  }

  const questionObjects = questions.map((q) => new Question(q.text, q.answer));
  const newTest = new Test(
    username,
    title,
    questionObjects.length,
    questionObjects
  );

  db.data.tests.push(newTest);
  await db.write();

  res.status(201).json({ message: "Test saved successfully", test: newTest });
});

/**
 * @route POST /getByUser
 * @description Retrieve all tests for a given user.
 * @body {string} username - The username of the test owner.
 * @returns {Array} - List of tests for the user.
 * @returns {object} 400 - If username is missing.
 */
router.post("/getByUser", async (req, res) => {
  await db.read();
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const userTests = db.data.tests.filter((t) => t.username === username);
  res.json(userTests);
});

/**
 * @route POST /getTestByTitle
 * @description Retrieve a specific test by username and title.
 * @body {string} username - The username of the test owner.
 * @body {string} title - The title of the test.
 * @returns {object} - The test object if found.
 * @returns {object} 400 - If required fields are missing.
 * @returns {object} 404 - If test is not found.
 */
router.post("/getTestByTitle", async (req, res) => {
  await db.read();
  const { username, title } = req.body;

  if (!username || !title) {
    return res.status(400).json({ error: "Username and title required" });
  }

  const test = db.data.tests.find(
    (t) =>
      t.username === username && t.title.toLowerCase() === title.toLowerCase()
  );

  if (!test) {
    return res.status(404).json({ error: "Test not found" });
  }

  res.json(test);
});

/**
 * @route POST /updateTest
 * @description Update an existing test.
 * @body {string} username - The username of the test owner.
 * @body {string} title - The title of the test.
 * @body {number} numberOfQuestions - The number of questions in the test.
 * @body {Array<{text: string, answer: string}>} questions - The updated list of questions.
 * @returns {object} - The updated test object.
 * @returns {object} 400 - If input validation fails.
 * @returns {object} 404 - If the test does not exist.
 */
router.post("/updateTest", async (req, res) => {
  await db.read();
  const { username, title, numberOfQuestions, questions } = req.body;

  if (
    !username ||
    !title ||
    !numberOfQuestions ||
    !questions ||
    !Array.isArray(questions)
  ) {
    return res.status(400).json({ error: "Invalid test data" });
  }

  const testIndex = db.data.tests.findIndex(
    (t) =>
      t.username === username && t.title.toLowerCase() === title.toLowerCase()
  );

  if (testIndex === -1) {
    return res.status(404).json({ error: "Test not found" });
  }

  db.data.tests[testIndex].numberOfQuestions = numberOfQuestions;
  db.data.tests[testIndex].questions = questions.map(
    (q) => new Question(q.text, q.answer)
  );

  await db.write();

  res.json({
    message: "Test updated successfully",
    test: db.data.tests[testIndex],
  });
});

/**
 * @route POST /deleteTest
 * @description Delete a test for a given user by title.
 * @body {string} username - The username of the test owner.
 * @body {string} title - The title of the test.
 * @returns {object} - The deleted test object.
 * @returns {object} 400 - If input validation fails.
 * @returns {object} 404 - If test is not found.
 */
router.post("/deleteTest", async (req, res) => {
  await db.read();
  const { username, title } = req.body;

  if (!username || !title) {
    return res.status(400).json({ error: "Username and title required" });
  }

  const testIndex = db.data.tests.findIndex(
    (t) =>
      t.username === username && t.title.toLowerCase() === title.toLowerCase()
  );

  if (testIndex === -1) {
    return res.status(404).json({ error: "Test not found" });
  }

  const deletedTest = db.data.tests.splice(testIndex, 1)[0];
  await db.write();

  res.json({ message: "Test deleted successfully", test: deletedTest });
});

module.exports = router;
