import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCatererItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Item name is required' })
  itemName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.0, { message: 'Price cannot be negative' })
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
