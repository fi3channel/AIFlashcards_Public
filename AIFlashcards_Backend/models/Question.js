/**
 * Class representing a question.
 *
 * Stores the text of the question and its correct answer.
 */
class Question {
  /**
   * Create a Question instance.
   * @param {string} text - The text of the question.
   * @param {string} answer - The correct answer for the question.
   */
  constructor(text, answer) {
    this.text = text;
    this.answer = answer;
  }
}

module.exports = Question;
