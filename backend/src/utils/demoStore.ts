export type DemoUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type DemoBrandProfile = {
  id: string;
  userId: string;
  brandName: string;
  brandDescription: string;
  targetAudience: string;
  brandTone: string;
  brandColors: string[];
  preferredLanguage: string;
  preferredContentStyle: string;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
};

export type DemoBrandExample = {
  id: string;
  userId: string;
  caption: string;
  hashtags: string[];
  platform: string;
  tone: string;
  approvalStatus: 'APPROVED' | 'DRAFT';
  createdAt: string;
};

export type DemoContentVariant = {
  id: string;
  variantNumber: number;
  caption: string;
  hashtags: string[];
  tone: string;
  reasoning: string;
  visual: string;
  platformVersions: Record<string, { imageUrl: string; aspectRatio: string; }>;
  edited: boolean;
  approved: boolean;
  platform: string;
};

export type DemoContentPost = {
  id: string;
  userId: string;
  brandId: string;
  brief: string;
  originalImage: string;
  variants: DemoContentVariant[];
  selectedVariant: number;
  status: 'DRAFT' | 'GENERATED' | 'EDITED' | 'APPROVED' | 'EXPORTED';
  createdAt: string;
  updatedAt: string;
};

export const demoStore = {
  users: [] as DemoUser[],
  brandProfiles: [] as DemoBrandProfile[],
  brandExamples: [] as DemoBrandExample[],
  contentPosts: [] as DemoContentPost[],
};

export function seedDemoData() {
  if (demoStore.users.length > 0) return;

  demoStore.users.push({
    id: 'demo-user-1',
    name: 'Demo Creator',
    email: 'demo@brandforge.ai',
    passwordHash: '$2a$10$0rBGWRS0aR5gGyQJopdKDOEyFk7k6M4TiYG8mP4PMrOzuKpB3J/5a',
    createdAt: new Date().toISOString(),
  });

  demoStore.brandProfiles.push({
    id: 'demo-brand-1',
    userId: 'demo-user-1',
    brandName: 'Northstar Studio',
    brandDescription: 'Modern lifestyle brand creating premium essentials for creators and explorers.',
    targetAudience: 'Gen Z creators and design-conscious professionals',
    brandTone: 'Playful',
    brandColors: ['#F4C95D', '#1E3A8A', '#0A0A0A'],
    preferredLanguage: 'English',
    preferredContentStyle: 'Clean, high-contrast, emotionally resonant',
    platforms: ['Instagram', 'X', 'LinkedIn'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  demoStore.brandExamples.push({
    id: 'demo-example-1',
    userId: 'demo-user-1',
    caption: 'Built for early mornings and bold ideas. Your next favorite ritual starts here.',
    hashtags: ['#BrandStory', '#CreatorEssentials', '#PremiumLifestyle'],
    platform: 'Instagram',
    tone: 'Playful',
    approvalStatus: 'APPROVED',
    createdAt: new Date().toISOString(),
  });

  demoStore.brandExamples.push({
    id: 'demo-example-2',
    userId: 'demo-user-1',
    caption: 'Designing around momentum, not noise. Minimal tools. Maximum clarity.',
    hashtags: ['#MinimalDesign', '#CreatorEconomy', '#BuildInPublic'],
    platform: 'LinkedIn',
    tone: 'Professional',
    approvalStatus: 'APPROVED',
    createdAt: new Date().toISOString(),
  });
}
