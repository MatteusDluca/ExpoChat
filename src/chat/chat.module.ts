import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChatService, PrismaService],
  exports: [ChatService],
})
export class ChatModule {}
