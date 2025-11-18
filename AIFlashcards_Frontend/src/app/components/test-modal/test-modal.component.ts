import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-test-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-modal.component.html',
  styleUrl: './test-modal.component.scss',
})
/**
 * TestModalComponent
 *
 * Displays a modal listing available tests for selection.
 * Allows the user to close the modal or select a test,
 * emitting the corresponding events to the parent component.
 */
export class TestModalComponent {
  // -------------------------
  // Variables
  // -------------------------
  @Input() title: string = 'Available Tests';
  @Input() tests: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectTest = new EventEmitter<string>();

  /**
   * Emits the close event to hide the modal.
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Emits the selected test when the user clicks on one.
   * @param test - The name of the selected test.
   */
  onSelect(test: string): void {
    this.selectTest.emit(test);
  }
}
