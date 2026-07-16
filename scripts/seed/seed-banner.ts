import { connect, connection, Schema } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { BannerSchema, BannerDocument } from '../../src/banner/banner.schema';

// ---- Interface (type-safe JSON) ----
interface Button {
  label: string;
  link: string;
}

interface BannerJson {
  title: string;
  description?: string;
  image: string;
  buttons: Button[];
}

export async function seedBanner() {
  console.log('🌱 Seeding banners...');

  // 1️⃣ Nếu chưa có kết nối thì mới connect
  if (connection.readyState === 0) {
    throw new Error('❌ MongoDB not connected. Call this after connecting!');
  }

  // 2️⃣ Load JSON file
  const filePath = path.join(__dirname, '..', 'data', 'banner.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const banners: BannerJson[] = JSON.parse(rawData);

  // 3️⃣ Khởi tạo Model tạm (không cần qua Nest)
  const BannerModel = connection.model<BannerDocument>(
    'Banner',
    BannerSchema as Schema,
  );

  // 4️⃣ Xóa dữ liệu cũ
  await BannerModel.deleteMany({});

  // 5️⃣ Insert dữ liệu mới
  await BannerModel.insertMany(banners);

  console.log(`🎉 Seeded ${banners.length} banners`);
}

// ⚙️ Nếu chạy riêng file này bằng `node seed-banner.ts`
if (require.main === module) {
  import('mongoose').then(async ({ connect, connection }) => {
    const uri =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kiennoithat';
    await connect(uri);
    await seedBanner();
    await connection.close();
    process.exit(0);
  });
}
