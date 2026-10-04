import { NextFunction, Request, Response } from 'express';
import BrandProfile from '../models/BrandProfile.js';
import { AppError } from '../utils/appError.js';
import { demoStore } from '../utils/demoStore.js';
import { isMongoConnected } from '../config/database.js';

export async function getBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (isMongoConnected) {
      const brand = await BrandProfile.findOne({ userId }).sort({ createdAt: -1 });
      if (!brand) return res.json({ brand: null });
      return res.json({ brand: brand.toObject() });
    }

    const brand = demoStore.brandProfiles.find((item) => item.userId === userId) ?? demoStore.brandProfiles[0];
    return res.json({ brand: brand ?? null });
  } catch (error) {
    next(error);
  }
}

export async function createBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const payload = req.body;

    if (!payload.brandName) throw new AppError('Brand name is required', 400);

    if (isMongoConnected) {
      const brand = await BrandProfile.create({
        userId,
        brandName: payload.brandName,
        brandDescription: payload.brandDescription ?? '',
        targetAudience: payload.targetAudience ?? '',
        brandTone: payload.brandTone ?? 'Professional',
        brandColors: payload.brandColors ?? ['#F4C95D', '#1E3A8A', '#0A0A0A'],
        preferredLanguage: payload.preferredLanguage ?? 'English',
        preferredContentStyle: payload.preferredContentStyle ?? '',
        platforms: payload.platforms ?? ['Instagram', 'X', 'LinkedIn'],
      });
      return res.status(201).json({ brand: brand.toObject() });
    }

    const brand = {
      id: `demo-brand-${Date.now()}`,
      userId,
      brandName: payload.brandName,
      brandDescription: payload.brandDescription ?? '',
      targetAudience: payload.targetAudience ?? '',
      brandTone: payload.brandTone ?? 'Professional',
      brandColors: payload.brandColors ?? ['#F4C95D', '#1E3A8A', '#0A0A0A'],
      preferredLanguage: payload.preferredLanguage ?? 'English',
      preferredContentStyle: payload.preferredContentStyle ?? '',
      platforms: payload.platforms ?? ['Instagram', 'X', 'LinkedIn'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    demoStore.brandProfiles = demoStore.brandProfiles.filter((item) => item.userId !== userId);
    demoStore.brandProfiles.push(brand);
    return res.status(201).json({ brand });
  } catch (error) {
    next(error);
  }
}

export async function updateBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const payload = req.body;

    if (isMongoConnected) {
      const brand = await BrandProfile.findOneAndUpdate(
        { userId },
        {
          $set: {
            brandName: payload.brandName,
            brandDescription: payload.brandDescription,
            targetAudience: payload.targetAudience,
            brandTone: payload.brandTone,
            brandColors: payload.brandColors,
            preferredLanguage: payload.preferredLanguage,
            preferredContentStyle: payload.preferredContentStyle,
            platforms: payload.platforms,
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true },
      );
      return res.json({ brand: brand.toObject() });
    }

    const current = demoStore.brandProfiles.find((item) => item.userId === userId) ?? demoStore.brandProfiles[0];
    const updated = {
      ...current,
      ...payload,
      id: current?.id ?? `demo-brand-${Date.now()}`,
      userId,
      updatedAt: new Date().toISOString(),
    };
    demoStore.brandProfiles = demoStore.brandProfiles.filter((item) => item.userId !== userId);
    demoStore.brandProfiles.push(updated);
    return res.json({ brand: updated });
  } catch (error) {
    next(error);
  }
}
