import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-runner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-runner.component.html',
  styleUrls: ['./question-runner.component.scss'],
})
/**
 * QuestionRunnerComponent
 *
 * Displays a single question with the ability to reveal the answer
 * and record whether the user answered correctly or incorrectly.
 * Also shows progress information (current index and total questions).
 */
export class QuestionRunnerComponent {
  // -------------------------
  // Variables
  // -------------------------
  @Input() question!: Question;
  @Input() title = '';
  @Input() currentIndex = 0;
  @Input() totalQuestions = 0;
  @Output() answered = new EventEmitter<boolean>();
  showAnswer = false;

  /**
   * Reveals the answer to the current question.
   */
  revealAnswer(): void {
    this.showAnswer = true;
  }

  /**
   * Emits the user's answer result and hides the answer again.
   * @param correct - Whether the user's answer was correct.
   */
  answer(correct: boolean): void {
    this.answered.emit(correct);
    this.showAnswer = false;
  }
}
