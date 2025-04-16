export interface BotMessageDto {
  id?: string;
  conversationId: string;
  content: string;
  fromCustomer: boolean;
  mediaUrl?: string;
}

export interface BotMessageResponseDto {
  content: string;
  mediaUrl?: string;
}
