import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../data/chat.models';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() message!: Message;
  @Input() isMine = false;

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
