import mongoose, { Schema } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {
  DesignCarousel,
  DesignCarouselSchema,
  DesignCarouselDocument,
} from '../../src/design-carousel/design-carousel.schema';

interface DesignCarouselJson {
  title: string;
  description?: string;
  image: string;
  button: string;
}

export async function seedDesignCarousel() {
  // ❌ Không connect nếu đã có connection sẵn (dành cho seedAll.ts)
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    throw new Error('❌ MongoDB not connected. Call this after connecting!');
  }
  const filePath = path.join(__dirname, '..', 'data', 'designCarousel.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const items = JSON.parse(rawData) as unknown as DesignCarouselJson[];

  const DesignCarouselModel = mongoose.model<DesignCarouselDocument>(
    DesignCarousel.name,
    DesignCarouselSchema as Schema,
  );

  await DesignCarouselModel.deleteMany({});
  await DesignCarouselModel.insertMany(items);

  console.log(`🎉 Seeded ${items.length} design carousel items`);
}

if (require.main === module) {
  import('dotenv').then(async ({ config }) => {
    config(); // load .env nếu có
    const uri =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kiennoithat';

    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB: ${uri}`);

    await seedDesignCarousel();

    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);
  });
}
