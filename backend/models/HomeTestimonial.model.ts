import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHomeTestimonial extends Document {
  name: string;
  profession: string;
  videoUrl: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const homeTestimonialSchema = new Schema<IHomeTestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    profession: {
      type: String,
      required: [true, 'Profession is required'],
      trim: true,
      maxlength: [200, 'Profession cannot exceed 200 characters'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

homeTestimonialSchema.index({ status: 1, sortOrder: 1, createdAt: -1 });

if (process.env.NODE_ENV !== 'production' && mongoose.models.HomeTestimonial) {
  delete (mongoose.models as Record<string, unknown>).HomeTestimonial;
}

const HomeTestimonial: Model<IHomeTestimonial> =
  mongoose.models.HomeTestimonial ??
  mongoose.model<IHomeTestimonial>('HomeTestimonial', homeTestimonialSchema);

export default HomeTestimonial;
