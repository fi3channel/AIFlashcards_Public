# AIFlashcards Backend API

This backend provides a lightweight API for creating and managing tests, questions, answers, results, analytics, and user authentication. It is built using **Node.js**, **Express**, and **LowDB** for JSON-based storage.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

  - [Tests](#tests)
  - [Results](#results)
  - [Analytics](#analytics)
  - [Authentication](#authentication)
  - [AI Question Generation](#ai-question-generation)

- [Data Models](#data-models)
- [Libraries](#libraries)
- [License](#license)

---

## Features

- Create, update, delete, and retrieve tests for users.
- Save test results and retrieve results by user.
- Generate analytics for test results including activity over time, top tests, and correct/incorrect answer counts.
- User registration and login with simple authentication.
- Generate AI-based questions from text via an external Flask service.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   Default server port: `3000`.

4. Ensure the AI Flask service is running on `http://localhost:5000` if using the `/generate` route.

---

## Usage

The backend exposes **JSON-based REST endpoints**. All requests and responses are in JSON format.

---

## API Endpoints

### Tests

- **POST `/tests/create`** – Create a new test
  **Body:**

  ```json
  {
    "username": "john",
    "title": "Math Test",
    "questions": [
      { "text": "2+2?", "answer": "4" },
      { "text": "3+5?", "answer": "8" }
    ]
  }
  ```

- **POST `/tests/getByUser`** – Get all tests for a user
  **Body:** `{ "username": "john" }`
- **POST `/tests/getTestByTitle`** – Get a test by username and title
- **POST `/tests/updateTest`** – Update an existing test
- **POST `/tests/deleteTest`** – Delete an existing test

### Results

- **POST `/results/save`** – Save a test result
- **POST `/results/getByUser`** – Get results by username

### Analytics

- **POST `/analytics`** – Get analytics for test results
  **Optional Body:** `{ "username": "john" }`
  **Response:**

  ```json
  {
    "correctIncorrect": { "correct": 10, "incorrect": 5 },
    "topTests": [
      { "name": "Math Test", "taken": 3, "correct": 7, "incorrect": 2 }
    ],
    "activity": [{ "month": "2025-10", "count": 2 }]
  }
  ```

### Authentication

- **POST `/auth/register`** – Register a new user
- **POST `/auth/login`** – Login an existing user
  **Note:** Passwords are currently stored in plain text. Use hashing for production.

### AI Question Generation

- **POST `/generate`** – Generate AI-based questions from text
  **Body:**

  ```json
  {
    "text": "Text to generate questions from",
    "num_questions": 5
  }
  ```

---

## Data Models

### Question

```js
class Question {
  constructor(text, answer) { ... }
}
```

### Answer

```js
class Answer {
  constructor(question, correct) { ... }
}
```

### Test

```js
class Test {
  constructor(username, title, numberOfQuestions, questions = []) { ... }
}
```

### Result

```js
class Result {
  constructor(username, testTitle, takenAt, answers) { ... }
}
```

### User

```js
class User {
  constructor(username, password) { ... }
}
```

### AuthResponse

```js
class AuthResponse {
  constructor(message, user) { ... }
}
```

---

## Libraries

This backend uses the following key libraries as defined in `package.json`:

- **express**: Fast, minimal web framework for creating REST APIs.
- **axios**: HTTP client for sending requests, used here to communicate with the AI Flask service.
- **lowdb**: Lightweight JSON database for storing tests, results, and users.
- **nodemon** (dev dependency): Automatically restarts the server during development.

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this code.

---
