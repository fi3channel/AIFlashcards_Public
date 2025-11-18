import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { ResultService } from '../services/results.service';

@Injectable({
  providedIn: 'root',
})
/**
 * ResultsGuard
 *
 * A route guard that ensures test results exist before
 * allowing navigation to the results page. If no results
 * are found, the user is redirected back to the dashboard.
 */
export class ResultsGuard implements CanActivate {
  // -------------------------
  // Services
  // -------------------------
  private resultService = inject(ResultService);
  private navigationService = inject(NavigationService);

  /**
   * Determines whether navigation to the results page is allowed.
   * Redirects to the dashboard if no results are available.
   *
   * @returns true if results exist, false otherwise.
   */
  canActivate(): boolean {
    if (this.resultService.getResults() && this.resultService.getResults().length > 0) {
      return true;
    } else {
      this.navigationService.goToDashboard();
      return false;
    }
  }
}
