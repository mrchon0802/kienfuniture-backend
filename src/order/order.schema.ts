// src/order/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ required: true })
  productId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  size!: string;

  @Prop({ required: true })
  color!: string;

  @Prop({ required: true, default: 1 })
  quantity!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId!: string; // nếu user đăng nhập

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ required: true })
  totalPrice!: number;

  @Prop({ default: 'pending' })
  status!: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
}

export const OrderSchema = SchemaFactory.createForClass(Order);
