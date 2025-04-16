import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotConfigDto } from './dto/create-bot-config.dto';

interface BotConfig {
  id: string;
  companyId: string;
  name: string;
  avatar: string | null;
  welcomeMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BotResponse {
  id: string;
  botConfigId: string;
  trigger: string;
  response: string;
  mediaUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BotConfigWithResponses extends BotConfig {
  responses: BotResponse[];
}

@Injectable()
export class BotConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    companyId: string,
    createBotConfigDto: CreateBotConfigDto,
  ): Promise<BotConfig> {
    const { responses, ...botConfigData } = createBotConfigDto;

    return this.prisma.$transaction(async (prismaClient) => {
      // Criar a configuração do bot através de SQL raw
      const botConfigResult = await prismaClient.$queryRawUnsafe<BotConfig[]>(
        `INSERT INTO "bot_configs" ("companyId", "name", "avatar", "welcomeMessage", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, NOW(), NOW()) 
         RETURNING *`,
        companyId,
        botConfigData.name,
        botConfigData.avatar || null,
        botConfigData.welcomeMessage,
      );

      const botConfig = Array.isArray(botConfigResult)
        ? botConfigResult[0]
        : botConfigResult;

      // Criar as respostas do bot
      if (responses && responses.length > 0) {
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          const order = response.order ?? i + 1;

          await prismaClient.$queryRawUnsafe(
            `INSERT INTO "bot_responses" (
              "botConfigId", "trigger", "response", "mediaUrl", "order", "isActive", "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            botConfig.id,
            response.trigger,
            response.response,
            response.mediaUrl || null,
            order,
            true,
          );
        }
      }

      return botConfig;
    });
  }

  async findByCompanyId(
    companyId: string,
  ): Promise<BotConfigWithResponses | null> {
    // Buscar a configuração do bot
    const botConfigResult = await this.prisma.$queryRawUnsafe<BotConfig[]>(
      `SELECT * FROM "bot_configs" WHERE "companyId" = $1 LIMIT 1`,
      companyId,
    );

    if (!botConfigResult || botConfigResult.length === 0) {
      return null;
    }

    const botConfig = botConfigResult[0];

    // Buscar as respostas do bot
    const responses = await this.prisma.$queryRawUnsafe<BotResponse[]>(
      `SELECT * FROM "bot_responses" WHERE "botConfigId" = $1 ORDER BY "order" ASC`,
      botConfig.id,
    );

    return {
      ...botConfig,
      responses,
    };
  }

  async update(
    id: string,
    updateData: Partial<CreateBotConfigDto>,
  ): Promise<BotConfig> {
    const { responses, ...botConfigData } = updateData;

    return this.prisma.$transaction(async (prismaClient) => {
      // Atualizar configuração do bot
      let updateQuery = `UPDATE "bot_configs" SET "updatedAt" = NOW()`;
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (botConfigData.name) {
        updateQuery += `, "name" = $${paramIndex}`;
        queryParams.push(botConfigData.name);
        paramIndex++;
      }

      if (botConfigData.avatar !== undefined) {
        updateQuery += `, "avatar" = $${paramIndex}`;
        queryParams.push(botConfigData.avatar || null);
        paramIndex++;
      }

      if (botConfigData.welcomeMessage) {
        updateQuery += `, "welcomeMessage" = $${paramIndex}`;
        queryParams.push(botConfigData.welcomeMessage);
        paramIndex++;
      }

      updateQuery += ` WHERE "id" = $${paramIndex} RETURNING *`;
      queryParams.push(id);

      const botConfigResult = await prismaClient.$queryRawUnsafe<BotConfig[]>(
        updateQuery,
        ...queryParams,
      );

      const botConfig = Array.isArray(botConfigResult)
        ? botConfigResult[0]
        : botConfigResult;

      // Se houver novas respostas, deletar as antigas e criar as novas
      if (responses) {
        await prismaClient.$queryRawUnsafe(
          `DELETE FROM "bot_responses" WHERE "botConfigId" = $1`,
          id,
        );

        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          const order = response.order ?? i + 1;

          await prismaClient.$queryRawUnsafe(
            `INSERT INTO "bot_responses" (
              "botConfigId", "trigger", "response", "mediaUrl", "order", "isActive", "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            id,
            response.trigger,
            response.response,
            response.mediaUrl || null,
            order,
            true,
          );
        }
      }

      return botConfig;
    });
  }

  async delete(id: string): Promise<BotConfig> {
    const result = await this.prisma.$queryRawUnsafe<BotConfig[]>(
      `DELETE FROM "bot_configs" WHERE "id" = $1 RETURNING *`,
      id,
    );

    return Array.isArray(result) ? result[0] : result;
  }
}
