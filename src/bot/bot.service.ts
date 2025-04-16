import { Injectable } from '@nestjs/common';
import { BotConfigService } from '../bot-config/bot-config.service';
import { PrismaService } from '../prisma/prisma.service';
import {
    BotConfigDto,
    BotConversationDto,
    BotMessageDto,
    BotMessageResponseDto,
    BotResponseDto,
} from './dto';

@Injectable()
export class BotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly botConfigService: BotConfigService,
  ) {}

  async handleIncomingMessage(
    message: string,
    companyId: string,
    customerId: string,
  ): Promise<BotMessageResponseDto> {
    // Buscar configuração do bot para a empresa
    const botConfig = (await this.botConfigService.findByCompanyId(
      companyId,
    )) as BotConfigDto;
    if (!botConfig) {
      throw new Error('Bot não configurado para esta empresa');
    }

    // Buscar ou criar uma conversa
    const conversation = await this.getOrCreateConversation(
      customerId,
      companyId,
    );

    // Salvar a mensagem do cliente
    if (conversation.id) {
      await this.saveMessage(conversation.id, message, true);
    }

    // Encontrar a resposta apropriada
    let botResponse = this.findBestResponse(message, botConfig.responses || []);

    // Se nenhuma resposta específica for encontrada, usar mensagem de boas-vindas
    if (!botResponse) {
      botResponse = {
        trigger: '',
        response: botConfig.welcomeMessage || 'Olá! Como posso ajudar?',
      };
    }

    // Salvar a resposta do bot
    if (conversation.id) {
      await this.saveMessage(
        conversation.id,
        botResponse.response,
        false,
        botResponse.mediaUrl,
      );
    }

    return {
      content: botResponse.response,
      mediaUrl: botResponse.mediaUrl,
    };
  }

  private async getOrCreateConversation(
    customerId: string,
    companyId: string,
  ): Promise<BotConversationDto> {
    const conversation = await this.prisma
      .$queryRawUnsafe<
        BotConversationDto[]
      >(`SELECT * FROM "bot_conversations" WHERE "customerId" = $1 AND "companyId" = $2 LIMIT 1`, customerId, companyId)
      .then((results) => results[0]);

    if (!conversation) {
      return this.prisma
        .$queryRawUnsafe<BotConversationDto[]>(
          `INSERT INTO "bot_conversations" ("customerId", "companyId", "createdAt", "updatedAt") 
         VALUES ($1, $2, NOW(), NOW()) 
         RETURNING *`,
          customerId,
          companyId,
        )
        .then((results) => results[0]);
    }

    return conversation;
  }

  private async saveMessage(
    conversationId: string,
    content: string,
    fromCustomer: boolean,
    mediaUrl?: string,
  ): Promise<BotMessageDto> {
    const result = await this.prisma.$queryRawUnsafe<BotMessageDto[]>(
      `INSERT INTO "bot_messages" ("conversationId", "content", "fromCustomer", "mediaUrl", "createdAt") 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      conversationId,
      content,
      fromCustomer,
      mediaUrl || null,
    );

    return result[0];
  }

  private findBestResponse(
    message: string,
    responses: BotResponseDto[],
  ): BotResponseDto | null {
    // Converter mensagem para minúsculas para comparação
    const normalizedMessage = message.toLowerCase();

    // Encontrar a primeira resposta que corresponda à mensagem
    return (
      responses.find((response) =>
        normalizedMessage.includes(response.trigger.toLowerCase()),
      ) || null
    );
  }

  async getConversationHistory(
    conversationId: string,
  ): Promise<BotMessageDto[]> {
    // Use o método genérico do Prisma para buscar as mensagens
    const messages = await this.prisma.$queryRawUnsafe<BotMessageDto[]>(
      `SELECT * FROM "bot_messages" WHERE "conversationId" = $1 ORDER BY "createdAt" ASC`,
      conversationId,
    );

    return messages;
  }
}
