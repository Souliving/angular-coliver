import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TuiIcon } from '@taiga-ui/core';

import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { ChatApiService } from '../../services/chat-api/chat-api.service';
import { Chat, Message, WsIncoming } from '../../data/chat.models';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, ChatListComponent, ChatWindowComponent, TuiIcon],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  messages: Message[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private wsService: WebSocketService,
    private chatApiService: ChatApiService
  ) {}

  ngOnInit(): void {
    this.loadChats();
    this.connectWebSocket();
    this.subscribeToMessages();
    this.handleQueryParams();
  }

  private handleQueryParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const chatId = params['chatId'];
        if (chatId) {
          this.openChatById(chatId);
        }
      });
  }

  private openChatById(chatId: string): void {
    // Если чаты уже загружены, найти и открыть
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      this.onChatSelect(chat);
    } else {
      // Если чаты ещё загружаются, подождать и повторить
      const checkInterval = setInterval(() => {
        if (!this.isLoading) {
          clearInterval(checkInterval);
          const foundChat = this.chats.find(c => c.id === chatId);
          if (foundChat) {
            this.onChatSelect(foundChat);
          }
        }
      }, 100);

      // Очистить интервал через 5 секунд если не найден
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }

  private loadChats(): void {
    this.chatApiService.getChats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (chats) => {
          this.chats = chats;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load chats:', err);
          this.isLoading = false;
        }
      });
  }

  private connectWebSocket(): void {
    this.wsService.connect();

    // Подписаться на статус подключения для отладки
    this.wsService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        console.log('WebSocket connection status:', status);
      });
  }

  private subscribeToMessages(): void {
    this.wsService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: WsIncoming) => {
        console.log('WebSocket message received:', msg);
        console.log(msg.type)
        if (msg.type === 'message') {
          this.handleNewMessage(msg.data);
        } else if (msg.type === 'read') {
          this.handleMessagesRead(msg.chatId, msg.messageIds);
        }
      });
  }

  private handleNewMessage(message: Message): void {
    const currentUserId = this.getCurrentUserId();
    const isMyMessage = message.senderId === currentUserId;

    console.log('handleNewMessage:', {
      messageId: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      currentUserId,
      isMyMessage,
      selectedChatId: this.selectedChat?.id,
      isSelectedChat: this.selectedChat?.id === message.chatId
    });
    console.log(this.selectedChat?.id)
    console.log(message.chatId)
    // Добавить/обновить сообщение в текущем чате если он открыт
    if (this.selectedChat?.id === message.chatId) {
      console.log('Adding message to selected chat');
      // Если это моё сообщение - заменить временное на настоящее
      if (isMyMessage) {
        const tempIndex = this.messages.findIndex(m =>
          m.id.startsWith('temp-') &&
          m.content === message.content &&
          Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000
        );

        if (tempIndex !== -1) {
          console.log('Replacing temp message at index', tempIndex);
          // Заменить временное сообщение на настоящее
          this.messages = [
            ...this.messages.slice(0, tempIndex),
            message,
            ...this.messages.slice(tempIndex + 1)
          ];
        } else {
          console.log('Temp message not found, adding as new');
          // Добавить если не нашли временное (на всякий случай)
          this.messages = [...this.messages, message];
        }
      } else {
        console.log('Adding message from other user');
        // Чужое сообщение - просто добавить
        this.messages = [...this.messages, message];

        // Автоматически отметить как прочитанное, так как чат открыт
        console.log('Marking message as read automatically');
        this.chatApiService.markAsRead(message.chatId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              console.log('Message marked as read via REST API');
              // Отправить через WebSocket для real-time обновления
              this.wsService.markAsRead(message.chatId);
            },
            error: (err) => {
              console.error('Failed to mark message as read:', err);
            }
          });
      }
    } else {
      console.log('Message is for different chat, not adding to current view');
    }

    // Обновить последнее сообщение и счётчик в списке чатов
    const chatIndex = this.chats.findIndex(c => c.id === message.chatId);
    if (chatIndex !== -1) {
      const chat = this.chats[chatIndex];
      const updatedChat = {
        ...chat,
        lastMessage: message,
        unreadCount: this.selectedChat?.id === message.chatId ? 0 : chat.unreadCount + 1,
        updatedAt: new Date(message.createdAt)
      };
      this.chats = [
        updatedChat,
        ...this.chats.slice(0, chatIndex),
        ...this.chats.slice(chatIndex + 1)
      ];
    }
  }

  private handleMessagesRead(chatId: string, messageIds: string[]): void {
    console.log('Messages marked as read:', { chatId, messageIds });

    // Обновить isRead для сообщений в текущем чате
    if (this.selectedChat?.id === chatId) {
      this.messages = this.messages.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
      );
    }

    // Обновить счётчик непрочитанных в списке чатов
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      const chat = this.chats[chatIndex];
      this.chats[chatIndex] = { ...chat, unreadCount: 0 };
    }
  }

  onChatSelect(chat: Chat): void {
    this.selectedChat = chat;
    this.loadMessages(chat.id);

    // Сбросить счётчик непрочитанных
    if (chat.unreadCount > 0) {
      // Отправить через REST API
      this.chatApiService.markAsRead(chat.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Messages marked as read successfully');
            // Отправить через WebSocket для real-time обновления
            this.wsService.markAsRead(chat.id);
          },
          error: (err) => {
            console.error('Failed to mark messages as read:', err);
          }
        });

      // Обновить локально сразу для лучшего UX
      const index = this.chats.findIndex(c => c.id === chat.id);
      if (index !== -1) {
        this.chats[index] = { ...chat, unreadCount: 0 };
      }
    }
  }

  private loadMessages(chatId: string): void {
    this.chatApiService.getMessages(chatId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.messages = messages;
        },
        error: (err) => {
          console.error('Failed to load messages:', err);
        }
      });
  }

  onSendMessage(content: string): void {
    if (!this.selectedChat || !content.trim()) return;

    // Оптимистичное обновление - добавляем сообщение локально сразу
    const tempMessage: Message = {
      id: 'temp-' + Date.now(), // Временный ID
      chatId: this.selectedChat.id,
      senderId: this.getCurrentUserId(),
      content: content,
      createdAt: new Date(),
      isRead: false
    };

    this.messages = [...this.messages, tempMessage];

    // Обновить lastMessage в списке чатов
    const chatIndex = this.chats.findIndex(c => c.id === this.selectedChat?.id);
    if (chatIndex !== -1) {
      const chat = this.chats[chatIndex];
      const updatedChat = {
        ...chat,
        lastMessage: tempMessage,
        updatedAt: new Date()
      };
      this.chats = [
        updatedChat,
        ...this.chats.slice(0, chatIndex),
        ...this.chats.slice(chatIndex + 1)
      ];
    }

    // Отправить через WebSocket
    this.wsService.sendMessage(this.selectedChat.id, content);
  }

  private getCurrentUserId(): number {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        return user?.jwt?.userId || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }
}
