import { Injectable } from '@nestjs/common';
import {
  connectToWhatsApp,
  getSession,
  removeSession,
} from './baileys.provider';
import { WASocket } from '@whiskeysockets/baileys';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerService } from '../customer/customer.service';
import { ChatService } from '../chat/chat.service';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  // Conecta o WhatsApp da empresa e escuta mensagens recebidas
  async connect(companyId: string): Promise<{ message: string }> {
    await connectToWhatsApp(companyId, async ({ jid, message, fromMe }) => {
      await this.handleIncomingMessage(companyId, jid, message, fromMe);
    });

    return { message: 'Conexão estabelecida com sucesso' };
  }

  isConnected(companyId: string): boolean {
    return !!getSession(companyId);
  }

  async sendMessage(
    companyId: string,
    jid: string,
    content: string,
    userId?: string,
  ) {
    const session = getSession(companyId);
    if (!session) throw new Error('No active WhatsApp session');

    await session.sendMessage(jid, { text: content });

    // Armazenar a mensagem enviada no histórico
    const phone = jid.replace('@s.whatsapp.net', '');
    const customer = await this.customerService.findOrCreate(phone, companyId);
    const chat = await this.chatService.createOrGetChat(customer.id, companyId);

    let senderName = 'Sistema';
    if (userId) {
      const user = await this.userService.findById(userId);
      senderName = user?.name || 'Sistema';
    }

    await this.messageService.sendDetailedMessage({
      chatId: chat.id,
      content,
      fromCustomer: false,
      senderName,
    });
  }

  disconnect(companyId: string) {
    removeSession(companyId);
  }

  private async handleIncomingMessage(
    companyId: string,
    jid: string,
    message: string,
    fromMe: boolean,
  ) {
    const phone = jid.replace('@s.whatsapp.net', '');
    const customer = await this.customerService.findOrCreate(phone, companyId);
    const chat = await this.chatService.createOrGetChat(customer.id, companyId);

    const senderName = customer.name ?? phone;

    await this.messageService.sendDetailedMessage({
      chatId: chat.id,
      content: message,
      fromCustomer: true,
      senderName,
    });
  }
}
