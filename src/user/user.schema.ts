import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  backupPhoneNumber?: string;

  @Prop()
  address?: string;

  @Prop()
  fullAddress?: string;

  @Prop()
  toDistrictId?: string;

  @Prop()
  toWardCode?: string;

  @Prop({ default: 'user' })
  role!: string;

  /**
   * So sánh mật khẩu người dùng nhập với mật khẩu hash trong DB
   */
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

// tạo schema từ class
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Hash password tự động trước khi lưu vào DB
 */
UserSchema.pre<UserDocument>('save', async function (next) {
  // chỉ hash nếu password bị thay đổi hoặc mới tạo user
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // tạo salt ngẫu nhiên
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});
