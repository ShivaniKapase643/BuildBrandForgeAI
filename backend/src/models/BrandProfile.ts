import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandProfile extends Document {
  userId: mongoose.Types.ObjectId;
  brandName: string;
  brandDescription: string;
  targetAudience: string;
  brandTone: string;
  brandColors: string[];
  preferredLanguage: string;
  preferredContentStyle: string;
  platforms: string[];
  createdAt: Date;
  updatedAt: Date;
}

const brandProfileSchema = new Schema<IBrandProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brandName: { type: String, required: true, trim: true },
  brandDescription: { type: String, default: '' },
  targetAudience: { type: String, default: '' },
  brandTone: { type: String, default: 'Professional' },
  brandColors: [{ type: String }],
  preferredLanguage: { type: String, default: 'English' },
  preferredContentStyle: { type: String, default: '' },
  platforms: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

brandProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const BrandProfile = mongoose.models.BrandProfile || mongoose.model<IBrandProfile>('BrandProfile', brandProfileSchema);

export default BrandProfile;
