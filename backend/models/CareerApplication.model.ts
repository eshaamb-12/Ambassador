import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ICareerApplication extends Document {
  jobId: Types.ObjectId;
  jobSlug: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  experience?: string;
  linkedIn?: string;
  resumeFileName: string;
  resumeUrl?: string;
  /** Stored when Cloudinary upload is unavailable (dev / fallback). */
  resumeData?: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const careerApplicationSchema = new Schema<ICareerApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'CareerJob', required: true, index: true },
    jobSlug: { type: String, required: true, trim: true, lowercase: true },
    jobTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    experience: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    resumeFileName: { type: String, required: true, trim: true },
    resumeUrl: { type: String, trim: true },
    resumeData: { type: Buffer, select: false },
  },
  { timestamps: true },
);

const CareerApplication: Model<ICareerApplication> =
  mongoose.models.CareerApplication ??
  mongoose.model<ICareerApplication>('CareerApplication', careerApplicationSchema);

export default CareerApplication;
