// src/order/order.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 🧾 Tạo đơn hàng mới
   * Body: { userId, items[], totalPrice }
   */
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  /**
   * 📦 Lấy toàn bộ đơn hàng (admin)
   */
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  /**
   * 👤 Lấy danh sách đơn hàng của 1 user
   */
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.orderService.findByUser(userId);
  }

  /**
   * 🔄 Cập nhật trạng thái đơn hàng
   * Body: { status: "paid" | "shipped" | "completed" | "cancelled" }
   */
  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return this.orderService.updateStatus(orderId, status);
  }

  /**
   * ❌ Xóa 1 đơn hàng
   */
  @Delete(':orderId')
  async remove(@Param('orderId') orderId: string) {
    return this.orderService.remove(orderId);
  }

  /**
   * ⚠️ Xóa toàn bộ đơn hàng (admin)
   */
  @Delete()
  async clearAll() {
    return this.orderService.clearAll();
  }
}
