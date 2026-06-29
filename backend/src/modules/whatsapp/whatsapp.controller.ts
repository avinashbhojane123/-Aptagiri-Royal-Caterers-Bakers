import { Controller, Get, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('status')
  async getStatus() {
    try {
      return await this.whatsappService.getStatus();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('test')
  async sendTestMessage(@Body() body: { to: string; message: string }) {
    if (!body.to || !body.message) {
      throw new HttpException('Recipient and message content are required', HttpStatus.BAD_REQUEST);
    }
    const success = await this.whatsappService.sendMessage(body.to, body.message);
    if (!success) {
      throw new HttpException('Failed to send WhatsApp message. Check connection status.', HttpStatus.BAD_REQUEST);
    }
    return { success: true };
  }

  @Post('restart')
  async restartSession() {
    try {
      const result = await this.whatsappService.restartSession();
      return { success: true, session: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
