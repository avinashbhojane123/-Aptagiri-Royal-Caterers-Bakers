import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    WhatsappModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          if (process.env.NODE_ENV === 'production') {
            throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
          }
          console.warn(
            'WARNING: JWT_SECRET is not defined. Falling back to temporary development key.',
          );
        }
        return {
          secret:
            secret ||
            'dev_fallback_jwt_secret_key_change_me_in_production_12345!',
          signOptions: {
            expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
              '1d') as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
