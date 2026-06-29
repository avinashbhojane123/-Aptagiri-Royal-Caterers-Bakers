import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    forgotPassword(body: {
        emailOrPhone: string;
        method: 'whatsapp' | 'email';
    }): Promise<any>;
    resetPassword(body: {
        emailOrPhone: string;
        otp: string;
        newPassword?: string;
    }): Promise<any>;
    getProfile(req: any): any;
}
