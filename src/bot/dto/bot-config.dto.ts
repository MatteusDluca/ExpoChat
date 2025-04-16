import { BotResponseDto } from './bot-response.dto';

export interface BotConfigDto {
  id?: string;
  companyId: string;
  name: string;
  avatar?: string;
  welcomeMessage: string;
  responses?: BotResponseDto[];
}
