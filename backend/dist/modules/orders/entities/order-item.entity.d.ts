import { Order } from './order.entity';
import { Cake } from '../../cakes/entities/cake.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    cake: Cake;
    quantity: number;
    pricePerUnit: number;
}
