export type User = {
  id: string;
  name: string;
  email: string;
};

export type BrandProfile = {
  id?: string;
  userId?: string;
  brandName: string;
  brandDescription: string;
  targetAudience: string;
  brandTone: string;
  brandColors: string[];
  preferredLanguage: string;
  preferredContentStyle: string;
  platforms: string[];
};

export type ContentVariant = {
  variantNumber: number;
  caption: string;
  hashtags: string[];
  visual: string;
  platformVersions: Record<string, { imageUrl: string; aspectRatio: string }>;
  tone: string;
  reasoning: string;
  edited: boolean;
  approved: boolean;
  platform: string;
};

export type ContentPost = {
  id: string;
  userId: string;
  brandId: string;
  brief: string;
  originalImage: string;
  variants: ContentVariant[];
  selectedVariant: number;
  status: 'DRAFT' | 'GENERATED' | 'EDITED' | 'APPROVED' | 'EXPORTED';
  createdAt: string;
  updatedAt: string;
};
