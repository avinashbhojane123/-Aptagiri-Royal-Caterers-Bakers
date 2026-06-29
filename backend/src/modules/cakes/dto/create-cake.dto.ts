import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { CakeSize } from '../entities/cake.entity';

export class CreateCakeDto {
  @IsString()
  @IsNotEmpty({ message: 'Cake name cannot be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  price: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'Image URL is required' })
  imageUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Flavor is required' })
  flavor: string;

  @IsEnum(CakeSize, { message: 'Size must be small, medium, or large' })
  size: CakeSize;
}
