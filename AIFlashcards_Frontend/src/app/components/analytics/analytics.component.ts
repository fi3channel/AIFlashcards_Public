import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthenticationService } from '../../services/authentication.service';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
/**
 * AnalyticsComponent
 *
 * Displays various analytics data (correct vs incorrect answers,
 * most taken tests, and test activity over time) using charts.
 * Provides navigation between multiple chart views.
 */
export class AnalyticsComponent implements OnInit {
  // -------------------------
  // Services
  // -------------------------
  private analyticsService = inject(AnalyticsService);
  private authService = inject(AuthenticationService);

  // -------------------------
  // Variables
  // -------------------------
  currentChartIndex = 0;
  chartTitles = ['Correct vs Incorrect', 'Top 5 Most Taken Tests', 'Test Activity Over Time'];

  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };

  pieChartType: ChartType = 'pie';
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, indexAxis: 'y' };
  lineChartOptions: ChartConfiguration<'line'>['options'] = { responsive: true };

  /**
   * Initializes the component by fetching analytics data for the current user
   * and preparing the datasets for pie, bar, and line charts.
   */
  ngOnInit(): void {
    const username = this.authService.getCurrentUser() || '';
    this.analyticsService.getAnalytics(username).subscribe((data) => {
      // Pie chart
      this.pieChartData = {
        labels: ['Correct', 'Incorrect'],
        datasets: [
          {
            data: [data.correctIncorrect.correct, data.correctIncorrect.incorrect],
            backgroundColor: ['#22c55e', '#ef4444'],
          },
        ],
      };

      // Bar chart
      this.barChartData = {
        labels: data.topTests.map((t) => t.name),
        datasets: [
          {
            label: 'Number of Takes',
            data: data.topTests.map((t) => t.taken),
            backgroundColor: '#3b82f6',
          },
        ],
      };

      // Line chart
      this.lineChartData = {
        labels: data.activity.map((a) => a.month),
        datasets: [
          {
            data: data.activity.map((a) => a.count),
            label: 'Tests Taken Over Time',
            fill: true,
            tension: 0.3,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
          },
        ],
      };
    });
  }

  /**
   * Navigates to the next chart in the list.
   */
  nextChart(): void {
    this.currentChartIndex = (this.currentChartIndex + 1) % this.chartTitles.length;
  }

  /**
   * Navigates to the previous chart in the list.
   */
  prevChart(): void {
    this.currentChartIndex =
      (this.currentChartIndex - 1 + this.chartTitles.length) % this.chartTitles.length;
  }
}
