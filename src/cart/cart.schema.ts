import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ required: true })
  productId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  length!: string;

  @Prop({ required: true })
  height!: string;

  @Prop({ required: true })
  width!: string;

  @Prop({ required: true })
  weight!: string;

  @Prop({ required: true })
  size!: string;

  @Prop({ required: true })
  color!: string;

  @Prop({ required: true, default: 1 })
  quantity!: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  // Nếu user chưa login, dùng sessionId
  @Prop()
  sessionId?: string;

  // Nếu user đã login
  @Prop()
  userId?: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items!: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
