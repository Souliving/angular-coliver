import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiTextareaModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TuiIcon, TuiTextareaModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() send = new EventEmitter<string>();

  messageText = '';

  onSubmit(): void {
    const text = this.messageText.trim();
    if (text) {
      this.send.emit(text);
      this.messageText = '';
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }
}
