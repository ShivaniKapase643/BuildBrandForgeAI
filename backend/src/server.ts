import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import fs from 'node:fs';
import { createServer } from 'node:http';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { AppError } from './utils/appError.js';
import { seedDemoData } from './utils/demoStore.js';

const app = express();
const port = env.port;

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: env.demoMode ? 'demo' : 'live', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((error: any, _req: any, res: any, _next: any) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error?.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error: ' + error.message });
  }

  if (error?.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value detected' });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

async function start() {
  seedDemoData();
  await connectDatabase();
  createServer(app).listen(port, () => {
    console.log(`BrandForge AI backend running on http://localhost:${port}`);
  });
}

start();
