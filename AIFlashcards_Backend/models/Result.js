const Answer = require("./Answer");

/**
 * Class representing a test result for a user.
 *
 * Stores the user, the test taken, the date it was taken,
 * and a list of answers.
 */
class Result {
  /**
   * Create a Result instance.
   * @param {string} username - The username of the user who took the test.
   * @param {string} testTitle - The title of the test taken.
   * @param {string|Date} takenAt - The date/time when the test was taken.
   * @param {Array<Answer|object>} answers - Array of `Answer` instances or plain objects with `{ question, correct }`.
   */
  constructor(username, testTitle, takenAt, answers) {
    this.username = username;
    this.testTitle = testTitle;
    this.takenAt = takenAt;

    // Ensure all items in answers are Answer instances
    this.answers = answers.map((a) =>
      a instanceof Answer ? a : new Answer(a.question, a.correct)
    );
  }
}

module.exports = Result;
