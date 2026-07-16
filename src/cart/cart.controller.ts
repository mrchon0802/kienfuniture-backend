import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveItemDto } from './dto/remove-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** 🛒 Lấy giỏ hàng của user */
  @Get(':userId')
  async getUserCart(@Param('userId') userId: string) {
    const cart = await this.cartService.getCart(userId);

    if (!cart) {
      return {
        userId,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };
    }

    const totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    return {
      userId,
      items: cart.items,
      totalQuantity,
      totalPrice,
    };
  }

  /** ➕ Thêm sản phẩm vào giỏ */
  @Post()
  async addToCart(@Body() dto: AddToCartDto) {
    const cart = await this.cartService.addToCart(dto);

    const totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    return {
      userId: dto.userId,
      items: cart.items,
      totalQuantity,
      totalPrice,
    };
  }

  /** ✏️ Cập nhật số lượng sản phẩm */
  @Patch(':userId')
  async updateItem(
    @Param('userId') userId: string,
    @Body()
    body: {
      productId: string;
      size: string;
      color: string;
      quantity: number;
    },
  ) {
    const cart = await this.cartService.updateItem(
      userId,
      body.productId,
      body.size,
      body.color,
      body.quantity,
    );

    if (!cart) {
      return {
        userId,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };
    }

    const totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    return {
      userId,
      items: cart.items,
      totalQuantity,
      totalPrice,
    };
  }

  /** ❌ Xóa 1 sản phẩm khỏi giỏ */
  @Delete('item')
  async removeItem(@Body() dto: RemoveItemDto) {
    const cart = await this.cartService.removeItem(
      dto.userId,
      dto.productId,
      dto.size,
      dto.color,
    );

    return (
      cart || {
        userId: dto.userId,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      }
    );
  }

  /** 🗑️ Xóa toàn bộ giỏ hàng user */
  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    await this.cartService.clearCart(userId);
    return {
      userId,
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    };
  }
}
