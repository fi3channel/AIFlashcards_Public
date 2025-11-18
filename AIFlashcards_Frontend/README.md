# AIFlashcards

**AIFlashcards** is a standalone Angular application for creating, practicing, and managing tests and flashcards. It includes user authentication, AI-assisted question generation, and detailed results tracking.

---

## Features

- User registration and login with session persistence.
- Create tests manually or generate questions via AI.
- Update, delete, or manage existing tests.
- Practice tests with retry functionality for incorrect answers.
- Start tests and record results per user.
- View detailed test and practice results with correct/incorrect counts.
- Responsive UI with modals for user feedback.

---

## Application Structure

The application is organized using **Angular standalone components**, **signals** for reactive state management, and **services** for all backend interactions.

### Services

- **AuthenticationService**: Handles registration, login, logout, and session tracking.
- **NavigationService**: Centralized navigation between pages (e.g., dashboard, create test, start test).
- **TestService**: CRUD operations for tests, manages currently selected test, fetches tests by user or title.
- **ResultService**: Tracks test results in real-time and stores/retrieves user results.
- **AIService**: Generates AI-based questions for tests.

---

## Pages & Components

### Pages

- **LoginPage**: Handles user login.
- **RegisterPage**: Handles user registration.
- **DashboardPage**: Displays available tests and modals for starting, practicing, or editing tests.
- **CreateTestPage**: Allows manual creation of tests with questions.
- **CreateTestAiPage**: Generates questions via AI.
- **UpdateTestPage**: Updates existing tests and manages questions.
- **StartTestPage**: Runs tests and records answers.
- **PracticeTestPage**: Practice mode with retry for incorrect answers.
- **ResultsPage**: Shows all past results for a user.
- **TestResultPage**: Shows results of the current test with score percentage.

### Components

- **HeaderComponent**: Common header across pages.
- **QuestionFormComponent**: Form for editing individual questions.
- **QuestionRunnerComponent**: Handles question display and answering.
- **InfoModalComponent**: Modal to display informational messages.
- **ConfirmModalComponent**: Modal to confirm actions (e.g., retry questions).
- **TestModalComponent**: Modal to select tests for starting or practicing.
- **AnalyticsComponent**: Displays analytics or progress (used in dashboard).

---

## Routing

The application uses Angular Router with the following routes:

- Public: `/login`, `/signup`.
- Protected (require login): `/dashboard`, `/createTest`, `/updateTest`, `/startTest`, `/practiceTest`, `/results`, `/testResults`.
- Fallback routes redirect to login.

Guards ensure only authorized users can access protected pages and that tests or results are only accessible when selected.

---

## State Management & Modals

- **Signals** track reactive state for:
  - Selected test (`TestService`)
  - Current question index (`StartTestPage`, `PracticeTestPage`)
  - User results (`ResultService`)
- **Modals** display messages, confirm actions, or provide user feedback.

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AIFlashcardsFrontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   ng serve
   ```

4. **Open the app in your browser**

   ```
   http://localhost:4200
   ```

---

## Application Overview

AIFlashcardsFrontend is an Angular application designed to create, practice, and track test performance. It features:

- **Authentication**: Login and registration system for users.
- **Test Creation**: Users can create tests manually or generate questions using AI.
- **Practice Mode**: Allows users to answer questions with retry for incorrect answers.
- **Test Execution**: Users can start tests and have results saved for review.
- **Results Tracking**: Users can see detailed results including correct counts and percentages.

### Key Components

- **Pages**: Login, Register, Dashboard, CreateTest, UpdateTest, StartTest, PracticeTest, Results, TestResult.
- **Services**: NavigationService, TestService, ResultService, AuthenticationService, AIService.
- **UI Components**: HeaderComponent, QuestionFormComponent, QuestionRunnerComponent, InfoModalComponent, ConfirmModalComponent, TestModalComponent, AnalyticsComponent.

### Features

- **AI Question Generation**: Users can input text and generate questions using AI.
- **Dynamic Test Management**: Add, remove, update questions, and change the number of questions dynamically.
- **Signal-based State Management**: Angular signals are used for reactive state updates.
- **Modal Dialogs**: Informational, confirmation, and error modals for improved UX.

---

## Dependencies / Libraries

The application relies on the following libraries and frameworks:

- **Angular 20** – Core framework for building the frontend.
- **@angular/cdk** – Component Dev Kit for Angular UI components.
- **@angular/common** – Common Angular directives and services.
- **@angular/compiler** – Angular compiler for templates.
- **@angular/core** – Core Angular functionality.
- **@angular/forms** – Template-driven and reactive forms support.
- **@angular/material** – Angular Material components for UI design.
- **@angular/platform-browser** – Browser rendering and DOM manipulation.
- **@angular/router** – Client-side routing.
- **chart.js** – Charting library for data visualization.
- **ng2-charts** – Angular wrapper for Chart.js.
- **rxjs** – Reactive Extensions for JavaScript.
- **tslib** – TypeScript helper library.
- **zone.js** – Execution context tracking for Angular.

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this code.

---
