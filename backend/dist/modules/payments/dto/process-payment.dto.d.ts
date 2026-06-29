export declare class ProcessPaymentDto {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: string;
    transactionId?: string;
}
