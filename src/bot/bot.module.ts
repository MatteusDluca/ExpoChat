import { Module } from '@nestjs/common';
import { BotConfigModule } from '../bot-config/bot-config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  imports: [PrismaModule, BotConfigModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
