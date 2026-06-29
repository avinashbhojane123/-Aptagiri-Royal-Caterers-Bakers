import { Order } from '../../orders/entities/order.entity';
export declare enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    phoneNumber: string;
    resetPasswordOtp: string | null;
    resetPasswordOtpExpires: Date | null;
    orders: Order[];
    createdAt: Date;
}
