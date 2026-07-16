import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async searchByTitle(keyword: string) {
    const q = keyword?.trim();
    if (!q) return [];

    return this.productModel.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } },
    );

    return this.productModel
      .find({ $text: { $search: keyword } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(8) // dropdown chỉ cần 5–10
      .select('productId title image price')
      .lean();
  }

  async findAll(filters?: {
    room?: string;
    category?: string;
    limit?: number;
  }): Promise<Product[]> {
    const query: Record<string, any> = {};

    if (filters?.room) {
      query.room = filters.room; // room là mảng string trong schema, Mongo tự match nếu phần tử trùng
    }
    if (filters?.category) {
      query.category = filters.category;
    }

    const mongooseQuery = this.productModel.find(query).lean();

    if (filters?.limit) {
      mongooseQuery.limit(filters.limit);
    }

    return mongooseQuery.exec();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findOne({ productId: id }).lean().exec();
  }
  async findHeroProducts() {
    return this.productModel.find({ type: 'hero' }).lean();
  }

  async create(data: Partial<Product>): Promise<Product> {
    const created = new this.productModel(data);
    const saved = await created.save();
    return saved.toObject();
  }

  async createMany(data: Partial<Product>[]): Promise<Product[]> {
    const created = await this.productModel.insertMany(data);
    return created.map((doc) => doc.toObject());
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate({ productId: id }, data, { new: true })
      .lean()
      .exec();
  }

  async remove(id: string): Promise<Product | null> {
    return this.productModel.findOneAndDelete({ productId: id }).lean().exec();
  }
}
