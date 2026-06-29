import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CakeSize } from '../entities/cake.entity';

export class UpdateCakeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  flavor?: string;

  @IsEnum(CakeSize)
  @IsOptional()
  size?: CakeSize;
}
