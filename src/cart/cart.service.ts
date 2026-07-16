import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  /**
   * 🛒 Lấy giỏ hàng theo userId
   */
  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) return { userId, items: [], totalQuantity: 0, totalPrice: 0 };

    return this.formatCart(cart);
  }

  /**
   * ➕ Thêm sản phẩm vào giỏ hàng
   */
  async addToCart(dto: AddToCartDto) {
    let cart = await this.cartModel.findOne({ userId: dto.userId });

    if (!cart) {
      cart = new this.cartModel({
        userId: dto.userId,
        items: dto.items,
      });
    } else {
      // Nếu có rồi → cập nhật sản phẩm
      for (const newItem of dto.items) {
        const existing = cart.items.find(
          (i) =>
            i.productId === newItem.productId &&
            i.color === newItem.color &&
            i.size === newItem.size,
        );

        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      }
    }

    const saved = await cart.save();
    return this.formatCart(saved);
  }

  async removeItem(
    userId: string,
    productId: string,
    size: string,
    color: string,
  ) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) return null;

    cart.items = cart.items.filter(
      (i) =>
        !(i.productId === productId && i.size === size && i.color === color),
    );

    const saved = await cart.save();
    return this.formatCart(saved);
  }

  /**
   * ✏️ Cập nhật số lượng hoặc xoá sản phẩm
   */
  async updateItem(
    userId: string,
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) return null;

    const itemIndex = cart.items.findIndex(
      (i) => i.productId === productId && i.size === size && i.color === color,
    );
    if (itemIndex === -1) return null;

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    const saved = await cart.save();
    return this.formatCart(saved);
  }

  /**
   * 🗑️ Xóa toàn bộ giỏ hàng của user
   */
  async clearCart(userId: string) {
    await this.cartModel.deleteOne({ userId });
    return { userId, items: [], totalQuantity: 0, totalPrice: 0 };
  }

  /**
   * 📦 Hàm định dạng dữ liệu trả về cho frontend
   */
  private formatCart(cart: CartDocument) {
    const items = cart.items || [];
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return {
      userId: cart.userId,
      items,
      totalQuantity,
      totalPrice,
    };
  }
}
