export interface BotResponseDto {
  id?: string;
  botConfigId?: string;
  trigger: string;
  response: string;
  mediaUrl?: string;
  order?: number;
  isActive?: boolean;
}
