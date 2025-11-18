import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Test, TestRequest, TestsRequest } from '../models/models';

@Injectable({
  providedIn: 'root',
})
/**
 * TestService
 *
 * Handles operations related to tests, including creating, updating,
 * deleting, fetching tests from the backend, and managing the currently
 * selected test using signals.
 */
export class TestService {
  // -------------------------
  // Services
  // -------------------------
  private httpService = inject(HttpClient);

  // -------------------------
  // Signals
  // -------------------------
  private selectedTest = signal<string>('');
  private selectedTestObject = signal<Test>({} as Test);

  // -------------------------
  // Variables
  // -------------------------
  private baseUrl = '/api/test';

  /**
   * Creates a new test in the backend.
   *
   * @param test - The test object to create.
   * @returns An Observable containing a message and the created test.
   */
  createTest(test: Test): Observable<{ message: string; test: Test }> {
    return this.httpService.post<{ message: string; test: Test }>(`${this.baseUrl}/create`, test);
  }

  /**
   * Updates an existing test in the backend.
   *
   * @param test - The test object to update.
   * @returns An Observable containing a message and the updated test.
   */
  updateTest(test: Test): Observable<{ message: string; test: Test }> {
    return this.httpService.post<{ message: string; test: Test }>(
      `${this.baseUrl}/updateTest`,
      test
    );
  }

  /**
   * Deletes a test in the backend based on the provided request.
   *
   * @param request - The TestRequest object containing the test info.
   * @returns An Observable containing a message and the deleted test.
   */
  deleteTest(request: TestRequest): Observable<{ message: string; test: Test }> {
    return this.httpService.post<{ message: string; test: Test }>(
      `${this.baseUrl}/deleteTest`,
      request
    );
  }

  /**
   * Retrieves all tests for a specific user.
   *
   * @param request - The TestsRequest object containing user info.
   * @returns An Observable containing an array of Test objects.
   */
  getTestsByUser(request: TestsRequest): Observable<Test[]> {
    return this.httpService.post<Test[]>(`${this.baseUrl}/getByUser`, request);
  }

  /**
   * Retrieves a single test by its title.
   *
   * @param request - The TestRequest object containing the test title.
   * @returns An Observable containing the requested Test.
   */
  getTestByTitle(request: TestRequest): Observable<Test> {
    return this.httpService.post<Test>(`${this.baseUrl}/getTestByTitle`, request);
  }

  /**
   * Returns the currently selected test's title.
   *
   * @returns The selected test title.
   */
  getSelectedTest(): string {
    return this.selectedTest();
  }

  /**
   * Sets the currently selected test's title.
   *
   * @param test - The test title to select.
   */
  setSelectedTest(test: string): void {
    this.selectedTest.set(test);
  }

  /**
   * Returns the currently selected test object.
   *
   * @returns The selected Test object.
   */
  getSelectedTestObject(): Test {
    return this.selectedTestObject();
  }

  /**
   * Sets the currently selected test object.
   *
   * @param test - The Test object to select.
   */
  setSelectedTestObject(test: Test): void {
    this.selectedTestObject.set(test);
  }
}
