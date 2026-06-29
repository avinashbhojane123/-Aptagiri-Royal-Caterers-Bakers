import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity';

export enum CakeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

@Entity('cakes')
export class Cake {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column()
  imageUrl: string;

  @Column()
  flavor: string;

  @Column({
    type: 'enum',
    enum: CakeSize,
    default: CakeSize.MEDIUM,
  })
  size: CakeSize;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.cake)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}
