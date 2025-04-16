import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { BotService } from './bot.service';

@Controller('bot')
@UseGuards(JwtAuthGuard)
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('message')
  async handleMessage(
    @Body('message') message: string,
    @Body('customerId') customerId: string,
    @CompanyId() companyId: string,
  ) {
    return this.botService.handleIncomingMessage(
      message,
      companyId,
      customerId,
    );
  }

  @Get('conversation/:id')
  async getConversationHistory(@Param('id') conversationId: string) {
    return this.botService.getConversationHistory(conversationId);
  }
}
