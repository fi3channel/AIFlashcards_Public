import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
/**
 * HeaderComponent
 *
 * Provides the application header with navigation and user actions.
 * Includes menu toggling, logout functionality, and navigation back
 * to the dashboard. Displays the currently logged-in user.
 */
export class HeaderComponent {
  // -------------------------
  // Services
  // -------------------------
  private authService = inject(AuthenticationService);
  private navigationService = inject(NavigationService);

  // -------------------------
  // Variables
  // -------------------------
  showMenu = false;

  /**
   * Toggles the visibility of the navigation menu.
   */
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  /**
   * Logs out the current user and redirects to the login page.
   */
  logout(): void {
    this.authService.logout();
    this.navigationService.goToLogin();
  }

  /**
   * Navigates back to the dashboard.
   */
  backToDashboard(): void {
    this.navigationService.goToDashboard();
  }

  /**
   * Gets the username of the currently logged-in user.
   * Returns an empty string if no user is logged in.
   */
  get currentUser(): string | null {
    return this.authService.getCurrentUser() || '';
  }
}
