import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BotConfigController } from './bot-config.controller';
import { BotConfigService } from './bot-config.service';

@Module({
  imports: [PrismaModule],
  controllers: [BotConfigController],
  providers: [BotConfigService],
  exports: [BotConfigService],
})
export class BotConfigModule {}
