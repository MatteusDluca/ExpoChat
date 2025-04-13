import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { ChatService } from 'src/chat/chat.service';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    PrismaService,
    CustomerService,
    ChatService,
    MessageService,
    UserService,
  ],
})
export class WhatsappModule {}
