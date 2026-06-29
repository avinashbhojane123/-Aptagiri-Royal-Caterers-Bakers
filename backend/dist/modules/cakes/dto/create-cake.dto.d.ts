import { CakeSize } from '../entities/cake.entity';
export declare class CreateCakeDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    flavor: string;
    size: CakeSize;
}
