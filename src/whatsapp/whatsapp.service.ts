import { Injectable } from '@nestjs/common';
import { BotService } from '../bot/bot.service';
import { ChatService } from '../chat/chat.service';
import { CustomerService } from '../customer/customer.service';
import { MessageService } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import {
  connectToWhatsApp,
  getSession,
  removeSession,
} from './baileys.provider';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly botService: BotService,
  ) {}

  // Conecta o WhatsApp da empresa e escuta mensagens recebidas
  async connect(companyId: string): Promise<{ message: string }> {
    await connectToWhatsApp(companyId, ({ jid, message, fromMe }) => {
      this.handleIncomingMessage(companyId, jid, message, fromMe);
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
    if (fromMe) return; // Ignorar mensagens enviadas pelo próprio bot

    const phone = jid.replace('@s.whatsapp.net', '');
    const customer = await this.customerService.findOrCreate(phone, companyId);
    const chat = await this.chatService.createOrGetChat(customer.id, companyId);

    const senderName = customer.name ?? phone;

    // Salvar a mensagem recebida
    await this.messageService.sendDetailedMessage({
      chatId: chat.id,
      content: message,
      fromCustomer: true,
      senderName,
    });

    // Verificar se há um operador atendendo o chat
    const hasOperator = !!chat.userId;

    // Se não houver operador, processar com o bot
    if (!hasOperator) {
      try {
        // Processar a mensagem com o bot
        const botResponse = await this.botService.handleIncomingMessage(
          message,
          companyId,
          customer.id,
        );

        // Enviar a resposta do bot ao WhatsApp
        if (botResponse.content) {
          await this.sendMessage(companyId, jid, botResponse.content);

          // Se houver mídia, enviar também
          if (botResponse.mediaUrl) {
            // Aqui você pode implementar o envio de mídia
            // await session.sendMessage(jid, { image: { url: botResponse.mediaUrl }, caption: 'Imagem' });
          }
        }
      } catch (error) {
        console.error('Erro ao processar mensagem com o bot:', error);
      }
    }
  }
}
