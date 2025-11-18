/**
 * Express router for analytics of test results.
 *
 * This module provides a route to calculate statistics and insights
 * from test results stored in LowDB.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

// Path to results DB file
const dbFile = path.join(__dirname, "../database/resultsdb.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { results: [] });

/**
 * Initialize the database.
 * Ensures the `results` collection exists in the JSON file.
 */
async function initDB() {
  await db.read();
  db.data ||= { results: [] };
}
initDB();

/**
 * @route POST /
 * @description Get analytics data for test results.
 * Optionally filter by username.
 *
 * @body {string} [username] - Optional username to filter results.
 * @returns {object} - Analytics including:
 *  - correctIncorrect: total correct vs incorrect answers,
 *  - topTests: top 5 most taken tests with stats,
 *  - activity: test activity grouped by month.
 */
router.post("/", async (req, res) => {
  await db.read();
  const { username } = req.body;
  let results = db.data.results || [];

  // Filter results for a specific user if username provided
  if (username) {
    results = results.filter((r) => r.username === username);
  }

  // Compute overall correct vs incorrect answers
  let totalCorrect = 0;
  let totalIncorrect = 0;
  results.forEach((r) =>
    r.answers.forEach((a) => (a.correct ? totalCorrect++ : totalIncorrect++))
  );

  // Compute stats per test: number of times taken, correct & incorrect answers
  const testCounts = {};
  results.forEach((r) => {
    if (!testCounts[r.testTitle]) {
      testCounts[r.testTitle] = { taken: 0, correct: 0, incorrect: 0 };
    }
    testCounts[r.testTitle].taken++;
    r.answers.forEach((a) =>
      a.correct
        ? testCounts[r.testTitle].correct++
        : testCounts[r.testTitle].incorrect++
    );
  });

  // Get top 5 most taken tests
  const topTests = Object.entries(testCounts)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.taken - a.taken)
    .slice(0, 5);

  // Compute activity over time, grouped by month (YYYY-MM)
  const monthlyCounts = {};
  results.forEach((r) => {
    const date = new Date(r.takenAt);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
  });

  const activity = Object.entries(monthlyCounts)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([month, count]) => ({ month, count }));

  // Return analytics data
  res.json({
    correctIncorrect: { correct: totalCorrect, incorrect: totalIncorrect },
    topTests,
    activity,
  });
});

module.exports = router;
