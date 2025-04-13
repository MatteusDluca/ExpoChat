import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WASocket } from '@whiskeysockets/baileys';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
  constructor(private readonly service: WhatsappService) {}

  // Inicia sessão da empresa
  @Post(':companyId/connect')
  async connect(@Param('companyId') companyId: string) {
    await this.service.connect(companyId);
    return { message: 'Conexão estabelecida com sucesso' };
  }

  // Verifica status da sessão
  @Get(':companyId/status')
  getStatus(@Param('companyId') companyId: string) {
    return { connected: this.service.isConnected(companyId) };
  }

  // Desconecta a sessão manualmente
  @Delete(':companyId/disconnect')
  disconnect(@Param('companyId') companyId: string) {
    this.service.disconnect(companyId);
    return { message: 'Disconnected successfully' };
  }

  // Envia mensagem de teste
  @Post(':companyId/send')
  sendMessage(
    @Param('companyId') companyId: string,
    @Body() body: { jid: string; message: string },
  ) {
    return this.service.sendMessage(companyId, body.jid, body.message);
  }
}
