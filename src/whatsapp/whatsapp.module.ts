import { Module } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { CustomerService } from 'src/customer/customer.service';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { BotModule } from '../bot/bot.module';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

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
  imports: [BotModule],
})
export class WhatsappModule {}
