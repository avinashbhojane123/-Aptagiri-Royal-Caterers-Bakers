export declare class CreateOrderItemDto {
    cakeId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    orderItems: CreateOrderItemDto[];
    deliveryAddress: string;
}
