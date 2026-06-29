import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    user: User;
    totalPrice: number;
    status: OrderStatus;
    deliveryAddress: string;
    orderConfirmationOtp: string | null;
    deliveryConfirmationOtp: string | null;
    isConfirmed: boolean;
    orderItems: OrderItem[];
    payment: Payment;
    createdAt: Date;
}
