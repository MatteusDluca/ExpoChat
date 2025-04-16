import { BotConfig, BotResponse } from '@prisma/client';

export type BotConfigWithResponses = BotConfig & {
  responses: BotResponse[];
};
