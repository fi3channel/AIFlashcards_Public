import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { AIService } from '../../services/ai.service';
import { Question, Test } from '../../models/models';
import { TestService } from '../../services/test.service';
import { firstValueFrom } from 'rxjs';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-create-test-ai-page',
  imports: [CommonModule, HeaderComponent, FormsModule, InfoModalComponent],
  templateUrl: './create-test-ai-page.html',
  styleUrl: './create-test-ai-page.scss',
  standalone: true,
})
/**
 * CreateTestAiPage
 *
 * Allows the user to generate test questions using AI based on
 * input content, manage the generated questions, and navigate
 * to the test creation page. Displays informational modals
 * for feedback to the user.
 */
export class CreateTestAiPage {
  // -------------------------
  // Services
  // -------------------------
  private navigationService = inject(NavigationService);
  private aiService = inject(AIService);
  private testService = inject(TestService);

  // -------------------------
  // Variables
  // -------------------------
  testContent: string = '';
  questionCount: number = 1;
  generatedQuestions: Question[] = [];
  loading = false;
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';

  /**
   * Submits the test content to the AI service to generate questions.
   * Sets the generated questions in TestService and navigates to the
   * test creation page. Shows modals for errors and success messages.
   */
  onSubmit() {
    if (!this.testContent.trim()) {
      this.showInfo('Generating test error', 'Please enter some test content.');
      return;
    }
    this.loading = true;

    firstValueFrom(this.aiService.generateQuestions(this.testContent, this.questionCount))
      .then((res) => {
        console.log('AI Response:', res);
        this.generatedQuestions = res.questions;

        this.testService.setSelectedTestObject({
          questions: this.generatedQuestions,
          numberOfQuestions: this.generatedQuestions.length,
        } as Test);

        this.showInfo('Question generated', 'The questions are successfully generated!');
        this.navigationService.goToCreateTest();
      })
      .catch((err) => {
        console.error('Error fetching AI questions:', err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * Displays an informational modal with the given title and message.
   *
   * @param title - The modal title.
   * @param message - The modal message.
   */
  showInfo(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
  }

  /**
   * Closes the informational modal.
   */
  onOk() {
    this.modalVisible = false;
  }

  /**
   * Navigates back to the dashboard page.
   */
  goToDashboard() {
    this.navigationService.goToDashboard();
  }

  /**
   * Handles blur event on the question count input, ensuring
   * the value stays between 1 and 20.
   *
   * @param event - The blur event from the input element.
   */
  onNumberBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 20) {
      value = 20;
    }

    this.questionCount = value;
    input.value = value.toString();
  }
}
