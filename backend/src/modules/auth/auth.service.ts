import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { EmailService } from './email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private whatsappService: WhatsappService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersService.create(
      registerDto.email,
      hash,
      registerDto.name,
      UserRole.CUSTOMER,
      registerDto.phoneNumber,
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUserById(id: string): Promise<User | null> {
    return this.usersService.findOneById(id);
  }

  async forgotPassword(emailOrPhone: string, method: 'whatsapp' | 'email'): Promise<any> {
    let user = await this.usersService.findOneByEmail(emailOrPhone);
    if (!user) {
      user = await this.usersService.findOneByPhoneNumber(emailOrPhone);
    }

    if (!user) {
      throw new NotFoundException('No user found with the provided email or mobile number.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15); // Valid for 15 minutes

    await this.usersService.setResetOtp(user.id, otp, expiry);

    this.logger.log(`[DEVELOPMENT BYPASS] Password Reset OTP for user "${user.email}" is: ${otp}`);

    if (method === 'email') {
      const subject = 'APTAGIRI ROYAL Caterers & Events Password Reset Verification OTP';
      const text = `Hello ${user.name},\n\nYou requested to reset your password. Your verification OTP code is:\n\n${otp}\n\nThis OTP is valid for 15 minutes. If you did not request this, please ignore this email.`;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #8b5e3c; border-bottom: 2px solid #8b5e3c; padding-bottom: 10px;">APTAGIRI ROYAL Caterers & Events Password Reset</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested to reset your password. Your 6-digit verification OTP code is:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; background-color: #fcf8f2; color: #8b5e3c; border: 1px dashed #8b5e3c; border-radius: 8px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="color: #666; font-size: 13px;">This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `;
      const sent = await this.emailService.sendMail(user.email, subject, text, html);
      if (!sent) {
        throw new BadRequestException('Failed to send OTP email. Please ensure email configurations are valid or try WhatsApp.');
      }
      return { success: true, method: 'email', sentTo: user.email };
    } else {
      if (!user.phoneNumber) {
        throw new BadRequestException('No WhatsApp phone number is associated with this account. Please use Email verification.');
      }
      const message = `🔐 *APTAGIRI ROYAL Caterers & Events Security Code*\n\nHello ${user.name},\n\nYour password reset OTP is: *${otp}*.\n\nThis code is valid for 15 minutes. If you did not request this, please ignore this message.`;
      const sent = await this.whatsappService.sendMessage(user.phoneNumber, message);
      if (!sent) {
        throw new BadRequestException('Failed to send WhatsApp message. Please check connection status or try Email.');
      }
      return { success: true, method: 'whatsapp', sentTo: user.phoneNumber };
    }
  }

  async resetPassword(emailOrPhone: string, otp: string, newPassword: string): Promise<any> {
    let user = await this.usersService.findOneByEmail(emailOrPhone);
    if (!user) {
      user = await this.usersService.findOneByPhoneNumber(emailOrPhone);
    }

    if (!user) {
      throw new NotFoundException('No user found with the provided email or mobile number.');
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      throw new BadRequestException('Invalid password reset OTP.');
    }

    if (user.resetPasswordOtpExpires && new Date() > user.resetPasswordOtpExpires) {
      throw new BadRequestException('Password reset OTP has expired. Please request a new code.');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await this.usersService.resetPassword(user.id, hash);

    if (user.phoneNumber) {
      const msg = `🔐 *APTAGIRI ROYAL Caterers & Events Security Alert*\n\nYour password was successfully updated! If you did not request this change, please contact support immediately.`;
      await this.whatsappService.sendMessage(user.phoneNumber, msg);
    }
    
    const subject = 'APTAGIRI ROYAL Caterers & Events Password Changed Successfully';
    const text = `Hello ${user.name},\n\nYour password has been successfully reset. If you did not perform this change, please contact support immediately.`;
    await this.emailService.sendMail(user.email, subject, text);

    return { success: true };
  }
}
