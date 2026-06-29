import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { EmailService } from './email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private whatsappService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, whatsappService: WhatsappService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    validateUserById(id: string): Promise<User | null>;
    forgotPassword(emailOrPhone: string, method: 'whatsapp' | 'email'): Promise<any>;
    resetPassword(emailOrPhone: string, otp: string, newPassword: string): Promise<any>;
}
