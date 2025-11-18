/**
 * Class representing a user.
 *
 * Stores the username and password of a user.
 * Note: Passwords are stored in plain text in this implementation.
 *       For production use, always hash passwords before storage.
 */
class User {
  /**
   * Create a User instance.
   * @param {string} username - The username of the user.
   * @param {string} password - The user's password (plain text in this implementation).
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

module.exports = User;
