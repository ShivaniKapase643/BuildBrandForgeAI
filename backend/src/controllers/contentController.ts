import { NextFunction, Request, Response } from 'express';
import { isMongoConnected } from '../config/database.js';
import BrandProfile from '../models/BrandProfile.js';
import ContentPost from '../models/ContentPost.js';
import { AppError } from '../utils/appError.js';
import { demoStore } from '../utils/demoStore.js';
import { generateVariants, getRelevantExamples } from '../services/aiService.js';
import { generateVisualVariants, processPlatformImage, saveOriginalImage } from '../services/imageService.js';

function getBrandFromStore(userId: string) {
  return demoStore.brandProfiles.find((brand) => brand.userId === userId) ?? demoStore.brandProfiles[0];
}

export async function generateContent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { brief, platform } = req.body;

    if (!brief) throw new AppError('Brief is required', 400);
    if (!req.file) throw new AppError('A product image is required', 400);

    let brand: any = null;
    if (isMongoConnected) {
      brand = await BrandProfile.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      brand = getBrandFromStore(userId);
    }

    if (!brand) {
      brand = {
        brandName: 'Northstar Studio',
        brandDescription: 'Premium essentials for modern creators.',
        targetAudience: 'Creators and design lovers',
        brandTone: 'Playful',
        brandColors: ['#F4C95D', '#1E3A8A', '#0A0A0A'],
        preferredLanguage: 'English',
        preferredContentStyle: 'Clean and vibrant',
        platforms: ['Instagram', 'X', 'LinkedIn'],
      };
    }

    const originalImage = await saveOriginalImage(req.file);
    const visualBase = await generateVisualVariants(originalImage, brand.brandColors ?? ['#F4C95D', '#1E3A8A']);

    let examples: any[] = [];
    if (isMongoConnected) {
      // This app intentionally uses a lightweight in-memory-like memory layer when DB is unavailable.
    } else {
      examples = demoStore.brandExamples.filter((item) => item.userId === userId || item.userId === 'demo-user-1');
    }

    const relevantExamples = getRelevantExamples(examples, brief, brand.brandTone);
    const llmResult = await generateVariants({
      brand,
      brief,
      examples: relevantExamples,
      imageDescription: `Product photo uploaded for a ${platform ?? 'Instagram'} post with a ${brand.brandTone} brand voice.`,
    });

    const variants = await Promise.all(llmResult.variants.map(async (variant, index) => {
      const platformVersions: Record<string, any> = {};
      for (const currentPlatform of brand.platforms ?? ['Instagram', 'X', 'LinkedIn']) {
        const generated = await processPlatformImage(visualBase, currentPlatform, index + 1);
        platformVersions[currentPlatform] = {
          imageUrl: generated,
          aspectRatio: currentPlatform === 'Instagram' ? '1:1' : currentPlatform === 'X' ? '16:9' : '1.91:1',
        };
      }

      return {
        variantNumber: variant.variantNumber,
        caption: variant.caption,
        hashtags: variant.hashtags,
        tone: variant.tone,
        reasoning: variant.reasoning,
        visual: visualBase,
        platformVersions,
        edited: false,
        approved: false,
        platform: platform ?? 'Instagram',
      };
    }));

    const contentId = `demo-post-${Date.now()}`;
    const post = {
      id: contentId,
      userId,
      brandId: brand.id ?? 'demo-brand-1',
      brief,
      originalImage,
      variants,
      selectedVariant: 1,
      status: 'GENERATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      const created = await ContentPost.create({
        userId,
        brandId: brand._id,
        brief,
        originalImage,
        variants,
        selectedVariant: 1,
        status: 'GENERATED',
      });
      return res.status(201).json({ content: created.toObject() });
    }

    demoStore.contentPosts.unshift(post);
    return res.status(201).json({ content: post });
  } catch (error) {
    next(error);
  }
}

export async function listContent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (isMongoConnected) {
      const posts = await ContentPost.find({ userId }).sort({ createdAt: -1 });
      return res.json({ content: posts });
    }

    return res.json({ content: demoStore.contentPosts.filter((item) => item.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  } catch (error) {
    next(error);
  }
}

export async function getContentById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const post = await ContentPost.findById(id);
      if (!post) throw new AppError('Content not found', 404);
      return res.json({ content: post });
    }

    const post = demoStore.contentPosts.find((item) => item.id === id);
    if (!post) throw new AppError('Content not found', 404);
    return res.json({ content: post });
  } catch (error) {
    next(error);
  }
}

export async function updateContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected) {
      const post = await ContentPost.findByIdAndUpdate(id, { $set: { ...updates, updatedAt: new Date() } }, { new: true });
      if (!post) throw new AppError('Content not found', 404);
      return res.json({ content: post });
    }

    const index = demoStore.contentPosts.findIndex((item) => item.id === id);
    if (index < 0) throw new AppError('Content not found', 404);

    demoStore.contentPosts[index] = { ...demoStore.contentPosts[index], ...updates, updatedAt: new Date().toISOString(), status: 'EDITED' };
    return res.json({ content: demoStore.contentPosts[index] });
  } catch (error) {
    next(error);
  }
}

export async function deleteContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const deleted = await ContentPost.findByIdAndDelete(id);
      if (!deleted) throw new AppError('Content not found', 404);
      return res.json({ success: true });
    }

    demoStore.contentPosts = demoStore.contentPosts.filter((item) => item.id !== id);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function approveContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const post = await ContentPost.findById(id);
      if (!post) throw new AppError('Content not found', 404);
      post.status = 'APPROVED';
      post.variants = post.variants.map((variant: any) => ({ ...variant, approved: true }));
      await post.save();
      return res.json({ content: post });
    }

    const post = demoStore.contentPosts.find((item) => item.id === id);
    if (!post) throw new AppError('Content not found', 404);
    post.status = 'APPROVED';
    post.variants = post.variants.map((variant) => ({ ...variant, approved: true }));
    post.updatedAt = new Date().toISOString();
    return res.json({ content: post });
  } catch (error) {
    next(error);
  }
}

export async function regenerateContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { variantIndex, brief } = req.body;
    const content = demoStore.contentPosts.find((item) => item.id === id);
    if (!content) throw new AppError('Content not found', 404);

    const variant = content.variants[variantIndex ?? 0];
    if (!variant) throw new AppError('Variant not found', 404);

    const updatedCaption = `${variant.caption} Updated for ${brief ?? content.brief}.`;
    variant.caption = updatedCaption;
    variant.edited = true;
    content.status = 'EDITED';
    content.updatedAt = new Date().toISOString();

    return res.json({ content });
  } catch (error) {
    next(error);
  }
}

export async function exportContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const content = demoStore.contentPosts.find((item) => item.id === id) ?? null;
    if (!content) throw new AppError('Content not found', 404);

    const payload = {
      exportDate: new Date().toISOString(),
      content,
      package: {
        caption: content.variants[0]?.caption ?? '',
        hashtags: content.variants[0]?.hashtags ?? [],
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="brandforge-export-${id}.json"`);
    return res.send(JSON.stringify(payload, null, 2));
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const content = demoStore.contentPosts.filter((item) => item.userId === userId);

    const approved = content.filter((item) => item.status === 'APPROVED').length;
    const generated = content.length;
    const avgGenerationTime = generated ? '3.2 min' : '0 min';
    const edits = content.reduce((sum, item) => sum + item.variants.filter((v: any) => v.edited).length, 0);
    const platformCounts: Record<string, number> = {};
    for (const item of content) {
      for (const variant of item.variants) {
        for (const platform of Object.keys(variant.platformVersions ?? {})) {
          platformCounts[platform] = (platformCounts[platform] ?? 0) + 1;
        }
      }
    }
    const mostUsedPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0] ?? ['Instagram', 0];

    const tones: Record<string, number> = {};
    for (const item of content) {
      for (const variant of item.variants) {
        tones[variant.tone] = (tones[variant.tone] ?? 0) + 1;
      }
    }
    const mostUsedTone = Object.entries(tones).sort((a, b) => b[1] - a[1])[0] ?? ['Professional', 0];

    const manualWorkflowTargetMinutes = 45;
    const aiTargetMinutes = 3;
    const timeSaved = Math.max(0, manualWorkflowTargetMinutes - aiTargetMinutes);

    res.json({
      metrics: {
        generatedPosts: generated,
        approvedPosts: approved,
        averageGenerationTime: avgGenerationTime,
        numberOfEdits: edits,
        mostUsedPlatform: mostUsedPlatform[0],
        mostUsedTone: mostUsedTone[0],
        manualWorkflowTarget: `${manualWorkflowTargetMinutes} minutes/post`,
        aiWorkflowTarget: `${aiTargetMinutes} minutes/post`,
        estimatedTimeSaved: `${timeSaved} minutes/post`,
        note: 'Demo target metrics only; not actual production performance data.',
      },
    });
  } catch (error) {
    next(error);
  }
}
