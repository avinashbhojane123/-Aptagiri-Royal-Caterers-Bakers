import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: UserRole;
        phoneNumber: string;
        resetPasswordOtp: string | null;
        resetPasswordOtpExpires: Date | null;
        orders: import("../orders/entities/order.entity").Order[];
        createdAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: UserRole;
        phoneNumber: string;
        resetPasswordOtp: string | null;
        resetPasswordOtpExpires: Date | null;
        orders: import("../orders/entities/order.entity").Order[];
        createdAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
