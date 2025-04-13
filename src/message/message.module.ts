import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  providers: [MessageService, PrismaService, CustomerService, ChatService],
  controllers: [MessageController],
})
export class MessageModule {}
