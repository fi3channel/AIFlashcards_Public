import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { QuestionRunnerComponent } from '../../components/question-runner/question-runner.component';
import { TestService } from '../../services/test.service';
import { Question, Test, TestRequest } from '../../models/models';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from '../../services/navigation.service';
import { ResultService } from '../../services/results.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-practice-test-page',
  imports: [
    CommonModule,
    HeaderComponent,
    QuestionRunnerComponent,
    ConfirmModalComponent,
    InfoModalComponent,
  ],
  templateUrl: './practice-test-page.html',
  styleUrls: ['./practice-test-page.scss'],
  standalone: true,
})
/**
 * PracticeTestPage
 *
 * Component to run a practice test for a selected user test.
 * Handles question display, user answers, retrying wrong questions, and result storage.
 * Supports modals for information messages and retry confirmation.
 */
export class PracticeTestPage {
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
  showRetryModal = signal(false);

  // -------------------------
  // Variables
  // -------------------------
  selectedTest = '';
  currentUser = '';
  questions: Question[] = [];
  retryQuestions: Question[] = [];
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  modalCallback: (() => void) | null = null;

  constructor() {
    effect(() => {
      this.selectedTest = this.testService.getSelectedTest() ?? '';
      this.currentUser = this.authService.getCurrentUser() || '';

      if (this.currentUser && this.selectedTest) {
        const req: TestRequest = {
          username: this.currentUser,
          title: this.selectedTest,
        };

        this.testService.getTestByTitle(req).subscribe({
          next: (test: Test) => {
            const questions = test.questions.map((q) => ({
              text: q.text,
              answer: q.answer,
            }));
            this.questions = this.shuffleArray(questions);
          },
          error: (err) => {
            console.error('Failed to fetch test:', err);
            this.showInfo('Loading failed', 'Could not load the test.');
          },
        });
      }
    });
  }

  /**
   * Handles answering a question, storing results, and navigating to next question or retry.
   * @param correct - Whether the answer was correct
   */
  answerQuestion(correct: boolean) {
    if (!this.currentQuestion) return;

    this.resultService.addResult(this.currentQuestion, correct);

    if (!correct) this.retryQuestions.push(this.currentQuestion);

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex < this.questions.length) {
      this.currentIndex.set(nextIndex);
    } else {
      if (this.retryQuestions.length > 0) {
        this.showRetryModal.set(true);
      } else {
        this.showInfo('Practice finished', 'All question correct answered!', () => {
          this.resultService.resetResults();
          this.navigationService.goToDashboard();
        });
      }
    }
  }

  /**
   * Handles confirmation to retry wrong questions.
   */
  onRetryConfirm() {
    this.questions = this.retryQuestions;
    this.retryQuestions = [];
    this.currentIndex.set(0);
    this.resultService.resetResults();
    this.showRetryModal.set(false);
  }

  /**
   * Handles cancellation of retrying questions, navigates back to dashboard.
   */
  onRetryCancel() {
    this.navigationService.goToDashboard();
  }

  /**
   * Shows a modal with given title, message, and optional callback.
   * @param title - Title of the modal
   * @param message - Message of the modal
   * @param callback - Optional callback to run when modal is closed
   */
  showInfo(title: string, message: string, callback?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
    this.modalCallback = callback ?? null;
  }

  /**
   * Hides the info modal and executes the callback if provided.
   */
  onOk() {
    if (this.modalCallback) {
      this.modalCallback();
    }
    this.modalVisible = false;
  }

  /**
   * Returns the current question based on the current index.
   */
  get currentQuestion() {
    return this.questions[this.currentIndex()];
  }

  /**
   * Shuffles an array randomly.
   * @param array - Array to shuffle
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
