import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';

import { MessageService } from './message.service';
import { CustomerService } from '../customer/customer.service';
import { ChatService } from '../chat/chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
    private customerService: CustomerService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  @Post()
  async receiveMessage(
    @Body()
    body: { phone: string; content: string },
    @Request() req,
  ) {
    const user = req.user;
    const customer = await this.customerService.findOrCreate(
      body.phone,
      user.companyId,
    );
    const chat = await this.chatService.createOrGetChat(
      customer.id,
      user.companyId,
    );
    const message = await this.messageService.sendMessage(
      chat.id,
      body.content,
      true,
    );

    return { customer, chat, message };
  }
}
