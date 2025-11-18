import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
/**
 * AuthenticationService
 *
 * Handles user authentication, including registration, login, logout,
 * and tracking the currently logged-in user using a reactive signal.
 */
export class AuthenticationService {
  // -------------------------
  // Services
  // -------------------------
  private httpService = inject(HttpClient);

  // -------------------------
  // Signals
  // -------------------------
  currentUser = signal<string | null>(this.getStoredUser());

  // -------------------------
  // Variables
  // -------------------------
  private baseUrl = '/api/auth';

  /**
   * Returns the currently logged-in user's username, or null if not logged in.
   */
  getCurrentUser(): string | null {
    return this.currentUser();
  }

  /**
   * Registers a new user with the given username and password.
   *
   * @param username - The username for registration.
   * @param password - The password for registration.
   * @returns An Observable emitting the authentication response.
   */
  register(username: string, password: string): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>(`${this.baseUrl}/register`, { username, password });
  }

  /**
   * Logs in a user with the given username and password.
   * Updates the currentUser signal upon successful login.
   *
   * @param username - The username to log in.
   * @param password - The password to log in.
   * @returns An Observable emitting the logged-in User object.
   */
  login(username: string, password: string): Observable<User> {
    return this.httpService
      .post<User>(`${this.baseUrl}/login`, { username, password } as User)
      .pipe(
        tap(() => {
          this.setStoredUser(username);
        })
      );
  }

  /**
   * Logs out the current user and clears the stored username.
   */
  logout(): void {
    this.clearStoredUser();
  }

  /**
   * Stores the given username in local storage and updates the currentUser signal.
   *
   * @param username - The username to store.
   */
  private setStoredUser(username: string): void {
    localStorage.setItem('currentUser', username);
    this.currentUser.set(username);
  }

  /**
   * Retrieves the stored username from local storage.
   *
   * @returns The stored username, or null if not found.
   */
  private getStoredUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  /**
   * Clears the stored username and resets the currentUser signal to null.
   */
  private clearStoredUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
  }
}
