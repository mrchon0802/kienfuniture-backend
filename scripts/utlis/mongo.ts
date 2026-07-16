import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = 'mongodb://127.0.0.1:27017/kiennoithat';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
}

export async function disconnectMongo() {
  await mongoose.disconnect();
  console.log('❎ Disconnected from MongoDB');
}
