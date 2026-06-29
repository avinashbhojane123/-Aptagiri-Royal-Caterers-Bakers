import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'varchar', nullable: true })
  razorpayOrderId: string | null;

  @Column({ type: 'varchar', nullable: true })
  razorpayPaymentId: string | null;

  @Column({ type: 'varchar', nullable: true })
  razorpaySignature: string | null;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ default: 'mock' })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}
