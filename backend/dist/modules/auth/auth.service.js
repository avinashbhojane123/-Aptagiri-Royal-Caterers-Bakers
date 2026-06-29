"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const email_service_1 = require("./email.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    emailService;
    whatsappService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, emailService, whatsappService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.whatsappService = whatsappService;
    }
    async register(registerDto) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(registerDto.password, salt);
        const user = await this.usersService.create(registerDto.email, hash, registerDto.name, user_entity_1.UserRole.CUSTOMER, registerDto.phoneNumber);
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
    async login(loginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async validateUserById(id) {
        return this.usersService.findOneById(id);
    }
    async forgotPassword(emailOrPhone, method) {
        let user = await this.usersService.findOneByEmail(emailOrPhone);
        if (!user) {
            user = await this.usersService.findOneByPhoneNumber(emailOrPhone);
        }
        if (!user) {
            throw new common_1.NotFoundException('No user found with the provided email or mobile number.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 15);
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
                throw new common_1.BadRequestException('Failed to send OTP email. Please ensure email configurations are valid or try WhatsApp.');
            }
            return { success: true, method: 'email', sentTo: user.email };
        }
        else {
            if (!user.phoneNumber) {
                throw new common_1.BadRequestException('No WhatsApp phone number is associated with this account. Please use Email verification.');
            }
            const message = `🔐 *APTAGIRI ROYAL Caterers & Events Security Code*\n\nHello ${user.name},\n\nYour password reset OTP is: *${otp}*.\n\nThis code is valid for 15 minutes. If you did not request this, please ignore this message.`;
            const sent = await this.whatsappService.sendMessage(user.phoneNumber, message);
            if (!sent) {
                throw new common_1.BadRequestException('Failed to send WhatsApp message. Please check connection status or try Email.');
            }
            return { success: true, method: 'whatsapp', sentTo: user.phoneNumber };
        }
    }
    async resetPassword(emailOrPhone, otp, newPassword) {
        let user = await this.usersService.findOneByEmail(emailOrPhone);
        if (!user) {
            user = await this.usersService.findOneByPhoneNumber(emailOrPhone);
        }
        if (!user) {
            throw new common_1.NotFoundException('No user found with the provided email or mobile number.');
        }
        if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
            throw new common_1.BadRequestException('Invalid password reset OTP.');
        }
        if (user.resetPasswordOtpExpires && new Date() > user.resetPasswordOtpExpires) {
            throw new common_1.BadRequestException('Password reset OTP has expired. Please request a new code.');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        whatsapp_service_1.WhatsappService])
], AuthService);
//# sourceMappingURL=auth.service.js.map