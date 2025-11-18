import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsData } from '../models/models';

@Injectable({
  providedIn: 'root',
})
/**
 * AnalyticsService
 *
 * Provides methods to fetch analytics data from the backend API.
 * Can optionally fetch data for a specific user.
 */
export class AnalyticsService {
  // -------------------------
  // Services
  // -------------------------
  private httpService = inject(HttpClient);

  // -------------------------
  // Variables
  // -------------------------
  private baseUrl = '/api/analytics';

  /**
   * Retrieves analytics data from the backend.
   *
   * @param username - Optional username to fetch analytics for a specific user.
   * @returns An Observable emitting the analytics data.
   */
  getAnalytics(username?: string): Observable<AnalyticsData> {
    const body = username ? { username } : {};
    return this.httpService.post<AnalyticsData>(`${this.baseUrl}`, body);
  }
}
