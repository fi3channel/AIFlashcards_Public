import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { AuthenticationService } from '../services/authentication.service';

/**
 * User Guard
 *
 * Guard that protects routes for unauthenticated users only.
 * Allows access if no user is logged in; otherwise redirects
 * to the dashboard.
 */
@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  // -------------------------
  // Services
  // -------------------------
  private authService = inject(AuthenticationService);
  private navigationService = inject(NavigationService);

  /**
   * Determines if a route can be activated.
   * @returns True if no user is logged in, otherwise navigates to the dashboard and returns false.
   */
  canActivate(): boolean {
    if (!this.authService.getCurrentUser()) {
      return true;
    } else {
      this.navigationService.goToDashboard();
      return false;
    }
  }
}
