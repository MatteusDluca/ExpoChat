import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  private messageSubject = new Subject<any>();

  constructor(private prisma: PrismaService) {}

  async createOrGetChat(customerId: string, companyId: string) {
    const existing = await this.prisma.chat.findFirst({
      where: {
        customerId,
        companyId,
        status: 'ACTIVE',
      },
    });
    if (existing) return existing;

    return this.prisma.chat.create({
      data: {
        customerId,
        companyId,
        status: 'ACTIVE',
      },
    });
  }

  async closeChat(chatId: string) {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { status: 'CLOSED' },
    });
  }

  // Método para obter conversas de um atendente
  getConversationsByUser(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      include: { messages: true },
    });
  }

  // Método para enviar uma nova mensagem
  async sendMessage(conversationId: string, content: string, senderId: string) {
    const message = await this.prisma.message.create({
      data: {
        content,
        chat: { connect: { id: conversationId } },
        fromCustomer: false,
        senderName: senderId,
      },
    });
    this.messageSubject.next(message);
    return message;
  }

  // Método para se inscrever em notificações de novas mensagens
  onNewMessage() {
    return this.messageSubject.asObservable();
  }
}
