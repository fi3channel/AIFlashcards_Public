import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-modal.component.html',
})
/**
 * InfoModalComponent
 *
 * A simple reusable modal dialog for displaying information
 * with a title, message, and a single OK action.
 */
export class InfoModalComponent {
  // -------------------------
  // Variables
  // -------------------------
  @Input() visible = false;
  @Input() title = '';
  @Input() message = '';
  @Output() ok = new EventEmitter<void>();

  /**
   * Emits the OK event when the user acknowledges the modal.
   */
  onOk(): void {
    this.ok.emit();
  }
}
