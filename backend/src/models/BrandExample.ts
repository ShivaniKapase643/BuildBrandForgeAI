import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandExample extends Document {
  userId: mongoose.Types.ObjectId;
  caption: string;
  hashtags: string[];
  platform: string;
  tone: string;
  approvalStatus: 'APPROVED' | 'DRAFT';
  createdAt: Date;
}

const brandExampleSchema = new Schema<IBrandExample>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, required: true },
  hashtags: [{ type: String }],
  platform: { type: String, required: true },
  tone: { type: String, required: true },
  approvalStatus: { type: String, enum: ['APPROVED', 'DRAFT'], default: 'APPROVED' },
  createdAt: { type: Date, default: Date.now },
});

const BrandExample = mongoose.models.BrandExample || mongoose.model<IBrandExample>('BrandExample', brandExampleSchema);

export default BrandExample;
