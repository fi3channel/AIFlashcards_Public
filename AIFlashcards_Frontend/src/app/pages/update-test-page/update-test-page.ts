import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TestService } from '../../services/test.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from '../../services/navigation.service';
import { Question, Test, TestRequest } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { QuestionFormComponent } from '../../components/question-form/question-form.component';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-update-test-page',
  imports: [CommonModule, HeaderComponent, FormsModule, QuestionFormComponent, InfoModalComponent],
  templateUrl: './update-test-page.html',
  styleUrl: './update-test-page.scss',
  standalone: true,
})
/**
 * UpdateTestPage
 *
 * Allows the user to update an existing test.
 * Handles loading the selected test, updating its questions,
 * and submitting updates or deleting the test.
 */
export class UpdateTestPage {
  // -------------------------
  // Services
  // -------------------------
  private testService = inject(TestService);
  private authService = inject(AuthenticationService);
  private navigationService = inject(NavigationService);

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
   * Initializes the UpdateTestPage and loads the selected test for the current user.
   */
  constructor() {
    effect(() => {
      this.selectedTest = this.testService.getSelectedTest();
      this.currentUser = this.authService.getCurrentUser() || '';

      if (this.currentUser && this.selectedTest) {
        const req: TestRequest = {
          username: this.currentUser,
          title: this.selectedTest,
        };

        this.testService.getTestByTitle(req).subscribe({
          next: (test: Test) => {
            this.numberOfQuestions = test.numberOfQuestions;
            this.questions = test.questions.map((q) => ({
              text: q.text,
              answer: q.answer,
            }));
            console.log(this.questions);
          },
          error: (err) => {
            console.error('Failed to fetch test:', err);
            this.showInfo('Load failed', 'Could not load the test.');
          },
        });
      }
    });
  }

  /**
   * Shows an information modal with a title, message, and optional callback.
   * @param title Modal title
   * @param message Modal message
   * @param callback Optional callback invoked on modal OK
   */
  showInfo(title: string, message: string, callback?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
    this.modalCallback = callback ?? null;
  }

  /**
   * Handles the modal OK button and triggers the callback if provided.
   */
  onOk() {
    if (this.modalCallback) {
      this.modalCallback();
    }
    this.modalVisible = false;
  }

  /**
   * Handles changes to the number of questions and syncs the questions array.
   * @param event Input event from number field
   */
  onNumberBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 20) {
      value = 20;
    }

    this.numberOfQuestions = value;
    input.value = value.toString();

    this.syncQuestions();
  }

  /**
   * Syncs the questions array to match the numberOfQuestions value.
   */
  private syncQuestions() {
    const diff = this.numberOfQuestions - this.questions.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.questions.push({ text: '', answer: '' });
      }
    } else if (diff < 0) {
      this.questions.splice(diff);
    }
  }

  /**
   * Updates a question at the specified index.
   * @param index Index of the question to update
   * @param question Updated question
   */
  onQuestionChange(index: number, question: Question) {
    this.questions[index] = question;
  }

  /**
   * Submits the updated test to the backend.
   */
  onSubmit() {
    if (!this.selectedTest || !this.numberOfQuestions) {
      this.showInfo('Creation failed', 'Please fill in the test title and number of questions.');
      return;
    }

    const incomplete = this.questions.some((q) => !q.text?.trim() || !q.answer?.trim());
    if (incomplete) {
      this.showInfo(
        'Creation failed',
        'All questions and answers must be filled out before submitting.'
      );
      return;
    }

    const updatedTest: Test = {
      username: this.currentUser,
      title: this.selectedTest,
      numberOfQuestions: this.numberOfQuestions,
      questions: this.questions,
    };

    this.testService.updateTest(updatedTest).subscribe({
      next: (res) => {
        this.showInfo('Creation successful', 'Test successfully updated!', () => {
          this.navigationService.goToDashboard();
        });
      },
      error: (err) => {
        console.error('Failed to update test:', err);
        this.showInfo('Creation failed', 'Could not update the test.');
      },
    });
  }

  /**
   * Discards the update process and navigates back to the dashboard.
   */
  onDiscard() {
    this.navigationService.goToDashboard();
  }

  /**
   * Deletes the currently selected test.
   */
  onDelete() {
    if (!this.selectedTest) {
      this.showInfo('Delete failed', 'No test selected to delete.');
      return;
    }

    this.testService
      .deleteTest({ username: this.currentUser, title: this.selectedTest })
      .subscribe({
        next: () => {
          this.showInfo('Delete successful', 'Test deleted successfully!');
          this.navigationService.goToDashboard();
        },
        error: (err) => {
          console.error('Failed to delete test:', err);
          this.showInfo('Delete failed', 'Could not delete the test.');
        },
      });
  }

  /**
   * Removes a question from the questions array.
   * @param index Index of the question to remove
   */
  onRemoveQuestion(index: number) {
    if (this.questions.length <= 1) return;
    this.questions.splice(index, 1);
    this.numberOfQuestions = this.questions.length;
  }

  /**
   * Adds a new empty question to the questions array.
   */
  onAddQuestion() {
    this.questions.push({ text: '', answer: '' });
    this.numberOfQuestions = this.questions.length;
  }
}
