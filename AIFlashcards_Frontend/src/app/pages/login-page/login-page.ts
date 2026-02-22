import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
  standalone: true,
})
/**
 * LoginPage
 *
 * Component for user login.
 * Handles login form, authentication, and navigation to the dashboard or signup page.
 */
export class LoginPage {
  // -------------------------
  // Services
  // -------------------------
  private navigationService = inject(NavigationService);
  private authenticationService = inject(AuthenticationService);

  // -------------------------
  // Variables
  // -------------------------
  username = '';
  password = '';
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';

  /**
   * Shows the modal with a given title and message.
   *
   * @param title - The title of the modal
   * @param message - The message displayed in the modal
   */
  showInfo(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
  }

  /**
   * Hides the modal.
   */
  onOk() {
    this.modalVisible = false;
  }

  /**
   * Attempts to log in the user with the provided username and password.
   * Navigates to the dashboard on success or shows an error modal on failure.
   */
  login() {
    if (!this.username.trim() || !this.password.trim()) {
      return;
    }

    this.authenticationService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        console.log('Logged in user:', res.user);
        this.navigationService.goToDashboard();
      },
      error: (err) => {
        this.showInfo('Login Failed', err.error?.error || 'Invalid credentials');
      },
    });
  }

  /**
   * Navigates to the signup page.
   */
  goToSignUp() {
    this.navigationService.goToSignup();
  }
}
