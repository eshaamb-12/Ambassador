import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISitePage extends Document {
  slug: string;
  title: string;
  /** Page-specific JSON (e.g. home sections, hero slides). */
  content: Record<string, unknown>;
  updatedAt: Date;
}

const sitePageSchema = new Schema<ISitePage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

const SitePage: Model<ISitePage> =
  mongoose.models.SitePage ?? mongoose.model<ISitePage>('SitePage', sitePageSchema);

export default SitePage;
