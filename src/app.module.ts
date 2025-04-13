import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
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
  ],
})
export class AppModule {}
