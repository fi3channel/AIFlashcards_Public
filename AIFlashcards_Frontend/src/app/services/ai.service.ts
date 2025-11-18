import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/models';

@Injectable({
  providedIn: 'root',
})
/**
 * AIService
 *
 * Provides methods for interacting with the AI backend API,
 * such as generating questions from a given text.
 */
export class AIService {
  // -------------------------
  // Services
  // -------------------------
  private httpService = inject(HttpClient);

  // -------------------------
  // Variables
  // -------------------------
  private baseUrl = '/api/ai';

  /**
   * Generates a list of questions based on the provided text.
   *
   * @param text - The input text to generate questions from.
   * @param numQuestions - The number of questions to generate.
   * @returns An Observable emitting an object containing the generated questions.
   */
  generateQuestions(text: string, numQuestions: number): Observable<{ questions: Question[] }> {
    return this.httpService.post<{ questions: Question[] }>(`${this.baseUrl}/generate`, {
      text,
      num_questions: numQuestions,
    });
  }
}
