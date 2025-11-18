import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, FormsModule, InfoModalComponent],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
  standalone: true,
})
/**
 * RegisterPage
 *
 * Component that handles user registration.
 * Allows users to register with a username and password.
 * Displays modals for success or failure messages.
 */
export class RegisterPage {
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
  modalCallback: (() => void) | null = null;

  /**
   * Shows a modal with a title, message, and optional callback for when the modal closes.
   * @param title - Title of the modal
   * @param message - Message of the modal
   * @param callback - Optional callback to execute when modal is closed
   */
  showInfo(title: string, message: string, callback?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
    this.modalCallback = callback ?? null;
  }

  /**
   * Closes the modal and executes the callback if provided.
   */
  onOk() {
    if (this.modalCallback) {
      this.modalCallback();
    }
    this.modalVisible = false;
  }

  /**
   * Registers a new user using the provided username and password.
   * On success, shows a success modal and navigates to login page.
   * On failure, shows an error modal.
   */
  register() {
    if (!this.username.trim() || !this.password.trim()) {
      return;
    }
    this.authenticationService.register(this.username, this.password).subscribe({
      next: () => {
        this.showInfo('Registration Successful', 'You can now log in.', () => {
          this.navigationService.goToLogin();
        });
      },
      error: (err) => {
        this.showInfo('Registration Failed', err.error?.message || 'Account already exists');
      },
    });
  }

  /**
   * Navigates the user to the login page.
   */
  goToLogin() {
    this.navigationService.goToLogin();
  }
}
