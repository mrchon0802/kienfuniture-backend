import { IsString } from 'class-validator';

export class RemoveItemDto {
  @IsString()
  userId!: string;

  @IsString()
  productId!: string;

  @IsString()
  size!: string;

  @IsString()
  color!: string;
}
