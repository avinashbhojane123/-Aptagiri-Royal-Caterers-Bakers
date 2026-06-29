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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async onModuleInit() {
        const adminExists = await this.usersRepository.findOne({
            where: { role: user_entity_1.UserRole.ADMIN },
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
                role: user_entity_1.UserRole.ADMIN,
            });
            await this.usersRepository.save(admin);
            console.log(`Default administrator seeded successfully: ${adminEmail}`);
        }
    }
    async create(email, passwordHash, name, role = user_entity_1.UserRole.CUSTOMER, phoneNumber) {
        const existing = await this.findOneByEmail(email);
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
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
    async findOneByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findOneByPhoneNumber(phone) {
        const digits = phone.replace(/\D/g, '');
        if (!digits)
            return null;
        const users = await this.usersRepository.find();
        return users.find(user => {
            if (!user.phoneNumber)
                return false;
            const dbDigits = user.phoneNumber.replace(/\D/g, '');
            return dbDigits === digits || (dbDigits.length >= 10 && digits.length >= 10 && dbDigits.endsWith(digits.slice(-10)));
        }) || null;
    }
    async findOneById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async findAll() {
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
    async update(id, updateData) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateData.email && updateData.email !== user.email) {
            const existing = await this.findOneByEmail(updateData.email);
            if (existing) {
                throw new common_1.ConflictException('Email already registered');
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
    async remove(id) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.usersRepository.remove(user);
    }
    async setResetOtp(id, otp, expires) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = expires;
        return this.usersRepository.save(user);
    }
    async resetPassword(id, passwordHash) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        user.passwordHash = passwordHash;
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpires = null;
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map