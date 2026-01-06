import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, Message, CreateChatDto, SendMessageDto } from '../../data/chat.models';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/chat`;

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  constructor(private http: HttpClient) {}

  // Получить список всех чатов пользователя
  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${API_URL}`);
  }

  // Получить или создать чат с пользователем
  getOrCreateChat(participantId: number): Observable<Chat> {
    return this.http.post<Chat>(`${API_URL}`, { participantId } as CreateChatDto);
  }

  // Получить сообщения чата с пагинацией
  getMessages(chatId: string, page: number = 0, size: number = 50): Observable<Message[]> {
    return this.http.get<Message[]>(`${API_URL}/${chatId}/messages`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  // Отправить сообщение (fallback если WebSocket недоступен)
  sendMessage(dto: SendMessageDto): Observable<Message> {
    return this.http.post<Message>(`${API_URL}/${dto.chatId}/messages`, { content: dto.content });
  }

  // Пометить сообщения как прочитанные
  markAsRead(chatId: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/${chatId}/read`, {});
  }

  // Получить количество непрочитанных сообщений
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${API_URL}/unread`);
  }
}
