import { IsUUID, IsString, IsOptional } from 'class-validator';

export class ProcessPaymentDto {
  @IsUUID('4', { message: 'Invalid order ID format' })
  orderId: string;

  @IsString()
  razorpayOrderId: string;

  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpaySignature: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;
}
