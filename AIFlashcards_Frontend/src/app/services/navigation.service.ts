import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
/**
 * NavigationService
 *
 * Provides convenient methods to navigate between different
 * routes in the application.
 */
export class NavigationService {
  // -------------------------
  // Services
  // -------------------------
  private router = inject(Router);

  /**
   * Navigates to the login page.
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigates to the signup page.
   */
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  /**
   * Navigates to the dashboard page.
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigates to the create test page.
   */
  goToCreateTest(): void {
    this.router.navigate(['createTest']);
  }

  /**
   * Navigates to the update test page.
   */
  goToUpdateTest(): void {
    this.router.navigate(['updateTest']);
  }

  /**
   * Navigates to the create test with AI page.
   */
  goToCreateTestWithAI(): void {
    this.router.navigate(['createTestWithAI']);
  }

  /**
   * Navigates to the start test page.
   */
  goToStartTest(): void {
    this.router.navigate(['startTest']);
  }

  /**
   * Navigates to the practice test page.
   */
  goToPracticeTest(): void {
    this.router.navigate(['practiceTest']);
  }

  /**
   * Navigates to the results page.
   */
  goToResults(): void {
    this.router.navigate(['results']);
  }

  /**
   * Navigates to the test results page.
   */
  goToTestResults(): void {
    this.router.navigate(['testResults']);
  }
}
