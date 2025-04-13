import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
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
}
