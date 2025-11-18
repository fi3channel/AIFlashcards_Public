import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { TestService } from '../services/test.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Test Guard
 *
 * Guard that protects routes requiring a selected test.
 * Checks if a test is selected and redirects to the dashboard
 * if no test is selected.
 */
export class TestGuard implements CanActivate {
  // -------------------------
  // Services
  // -------------------------
  private testService = inject(TestService);
  private navigationService = inject(NavigationService);

  /**
   * Determines if a route can be activated.
   * @returns True if a test is selected, otherwise navigates to the dashboard and returns false.
   */
  canActivate(): boolean {
    if (this.testService.getSelectedTest()) {
      return true;
    } else {
      this.navigationService.goToDashboard();
      return false;
    }
  }
}
