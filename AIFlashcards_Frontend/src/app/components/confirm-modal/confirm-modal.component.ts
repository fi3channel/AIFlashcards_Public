import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
})
/**
 * ConfirmModalComponent
 *
 * A reusable modal dialog for confirming or cancelling actions.
 * Accepts a title and message via inputs, and emits events when
 * the user confirms or cancels.
 */
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() message = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /**
   * Emits the confirm event when the user accepts the action.
   */
  onConfirm(): void {
    this.confirm.emit();
  }

  /**
   * Emits the cancel event when the user declines the action.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
