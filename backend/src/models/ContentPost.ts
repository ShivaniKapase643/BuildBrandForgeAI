import mongoose, { Schema, Document } from 'mongoose';

export interface IContentPost extends Document {
  userId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  brief: string;
  originalImage: string;
  variants: any[];
  selectedVariant: number;
  status: 'DRAFT' | 'GENERATED' | 'EDITED' | 'APPROVED' | 'EXPORTED';
  createdAt: Date;
  updatedAt: Date;
}

const contentPostSchema = new Schema<IContentPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brandId: { type: Schema.Types.ObjectId, ref: 'BrandProfile', required: true },
  brief: { type: String, required: true },
  originalImage: { type: String, default: '' },
  variants: [{ type: Schema.Types.Mixed }],
  selectedVariant: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['DRAFT', 'GENERATED', 'EDITED', 'APPROVED', 'EXPORTED'],
    default: 'DRAFT',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

contentPostSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const ContentPost = mongoose.models.ContentPost || mongoose.model<IContentPost>('ContentPost', contentPostSchema);

export default ContentPost;
