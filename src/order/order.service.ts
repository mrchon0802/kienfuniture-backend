import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  /**
   * 🧾 Tạo mới một đơn hàng (FE gửi toàn bộ items[])
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new this.orderModel({
      userId: createOrderDto.userId,
      items: createOrderDto.items,
      totalPrice: createOrderDto.totalPrice,
      status: 'pending',
    });

    return newOrder.save();
  }

  /**
   * 📦 Lấy tất cả đơn hàng (admin xem)
   */
  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * 👤 Lấy đơn hàng theo user
   */
  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  /**
   * 🔄 Cập nhật trạng thái đơn hàng (admin / user)
   */
  async updateStatus(orderId: string, status: string): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
  }

  /**
   * ❌ Xóa đơn hàng
   */
  async remove(orderId: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(orderId);
  }

  /**
   * ⚠️ Xóa tất cả đơn hàng (admin)
   */
  async clearAll(): Promise<void> {
    await this.orderModel.deleteMany({});
  }
}
