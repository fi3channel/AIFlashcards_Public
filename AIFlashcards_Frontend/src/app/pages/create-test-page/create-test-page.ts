import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Question, Test } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { QuestionFormComponent } from '../../components/question-form/question-form.component';
import { NavigationService } from '../../services/navigation.service';
import { TestService } from '../../services/test.service';
import { AuthenticationService } from '../../services/authentication.service';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-create-test-page',
  imports: [CommonModule, HeaderComponent, FormsModule, QuestionFormComponent, InfoModalComponent],
  templateUrl: './create-test-page.html',
  styleUrl: './create-test-page.scss',
  standalone: true,
})
/**
 * CreateTestPage
 *
 * Page component for creating a new test manually.
 * Handles adding, removing, and updating questions,
 * validates inputs, and submits the test to the backend.
 * Shows informational modals for feedback and navigates
 * the user after creation or discard actions.
 */
export class CreateTestPage {
  // -------------------------
  // Services
  // -------------------------
  private navigationService = inject(NavigationService);
  private testService = inject(TestService);
  private authService = inject(AuthenticationService);

  // -------------------------
  // Variables
  // -------------------------
  testTitle: string = '';
  numberOfQuestions: number = 1;
  questions: Question[] = [];

  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  modalCallback: (() => void) | null = null;

constructor() {
  const selectedTest = this.testService.getSelectedTestObject();

  if (selectedTest?.questions?.length) {
    this.questions = selectedTest.questions.map(q => ({ ...q }));
    this.numberOfQuestions =
      selectedTest.numberOfQuestions ?? this.questions.length;
    this.testTitle = selectedTest.title ?? '';

    // one-time use
    this.testService.clearSelectedTestObject();
  } else {
    this.resetForm();
  }
}

  /**
   * Displays an informational modal with the given title, message,
   * and optional callback to execute on OK.
   *
   * @param title - The modal title
   * @param message - The modal message
   * @param callback - Optional callback executed on modal OK
   */
  showInfo(title: string, message: string, callback?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
    this.modalCallback = callback ?? null;
  }

  /**
   * Handles OK click for informational modal.
   * Executes callback if provided and closes the modal.
   */
  onOk() {
    if (this.modalCallback) {
      this.modalCallback();
    }
    this.modalVisible = false;
  }

  /**
   * Adjusts the questions array to match the desired number
   * of questions.
   */
  onNumberOfQuestionsChange() {
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
   * Updates a specific question in the questions array.
   *
   * @param index - Index of the question to update
   * @param question - The updated question object
   */
  onQuestionChange(index: number, question: { text: string; answer: string }) {
    this.questions[index] = question;
  }

  /**
   * Handles blur event on number of questions input,
   * constrains the value between 1 and 20, and updates the
   * questions array accordingly.
   *
   * @param event - Blur event from the input element
   */
  onNumberBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) value = 1;
    else if (value > 20) value = 20;

    this.numberOfQuestions = value;
    input.value = value.toString();

    this.onNumberOfQuestionsChange();
  }

  /**
   * Validates inputs and submits the test to the backend.
   * Shows modals for errors and successful creation.
   */
  onSubmit() {
    if (!this.testTitle || !this.numberOfQuestions) {
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

    const newTest: Test = {
      username: this.authService.currentUser() || '',
      title: this.testTitle,
      numberOfQuestions: this.numberOfQuestions,
      questions: this.questions,
    };

    this.testService.createTest(newTest).subscribe({
      next: () => {
        this.showInfo('Creation successful', 'Test successfully created!', () => {
          this.navigationService.goToDashboard();
          this.resetForm();
        });
      },
      error: (err) => {
        console.error('Error creating test:', err);
        this.showInfo('Creation failed', 'Failed to create test. Please try again.');
      },
    });
  }

  /**
   * Discards the current test creation and navigates to dashboard.
   */
  onDiscard() {
    this.navigationService.goToDashboard();
  }

  /**
   * Removes a question at a specified index if more than one question exists.
   *
   * @param index - Index of the question to remove
   */
  onRemoveQuestion(index: number) {
    if (this.questions.length <= 1) return;
    this.questions.splice(index, 1);
    this.numberOfQuestions = this.questions.length;
  }

  /**
   * Adds a new empty question to the questions array and updates the count.
   */
  onAddQuestion() {
    this.questions.push({ text: '', answer: '' });
    this.numberOfQuestions = this.questions.length;
  }
  
  /**
   * Resets the form.
   */
  resetForm() {
    this.questions = [{ text: '', answer: '' }];
    this.numberOfQuestions = 1;
    this.testTitle = '';
  }
}
