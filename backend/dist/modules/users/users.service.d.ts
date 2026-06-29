import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
export declare class UsersService implements OnModuleInit {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    create(email: string, passwordHash: string, name: string, role?: UserRole, phoneNumber?: string): Promise<User>;
    findOneByEmail(email: string): Promise<User | null>;
    findOneByPhoneNumber(phone: string): Promise<User | null>;
    findOneById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, updateData: {
        name?: string;
        email?: string;
        role?: UserRole;
        password?: string;
        phoneNumber?: string;
    }): Promise<User>;
    remove(id: string): Promise<void>;
    setResetOtp(id: string, otp: string, expires: Date): Promise<User>;
    resetPassword(id: string, passwordHash: string): Promise<User>;
}
