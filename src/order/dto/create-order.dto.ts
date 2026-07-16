// src/order/dto/create-order.dto.ts
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsString()
  image!: string;

  @IsNumber()
  price!: number;

  @IsString()
  size!: string;

  @IsString()
  color!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsNumber()
  totalPrice!: number;

  @IsOptional()
  @IsString()
  status?: string;
}
