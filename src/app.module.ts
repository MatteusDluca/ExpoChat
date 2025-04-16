import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BotConfigModule } from './bot-config/bot-config.module';
import { BotModule } from './bot/bot.module';
import { ChatModule } from './chat/chat.module';
import { CompanyModule } from './company/company.module';
import { CustomerModule } from './customer/customer.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    CompanyModule,
    AuthModule,
    PrismaModule,
    UserModule,
    CustomerModule,
    ChatModule,
    MessageModule,
    WhatsappModule,
    BotModule,
    BotConfigModule,
  ],
})
export class AppModule {}
