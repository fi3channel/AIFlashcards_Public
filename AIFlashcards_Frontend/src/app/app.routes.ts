import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { CreateTestPage } from './pages/create-test-page/create-test-page';
import { UpdateTestPage } from './pages/update-test-page/update-test-page';
import { CreateTestAiPage } from './pages/create-test-ai-page/create-test-ai-page';
import { StartTestPage } from './pages/start-test-page/start-test-page';
import { PracticeTestPage } from './pages/practice-test-page/practice-test-page';
import { ResultsPage } from './pages/results-page/results-page';
import { TestGuard } from './guards/test.guard';
import { TestResultPage } from './pages/test-result-page/test-result-page';
import { ResultsGuard } from './guards/results.guard';

/**
 * Application Routes
 *
 * Defines all routes for the Angular application, including guards
 * to protect authenticated pages, user access, and test/result pages.
 */
export const routes: Routes = [
  // -------------------------
  // Public Routes
  // -------------------------
  { path: 'login', component: LoginPage, canActivate: [UserGuard] },
  { path: 'signup', component: RegisterPage, canActivate: [UserGuard] },

  // -------------------------
  // Authenticated Routes
  // -------------------------
  { path: 'dashboard', component: DashboardPage, canActivate: [AuthGuard] },
  { path: 'createTest', component: CreateTestPage, canActivate: [AuthGuard] },
  { path: 'updateTest', component: UpdateTestPage, canActivate: [AuthGuard, TestGuard] },
  { path: 'createTestWithAI', component: CreateTestAiPage, canActivate: [AuthGuard] },
  { path: 'startTest', component: StartTestPage, canActivate: [AuthGuard, TestGuard] },
  { path: 'practiceTest', component: PracticeTestPage, canActivate: [AuthGuard, TestGuard] },
  { path: 'results', component: ResultsPage, canActivate: [AuthGuard] },
  { path: 'testResults', component: TestResultPage, canActivate: [AuthGuard, ResultsGuard] },

  // -------------------------
  // Redirects
  // -------------------------
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
