import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { HeaderComponent } from '../../components/header/header.component';
import { TestModalComponent } from '../../components/test-modal/test-modal.component';
import { AnalyticsComponent } from '../../components/analytics/analytics.component';
import { Test, TestsRequest } from '../../models/models';
import { AuthenticationService } from '../../services/authentication.service';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TestModalComponent, AnalyticsComponent],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss'],
})
/**
 * DashboardPage
 *
 * The main dashboard component for logged-in users.
 * Handles navigation to test creation, AI-assisted creation,
 * starting, practicing, and editing tests.
 * Loads the user's available tests and manages modal visibility.
 */
export class DashboardPage {
  // -------------------------
  // Services
  // -------------------------
  private navigationService = inject(NavigationService);
  private authService = inject(AuthenticationService);
  private testService = inject(TestService);

  // -------------------------
  // Signals
  // -------------------------
  availableTests = signal<string[]>([]);

  // -------------------------
  // Variables
  // -------------------------
  showTestModal = false;
  showPracticeModal = false;
  showEditTestModal = false;

  constructor() {
    this.loadUserTests();
    this.testService.setSelectedTest('');
  }

  /**
   * Loads the tests for the currently logged-in user.
   * Sets the availableTests signal with the test titles.
   */
  loadUserTests() {
    const username = this.authService.currentUser() || '';
    const request: TestsRequest = { username } as TestsRequest;

    this.testService.getTestsByUser(request).subscribe({
      next: (tests) => {
        this.availableTests.set(tests.map((t) => t.title));
      },
      error: (err) => {
        console.error('Failed to fetch tests:', err);
      },
    });
  }

  /**
   * Navigates to the Create Test page.
   */
  onCreateNewTest() {
    this.navigationService.goToCreateTest();
  }

  /**
   * Navigates to the AI-assisted Create Test page.
   */
  onCreateNewTestWithAI() {
    this.navigationService.goToCreateTestWithAI();
  }

  /**
   * Navigates to the Results page.
   */
  onResults() {
    this.navigationService.goToResults();
  }

  /**
   * Opens the Start Test modal.
   */
  onStartTest() {
    this.showTestModal = true;
  }

  /**
   * Opens the Practice Test modal.
   */
  onPracticeTest() {
    this.showPracticeModal = true;
  }

  /**
   * Opens the Edit Test modal.
   */
  onEditTest() {
    this.showEditTestModal = true;
  }

  /**
   * Handles the selection of a test for starting.
   * Sets the selected test in the service and navigates to start test page.
   *
   * @param test - The selected test title
   */
  onTestSelected(test: string) {
    this.showTestModal = false;
    this.testService.setSelectedTest(test);
    this.navigationService.goToStartTest();
  }

  /**
   * Handles the selection of a test for practice.
   * Sets the selected test in the service and navigates to practice page.
   *
   * @param test - The selected test title
   */
  onPracticeSelected(test: string) {
    this.showPracticeModal = false;
    this.testService.setSelectedTest(test);
    this.navigationService.goToPracticeTest();
  }

  /**
   * Handles the selection of a test for editing.
   * Sets the selected test in the service and navigates to update page.
   *
   * @param test - The selected test title
   */
  onUpdateTestSelected(test: string) {
    this.showEditTestModal = false;
    this.testService.setSelectedTest(test);
    this.navigationService.goToUpdateTest();
  }

  /**
   * Closes the Start Test modal.
   */
  closeTestModal() {
    this.showTestModal = false;
  }

  /**
   * Closes the Practice Test modal.
   */
  closePracticeModal() {
    this.showPracticeModal = false;
  }

  /**
   * Closes the Edit Test modal.
   */
  closeEditTestModal() {
    this.showEditTestModal = false;
  }
}
