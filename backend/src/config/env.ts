import dotenv from 'dotenv';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '..', '.env');
dotenv.config({ path: envPath });
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/brandforge-ai',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  aiProvider: process.env.AI_PROVIDER ?? 'demo',
  aiApiKey: process.env.AI_API_KEY ?? '',
  imageApiKey: process.env.IMAGE_API_KEY ?? '',
  demoMode: (process.env.DEMO_MODE ?? 'true').toLowerCase() === 'true',
};
