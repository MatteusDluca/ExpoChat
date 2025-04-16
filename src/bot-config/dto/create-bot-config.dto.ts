import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateBotResponseDto {
  @IsString()
  trigger: string;

  @IsString()
  response: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @IsOptional()
  order?: number;
}

export class CreateBotConfigDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  welcomeMessage: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBotResponseDto)
  responses: CreateBotResponseDto[];
}
