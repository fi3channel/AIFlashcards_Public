// --- Core Models ---

/**
 * Represents a question in a test.
 */
export interface Question {
  /** The text of the question */
  text: string;
  /** The correct answer */
  answer: string;
}

/**
 * Represents a test created by a user.
 */
export interface Test {
  /** Username of the test creator */
  username: string;
  /** Title of the test */
  title: string;
  /** Number of questions in the test */
  numberOfQuestions: number;
  /** List of questions */
  questions: Question[];
}

/**
 * Represents a user with credentials.
 */
export interface User {
  /** Username of the user */
  username: string;
  /** Password of the user */
  password: string;
}

/**
 * Represents the result of a single question in a test.
 */
export interface TestResult {
  /** The question */
  question: Question;
  /** Whether the answer was correct */
  correct: boolean;
  /** Timestamp when the question was taken */
  takenAt: Date;
}

/**
 * Represents a single answer for analytics or result storage.
 */
export interface Answer {
  /** The question */
  question: Question;
  /** Whether the answer was correct */
  correct: boolean;
}

/**
 * Represents the result of a completed test for a user.
 */
export interface Result {
  /** Username of the user who took the test */
  username: string;
  /** Title of the test */
  testTitle: string;
  /** Timestamp when the test was taken */
  takenAt: Date;
  /** List of answers */
  answers: Answer[];
}

// --- Analytics Models ---

/**
 * Stores the number of correct and incorrect answers.
 */
export interface CorrectIncorrect {
  correct: number;
  incorrect: number;
}

/**
 * Represents top test statistics.
 */
export interface TopTest {
  /** Name of the test */
  name: string;
  /** Number of times the test was taken */
  taken: number;
  /** Number of correct answers */
  correct: number;
  /** Number of incorrect answers */
  incorrect: number;
}

/**
 * Represents activity data for a month.
 */
export interface Activity {
  /** Month label */
  month: string;
  /** Number of actions or tests taken */
  count: number;
}

/**
 * Encapsulates all analytics data.
 */
export interface AnalyticsData {
  /** Correct and incorrect answers summary */
  correctIncorrect: CorrectIncorrect;
  /** Top tests statistics */
  topTests: TopTest[];
  /** Monthly activity data */
  activity: Activity[];
}

// --- Requests and Responses ---

/**
 * Represents a user in authentication response.
 */
export interface AuthResponseUser {
  /** Username of the authenticated user */
  username: string;
}

/**
 * Response returned after authentication.
 */
export interface AuthResponse {
  /** Message from the server */
  message: string;
  /** Authenticated user data */
  user: AuthResponseUser;
}

/**
 * Request object to get tests by username.
 */
export interface TestsRequest {
  /** Username of the user */
  username: string;
}

/**
 * Request object to get a specific test.
 */
export interface TestRequest {
  /** Username of the user */
  username: string;
  /** Title of the test */
  title: string;
}
