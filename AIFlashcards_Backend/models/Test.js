/**
 * Class representing a test created by a user.
 *
 * Stores the username of the creator, test title,
 * number of questions, and the list of question objects.
 */
class Test {
  /**
   * Create a Test instance.
   * @param {string} username - The username of the test creator.
   * @param {string} title - The title of the test.
   * @param {number} numberOfQuestions - Total number of questions in the test.
   * @param {Array} [questions=[]] - Optional array of question objects.
   */
  constructor(username, title, numberOfQuestions, questions = []) {
    this.username = username;
    this.title = title;
    this.numberOfQuestions = numberOfQuestions;
    this.questions = questions;
  }
}

module.exports = Test;
