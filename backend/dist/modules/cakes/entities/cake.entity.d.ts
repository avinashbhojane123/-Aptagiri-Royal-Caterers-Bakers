import { OrderItem } from '../../orders/entities/order-item.entity';
export declare enum CakeSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}
export declare class Cake {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    flavor: string;
    size: CakeSize;
    orderItems: OrderItem[];
    createdAt: Date;
}
