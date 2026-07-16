// src/main.ts

import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      /^https:\/\/kien-furniture(-[\w-]+)?\.vercel\.app$/, // preview + production
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  console.log('✅ CORS enabled for:', [
    'https://kien-furniture.vercel.app',
    'http://localhost:3000',
  ]);

  mongoose.connection.once('open', () => {
    console.log('✅ Connected to MongoDB Atlas');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running on port ${PORT}`);
  });
}
bootstrap();
