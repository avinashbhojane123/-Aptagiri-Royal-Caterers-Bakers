import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { emailOrPhone: string; method: 'whatsapp' | 'email' },
  ) {
    return this.authService.forgotPassword(body.emailOrPhone, body.method);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { emailOrPhone: string; otp: string; newPassword?: string },
  ) {
    return this.authService.resetPassword(
      body.emailOrPhone,
      body.otp,
      body.newPassword || '',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
