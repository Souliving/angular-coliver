export interface Chat {
  id: string;
  participantId: number;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: number;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

// WebSocket исходящие сообщения
export type WsOutgoing =
  | { type: 'send'; chatId: string; content: string }
  | { type: 'typing'; chatId: string; isTyping: boolean }
  | { type: 'read'; chatId: string };

// WebSocket входящие сообщения
export type WsIncoming =
  | { type: 'message'; data: Message }
  | { type: 'typing'; chatId: string; userId: number; isTyping: boolean }
  | { type: 'read'; chatId: string; messageIds: string[] }
  | { type: 'error'; message: string };

// DTO для создания чата
export interface CreateChatDto {
  participantId: number;
}

// DTO для отправки сообщения через REST (fallback)
export interface SendMessageDto {
  chatId: string;
  content: string;
}
