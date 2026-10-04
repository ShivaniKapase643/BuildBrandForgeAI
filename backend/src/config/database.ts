import mongoose from 'mongoose';
import { env } from './env.js';

export let isMongoConnected = false;

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    isMongoConnected = false;
    console.warn('MongoDB unavailable. Running in demo/in-memory mode.');
    console.warn((error as Error).message);
  }
}
