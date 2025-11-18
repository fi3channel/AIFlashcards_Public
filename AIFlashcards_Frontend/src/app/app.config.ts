import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Application configuration
 *
 * Sets up global providers for the Angular application, including:
 * - Global error listeners
 * - Zone.js change detection with event coalescing
 * - Router configuration with application routes
 * - HTTP client for backend communication
 */
export const appConfig: ApplicationConfig = {
  // -------------------------
  // Services / Providers
  // -------------------------
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
