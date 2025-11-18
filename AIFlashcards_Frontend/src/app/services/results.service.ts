import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Question, TestResult, Result } from '../models/models';

@Injectable({
  providedIn: 'root',
})
/**
 * ResultService
 *
 * Manages test results within the application, including adding
 * results, resetting them, retrieving current results, saving to
 * the backend, and fetching user-specific results.
 */
export class ResultService {
  // -------------------------
  // Services
  // -------------------------
  private httpService = inject(HttpClient);

  // -------------------------
  // Signals
  // -------------------------
  results = signal<TestResult[]>([]);
  userResults = signal<Result[]>([]);

  // -------------------------
  // Variables
  // -------------------------
  private baseUrl = '/api/results';

  /**
   * Adds a new result for a question.
   *
   * @param question - The question that was answered.
   * @param correct - Whether the answer was correct.
   */
  addResult(question: Question, correct: boolean): void {
    const result: TestResult = {
      question,
      correct,
      takenAt: new Date(),
    };
    this.results.update((current) => [...current, result]);
  }

  /**
   * Resets all current test results.
   */
  resetResults(): void {
    this.results.set([]);
  }

  /**
   * Retrieves all current test results.
   *
   * @returns An array of TestResult objects.
   */
  getResults(): TestResult[] {
    return this.results();
  }

  /**
   * Retrieves user-specific results fetched from the backend.
   *
   * @returns An array of Result objects.
   */
  getUserResults(): Result[] {
    return this.userResults();
  }

  /**
   * Saves the current results for a user and test title to the backend.
   *
   * @param username - The username of the test taker.
   * @param testTitle - The title of the test.
   * @returns An Observable from the HTTP POST request.
   */
  saveResults(username: string, testTitle: string) {
    const payload: Result = {
      username,
      testTitle,
      takenAt: new Date(),
      answers: this.results().map((r) => ({
        question: r.question,
        correct: r.correct,
      })),
    };

    return this.httpService.post(`${this.baseUrl}/save`, payload);
  }

  /**
   * Fetches results for a specific user from the backend and updates the signal.
   *
   * @param username - The username to fetch results for.
   */
  fetchUserResults(username: string): void {
    this.httpService.post<Result[]>(`${this.baseUrl}/getByUser`, { username }).subscribe({
      next: (data) => this.userResults.set(data),
      error: (err) => console.error('Failed to load user results', err),
    });
  }
}
