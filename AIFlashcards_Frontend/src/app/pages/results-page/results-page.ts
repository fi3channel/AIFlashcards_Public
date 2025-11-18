import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { Result } from '../../models/models';
import { ResultService } from '../../services/results.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss',
})
/**
 * ResultsPage
 *
 * Displays the list of test results for the currently logged-in user.
 * Provides utilities to calculate correct answers and percentages.
 * Allows navigation back to the dashboard.
 */
export class ResultsPage {
  // -------------------------
  // Services
  // -------------------------
  private resultService = inject(ResultService);
  private authService = inject(AuthenticationService);
  private navigationService = inject(NavigationService);

  // -------------------------
  // Variables
  // -------------------------
  results: Result[] = [];

  /**
   * Initializes the ResultsPage.
   * Fetches user results for the currently logged-in user and updates local results array.
   */
  constructor() {
    effect(() => {
      this.results = this.resultService.getUserResults();
    });
    const user = this.authService.getCurrentUser();
    if (user) this.resultService.fetchUserResults(user);
  }

  /**
   * Calculates the number of correct answers in a given test result.
   * @param result - The test result object
   * @returns Number of correct answers
   */
  getCorrectCount(result: Result): number {
    return result.answers.filter((a) => a.correct).length;
  }

  /**
   * Calculates the percentage of correct answers in a given test result.
   * @param result - The test result object
   * @returns Correct answer percentage (0-100)
   */
  getPercentage(result: Result): number {
    return Math.round((this.getCorrectCount(result) / result.answers.length) * 100);
  }

  /**
   * Navigates the user back to the dashboard page.
   */
  goToDashboard() {
    this.navigationService.goToDashboard();
  }
}
