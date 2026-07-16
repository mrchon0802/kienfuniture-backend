import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {
  Product,
  ProductSchema,
  ProductDocument,
} from '../../src/product/product.schema';

/* ================= INTERFACES ================= */
interface ColorOption {
  name: string;
  image: string;
  productImage: string;
}

interface ProductJson {
  productId: string;
  image: string;
  title: string;
  price: number;
  discountPrice: number | null;
  weight: number;
  width: number;
  length: number;
  height: number;
  category: string;
  type: string;
  room: string[];
  materials: string[] | null;
  colors: ColorOption[];
}

/* ================= SEED FUNCTION ================= */
export async function seedProduct() {
  console.log('🌱 Seeding products...');

  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    throw new Error('❌ MongoDB not connected. Call this after connecting!');
  }

  const filePath = path.join(__dirname, '..', 'data', 'product.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(rawData) as ProductJson[];

  const ProductModel = mongoose.model<ProductDocument>(
    Product.name,
    ProductSchema as mongoose.Schema,
  );

  await ProductModel.deleteMany({});
  await ProductModel.insertMany(products);

  console.log(`🎉 Seeded ${products.length} products`);
}

/* ================= CHẠY TRỰC TIẾP ================= */
if (require.main === module) {
  import('dotenv').then(async ({ config }) => {
    config();

    // Dùng DATABASE_URL để seed vào local
    const uri =
      process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/kiennoithat';

    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB: ${uri}`);

    await seedProduct();

    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);
  });
}
