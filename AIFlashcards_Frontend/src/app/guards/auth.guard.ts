import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
/**
 * AuthGuard
 *
 * Guard that protects routes from unauthorized access.
 * Checks if a user is logged in and redirects to login
 * page if not authenticated.
 */
export class AuthGuard implements CanActivate {
  // -------------------------
  // --- Services ---
  // -------------------------
  private authService = inject(AuthenticationService);
  private navigationService = inject(NavigationService);

  /**
   * Determines if a route can be activated.
   * @returns True if the user is logged in, otherwise navigates to login and returns false.
   */
  canActivate(): boolean {
    if (this.authService.getCurrentUser()) {
      return true;
    } else {
      this.navigationService.goToLogin();
      return false;
    }
  }
}
