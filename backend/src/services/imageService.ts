import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const uploadRoot = path.resolve(process.cwd(), 'uploads');

export type PlatformConfig = {
  name: string;
  width: number;
  height: number;
};

export const platformSizes: Record<string, PlatformConfig> = {
  Instagram: { name: 'Instagram', width: 1080, height: 1080 },
  X: { name: 'X', width: 1600, height: 900 },
  LinkedIn: { name: 'LinkedIn', width: 1200, height: 627 },
};

export async function ensureUploadDirectory() {
  await fs.mkdir(uploadRoot, { recursive: true });
}

export async function saveOriginalImage(file: Express.Multer.File) {
  await ensureUploadDirectory();
  const fileName = `${uuidv4()}-${file.originalname}`;
  const destination = path.join(uploadRoot, fileName);
  await fs.writeFile(destination, file.buffer);
  return `/uploads/${fileName}`;
}

export async function processPlatformImage(imagePath: string, platform: string, variantNumber = 1) {
  const resolved = path.resolve(process.cwd(), imagePath.replace(/^\//, ''));
  const accessPath = path.extname(resolved) ? resolved : `${resolved}.jpg`;

  const config = platformSizes[platform] ?? platformSizes.Instagram;
  const outputName = `${uuidv4()}-${platform.toLowerCase()}-${variantNumber}.jpg`;
  const outputPath = path.join(uploadRoot, outputName);

  await sharp(accessPath)
    .resize(config.width, config.height, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: true,
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  return `/uploads/${outputName}`;
}

export async function generateVisualVariants(imagePath: string, brandColors: string[] = []) {
  const base = path.resolve(process.cwd(), imagePath.replace(/^\//, ''));
  const colorA = brandColors[0] ?? '#F4C95D';
  const colorB = brandColors[1] ?? '#1E3A8A';

  const output = path.join(uploadRoot, `${uuidv4()}-visual.jpg`);
  await sharp(base)
    .resize(1200, 1200, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .composite([
      {
        input: Buffer.from(`<svg width="1200" height="1200"><rect width="1200" height="1200" fill="${colorA}" fill-opacity="0.14"/><rect x="160" y="160" width="900" height="900" rx="48" fill="${colorB}" fill-opacity="0.06"/></svg>`),
        blend: 'over',
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(output);

  return `/uploads/${path.basename(output)}`;
}
