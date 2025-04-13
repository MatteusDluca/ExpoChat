import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  // Método original (mantido se quiser uso rápido)
  async sendMessage(chatId: string, content: string, fromCustomer: boolean) {
    return this.prisma.message.create({
      data: {
        chatId,
        content,
        fromCustomer,
      },
    });
  }

  // Novo método com nome do remetente
  async sendDetailedMessage(input: {
    chatId: string;
    content: string;
    fromCustomer: boolean;
    senderName: string;
  }) {
    return this.prisma.message.create({
      data: {
        chatId: input.chatId,
        content: input.content,
        fromCustomer: input.fromCustomer,
        senderName: input.senderName,
      },
    });
  }

  async getMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: 'asc' },
    });
  }
}
