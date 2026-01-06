import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserApiService } from '../user-api/user-api.service';
import { WsIncoming, WsOutgoing } from '../../data/chat.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket$: WebSocketSubject<WsIncoming | WsOutgoing> | null = null;
  private destroy$ = new Subject<void>();
  private messagesSubject = new Subject<WsIncoming>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  messages$ = this.messagesSubject.asObservable();
  connectionStatus$ = new BehaviorSubject<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');

  constructor(private userApiService: UserApiService) {}

  connect(): void {
    if (this.socket$) {
      return;
    }

    const token = this.userApiService.getToken();
    if (!token) {
      console.error('No auth token available');
      this.connectionStatus$.next('error');
      return;
    }

    this.connectionStatus$.next('connecting');

    this.socket$ = webSocket<WsIncoming | WsOutgoing>({
      url: `${environment.wsUrl}?token=${token}`,
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.connectionStatus$.next('connected');
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket disconnected');
          this.connectionStatus$.next('disconnected');
          this.socket$ = null;
          this.tryReconnect();
        }
      }
    });

    this.socket$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (msg) => {
          console.log('WebSocket raw message:', msg);
          this.messagesSubject.next(msg as WsIncoming);
        },
        error: (err) => {
          console.error('WebSocket error:', err);
          this.connectionStatus$.next('error');
          this.socket$ = null;
          this.tryReconnect();
        }
      });
  }

  private tryReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    timer(delay)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.connect());
  }

  send(message: WsOutgoing): void {
    if (this.socket$ && this.connectionStatus$.value === 'connected') {
      console.log('Sending WebSocket message:', message);
      console.log('Type message', message.type)
      this.socket$.next(message);
    } else {
      console.warn('WebSocket not connected, message not sent. Status:', this.connectionStatus$.value);
    }
  }

  sendMessage(chatId: string, content: string): void {
    this.send({ type: 'send', chatId, content });
  }

  sendTyping(chatId: string, isTyping: boolean): void {
    this.send({ type: 'typing', chatId, isTyping });
  }

  markAsRead(chatId: string): void {
    this.send({ type: 'read', chatId });
  }

  disconnect(): void {
    this.socket$?.complete();
    this.socket$ = null;
    this.connectionStatus$.next('disconnected');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
