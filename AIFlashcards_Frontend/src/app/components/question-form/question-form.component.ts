import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/models';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
})
/**
 * QuestionFormComponent
 *
 * Represents a single question form item with text and answer fields.
 * Emits updates when the question is modified and supports removal
 * if not disabled.
 */
export class QuestionFormComponent {
  // -------------------------
  // Variables
  // -------------------------
  @Input() index!: number;
  @Input() question: Question = { text: '', answer: '' };
  @Input() disableRemove = false;
  @Output() questionChange = new EventEmitter<Question>();
  @Output() removeQuestion = new EventEmitter<void>();

  /**
   * Emits the updated question whenever the form fields change.
   */
  update(): void {
    this.questionChange.emit(this.question);
  }

  /**
   * Emits the remove event if removal is not disabled.
   */
  onRemove(): void {
    if (!this.disableRemove) {
      this.removeQuestion.emit();
    }
  }
}
