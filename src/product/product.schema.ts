import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

/* ================= COLOR ================= */
@Schema({ _id: false })
export class ColorOption {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  productImage!: string;
}
export const ColorOptionSchema = SchemaFactory.createForClass(ColorOption);

/* ================= PRODUCT ================= */
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true, index: true })
  productId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ type: Number, default: null })
  discountPrice?: number | null;

  @Prop({ required: true })
  weight!: number;

  @Prop({ required: true })
  width!: number;

  @Prop({ required: true })
  length!: number;

  @Prop({ required: true })
  height!: number;

  @Prop({
    required: true,
    type: String,
    enum: ['bed', 'table', 'chair', 'cabinet', 'sofa', 'other'],
    index: true,
  })
  category!: string;

  @Prop({
    type: String,
    enum: ['hero', 'normal'],
    default: 'normal',
    index: true,
  })
  type!: 'hero' | 'normal';

  @Prop({
    type: [String],
    enum: ['living-room', 'bed-room', 'kitchen', 'home-office'],
    default: [],
    index: true,
  })
  room!: string[];

  @Prop({ type: [String], default: null })
  materials?: string[] | null;

  @Prop({ type: [ColorOptionSchema], default: [] })
  colors!: ColorOption[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

/* ================= INDEX ================= */
ProductSchema.index({ title: 'text' });
