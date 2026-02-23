import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { QuestionRunnerComponent } from '../../components/question-runner/question-runner.component';
import { TestService } from '../../services/test.service';
import { Question, Test, TestRequest } from '../../models/models';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from '../../services/navigation.service';
import { ResultService } from '../../services/results.service';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-start-test-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, QuestionRunnerComponent, InfoModalComponent],
  templateUrl: './start-test-page.html',
  styleUrl: './start-test-page.scss',
})
/**
 * StartTestPage
 *
 * Handles the logic for running a test for the currently logged-in user.
 * Fetches the selected test, displays questions, records results, and saves them at the end.
 */
export class StartTestPage {
  // -------------------------
  // Services
  // -------------------------
  private testService = inject(TestService);
  private authService = inject(AuthenticationService);
  private navigationService = inject(NavigationService);
  private resultService = inject(ResultService);

  // -------------------------
  // Signals
  // -------------------------
  currentIndex = signal(0);

  // -------------------------
  // Variables
  // -------------------------
  selectedTest = '';
  currentUser = '';
  numberOfQuestions = 0;
  questions: Question[] = [];
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  modalCallback: (() => void) | null = null;

  /**
   * Initializes the StartTestPage.
   * Loads the selected test for the current user and shuffles the questions.
   */
  constructor() {
    effect(() => {
      this.selectedTest = this.testService.getSelectedTest() || '';
      this.currentUser = this.authService.getCurrentUser() || '';

      if (this.currentUser && this.selectedTest) {
        const req: TestRequest = {
          username: this.currentUser,
          title: this.selectedTest,
        };

        this.testService.getTestByTitle(req).subscribe({
          next: (test: Test) => {
            this.testService.setSelectedTestObject(test);
            this.numberOfQuestions = test.numberOfQuestions;
            const questions = test.questions.map((q) => ({
              text: q.text,
              answer: q.answer,
            }));
            this.questions = this.shuffleArray(questions);
          },
          error: (err) => {
            console.error('Failed to fetch test:', err);
            this.showInfo('Starting of test failed', 'Could not load the test.');
          },
        });
      }
    });
  }

  /**
   * Displays a modal with a title, message, and optional callback.
   * @param title - The title of the modal
   * @param message - The message body
   * @param callback - Optional callback to execute when modal is confirmed
   */
  showInfo(title: string, message: string, callback?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
    this.modalCallback = callback ?? null;
  }

  /**
   * Closes the modal and triggers the callback if provided.
   */
  onOk() {
    if (this.modalCallback) {
      this.modalCallback();
    }
    this.modalVisible = false;
  }

  /**
   * Records the answer to the current question.
   * Advances to the next question or saves results if the test is completed.
   * @param correct - Whether the answer was correct
   */
  answerQuestion(correct: boolean) {
    if (!this.currentQuestion) return;

    this.resultService.addResult(this.currentQuestion, correct);

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex < this.questions.length) {
      this.currentIndex.set(nextIndex);
    } else {
      this.resultService.saveResults(this.currentUser, this.selectedTest).subscribe({
        next: () => {
          this.showInfo('Test completed', 'Test completed and results saved!', () => {
            this.navigationService.goToTestResults();
          });
        },
        error: (err) => {
          console.error('Failed to save results:', err);
          this.showInfo('Test completed', 'Test completed, but results could not be saved.');
        },
      });
    }
  }

  /**
   * Returns the current question based on the current index.
   */
  get currentQuestion() {
    return this.questions[this.currentIndex()];
  }

  /**
   * Randomly shuffles the elements of an array.
   * @param array - The array to shuffle
   * @returns A new shuffled array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
