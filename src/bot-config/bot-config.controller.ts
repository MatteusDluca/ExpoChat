import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { BotConfigService } from './bot-config.service';
import { CreateBotConfigDto } from './dto/create-bot-config.dto';

@Controller('bot-config')
@UseGuards(JwtAuthGuard)
export class BotConfigController {
  constructor(private readonly botConfigService: BotConfigService) {}

  @Post()
  async create(
    @CompanyId() companyId: string,
    @Body() createBotConfigDto: CreateBotConfigDto,
  ): Promise<any> {
    return this.botConfigService.create(companyId, createBotConfigDto);
  }

  @Get()
  async findByCompanyId(@CompanyId() companyId: string): Promise<any> {
    return this.botConfigService.findByCompanyId(companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBotConfigDto: Partial<CreateBotConfigDto>,
  ): Promise<any> {
    return this.botConfigService.update(id, updateBotConfigDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.botConfigService.delete(id);
  }
}
