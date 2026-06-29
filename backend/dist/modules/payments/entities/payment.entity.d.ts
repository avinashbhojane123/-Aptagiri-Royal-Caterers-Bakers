import { Order } from '../../orders/entities/order.entity';
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Payment {
    id: string;
    order: Order;
    transactionId: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    status: PaymentStatus;
    paymentMethod: string;
    createdAt: Date;
}
