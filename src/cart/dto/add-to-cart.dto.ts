import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsString()
  image!: string;

  @IsNotEmpty()
  price!: number;

  @IsNotEmpty()
  length!: string;

  @IsNotEmpty()
  weight!: string;

  @IsNotEmpty()
  height!: string;

  @IsNotEmpty()
  width!: string;

  @IsString()
  size!: string;

  @IsString()
  color!: string;

  @IsNotEmpty()
  quantity!: number;
}

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];
}
