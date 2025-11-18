import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ResultService } from '../../services/results.service';
import { NavigationService } from '../../services/navigation.service';
import { TestResult } from '../../models/models';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-test-result-page',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './test-result-page.html',
  styleUrl: './test-result-page.scss',
  standalone: true,
})
/**
 * TestResultPage
 *
 * Displays the results of a recently completed test.
 * Provides summary information such as correct count and percentage,
 * and allows the user to navigate back to the dashboard.
 */
export class TestResultPage {
  // -------------------------
  // Services
  // -------------------------
  private resultService = inject(ResultService);
  private navigationService = inject(NavigationService);

  // -------------------------
  // Variables
  // -------------------------
  results: TestResult[] = [];

  /**
   * Initializes the TestResultPage and loads the current test results.
   */
  constructor() {
    this.results = this.resultService.getResults();
  }

  /**
   * Navigates to the dashboard and resets the current test results.
   */
  goToDashboard() {
    this.resultService.resetResults();
    this.navigationService.goToDashboard();
  }

  /**
   * Returns the number of correctly answered questions.
   */
  get correctCount() {
    return this.results.filter((r) => r.correct).length;
  }

  /**
   * Returns the percentage of correctly answered questions.
   */
  get correctPercentage(): number {
    if (!this.results || this.results.length === 0) return 0;
    return Math.round((this.correctCount / this.results.length) * 100);
  }
}
