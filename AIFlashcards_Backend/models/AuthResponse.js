/**
 * Class representing a user in an authentication response.
 */
class AuthResponseUser {
  /**
   * Create an AuthResponseUser instance.
   * @param {string} username - The username of the authenticated user.
   */
  constructor(username) {
    this.username = username;
  }
}

/**
 * Class representing an authentication response.
 *
 * Encapsulates a message and the user information.
 */
class AuthResponse {
  /**
   * Create an AuthResponse instance.
   * @param {string} message - Message describing the result of the authentication (e.g., "Login successful").
   * @param {object} user - User object with at least a `username` property.
   */
  constructor(message, user) {
    this.message = message;
    // Wrap the user object in AuthResponseUser to control what information is exposed
    this.user = new AuthResponseUser(user.username);
  }
}

module.exports = { AuthResponse, AuthResponseUser };
