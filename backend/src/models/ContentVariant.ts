import mongoose, { Schema, Document } from 'mongoose';

export interface IContentVariant extends Document {
  variantNumber: number;
  caption: string;
  hashtags: string[];
  visual: string;
  platformVersions: Record<string, { imageUrl: string; aspectRatio: string }>;
  tone: string;
  reasoning: string;
  edited: boolean;
  approved: boolean;
  createdAt: Date;
}

const contentVariantSchema = new Schema<IContentVariant>({
  variantNumber: { type: Number, required: true },
  caption: { type: String, required: true },
  hashtags: [{ type: String }],
  visual: { type: String, default: '' },
  platformVersions: { type: Map, of: Object, default: {} },
  tone: { type: String, default: 'Professional' },
  reasoning: { type: String, default: '' },
  edited: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ContentVariant = mongoose.models.ContentVariant || mongoose.model<IContentVariant>('ContentVariant', contentVariantSchema);

export default ContentVariant;
