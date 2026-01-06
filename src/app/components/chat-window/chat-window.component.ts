import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiScrollbar } from '@taiga-ui/core';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { Chat, Message } from '../../data/chat.models';
import { UserApiService } from '../../services/user-api/user-api.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, TuiAvatar, TuiScrollbar, ChatMessageComponent, ChatInputComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() chat!: Chat;
  @Input() set messages(value: Message[]) {
    const oldLength = this._messages.length;
    this._messages = value;

    // Автоматически скроллить при новых сообщениях
    if (value.length > oldLength) {
      this.shouldScrollToBottom = true;
    }
  }
  get messages(): Message[] {
    return this._messages;
  }
  private _messages: Message[] = [];

  @Output() sendMessage = new EventEmitter<string>();

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private shouldScrollToBottom = true;
  private currentUserId: number | null = null;

  constructor(private userApiService: UserApiService) {
    const user = this.userApiService.getAuthUserValue();
    this.currentUserId = user?.jwt?.userId ?? null;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {}
  }

  onSend(content: string): void {
    this.shouldScrollToBottom = true;
    this.sendMessage.emit(content);
  }

  isMine(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }
}
