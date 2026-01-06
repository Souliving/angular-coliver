import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAvatar, TuiBadgeNotification } from '@taiga-ui/kit';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { Chat } from '../../data/chat.models';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, TuiAvatar, TuiBadgeNotification, TuiIcon, TuiLoader],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  @Input() chats: Chat[] = [];
  @Input() selectedChatId: string | null = null;
  @Input() isLoading = false;

  @Output() chatSelect = new EventEmitter<Chat>();

  onChatClick(chat: Chat): void {
    this.chatSelect.emit(chat);
  }

  formatTime(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  truncateMessage(text: string | undefined, maxLength: number = 40): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
