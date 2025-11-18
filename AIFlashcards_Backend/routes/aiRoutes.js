/**
 * Express router for AI-generated questions.
 *
 * This module provides a route to generate questions from a given text
 * using an external AI service (Flask server).
 */

const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * @route POST /generate
 * @description Generate questions from provided text using AI service.
 *
 * @body {string} text - The text content to generate questions from. Maximum length 5000 characters.
 * @body {number} num_questions - Number of questions to generate (1-20).
 * @returns {object} - Generated questions from the AI service.
 * @returns {object} 400 - If validation fails (missing or invalid parameters).
 * @returns {object} 500 - If the AI service request fails.
 */
router.post("/generate", async (req, res) => {
  try {
    const { text, num_questions } = req.body;

    // Validate text input
    if (!text || text.length > 5000) {
      return res
        .status(400)
        .json({ error: "Text is required and must be <= 5000 chars" });
    }

    // Validate number of questions
    if (!num_questions || num_questions < 1 || num_questions > 20) {
      return res
        .status(400)
        .json({ error: "num_questions must be between 1 and 20" });
    }

    // Forward request to Flask AI service
    const response = await axios.post("http://localhost:5000/generate", {
      text,
      num_questions,
    });

    // Return AI-generated questions to the client
    res.json(response.data);
  } catch (err) {
    console.error("Error calling AI service:", err.message);
    res.status(500).json({ error: "Failed to fetch AI questions" });
  }
});

module.exports = router;
