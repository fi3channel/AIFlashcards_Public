const Question = require("./Question");

/**
 * Class representing an answer to a question.
 *
 * This class wraps a `Question` instance along with a boolean
 * indicating whether the answer was correct or not.
 */
class Answer {
  /**
   * Create an Answer instance.
   * @param {Question|object} question - Either a `Question` instance or a plain object with `{ text, answer }`.
   * @param {boolean} correct - Whether the answer is correct.
   * @throws Will throw an error if `question` is neither a Question instance nor a valid object.
   */
  constructor(question, correct) {
    if (question instanceof Question) {
      // Already a Question instance
      this.question = question;
    } else if (
      question &&
      typeof question === "object" &&
      "text" in question &&
      "answer" in question
    ) {
      // Plain object from frontend → wrap into Question instance
      this.question = new Question(question.text, question.answer);
    } else {
      throw new Error(
        "Answer expects a Question instance or an object with { text, answer }"
      );
    }

    // Store whether the answer is correct (convert to boolean)
    this.correct = Boolean(correct);
  }
}

module.exports = Answer;
