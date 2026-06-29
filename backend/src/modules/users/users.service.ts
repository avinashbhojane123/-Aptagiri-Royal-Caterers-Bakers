import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (!adminExists) {
      console.log('No administrator found in the database. Seeding default administrator...');
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@sweetslices.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      const admin = this.usersRepository.create({
        email: adminEmail,
        passwordHash,
        name: 'APTAGIRI ROYAL Caterers & Events Admin',
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(admin);
      console.log(`Default administrator seeded successfully: ${adminEmail}`);
    }
  }

  async create(
    email: string,
    passwordHash: string,
    name: string,
    role: UserRole = UserRole.CUSTOMER,
    phoneNumber?: string,
  ): Promise<User> {
    const existing = await this.findOneByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = this.usersRepository.create({
      email,
      passwordHash,
      name,
      role,
      phoneNumber,
    });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByPhoneNumber(phone: string): Promise<User | null> {
    const digits = phone.replace(/\D/g, '');
    if (!digits) return null;
    
    const users = await this.usersRepository.find();
    return users.find(user => {
      if (!user.phoneNumber) return false;
      const dbDigits = user.phoneNumber.replace(/\D/g, '');
      return dbDigits === digits || (dbDigits.length >= 10 && digits.length >= 10 && dbDigits.endsWith(digits.slice(-10)));
    }) || null;
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
  }

  async update(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      role?: UserRole;
      password?: string;
      phoneNumber?: string;
    },
  ): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateData.email && updateData.email !== user.email) {
      const existing = await this.findOneByEmail(updateData.email);
      if (existing) {
        throw new ConflictException('Email already registered');
      }
      user.email = updateData.email;
    }

    if (updateData.name) {
      user.name = updateData.name;
    }

    if (updateData.role) {
      user.role = updateData.role;
    }

    if (updateData.phoneNumber !== undefined) {
      user.phoneNumber = updateData.phoneNumber;
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(updateData.password, salt);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersRepository.remove(user);
  }

  async setResetOtp(id: string, otp: string, expires: Date): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = expires;
    return this.usersRepository.save(user);
  }

  async resetPassword(id: string, passwordHash: string): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.passwordHash = passwordHash;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    return this.usersRepository.save(user);
  }
}
