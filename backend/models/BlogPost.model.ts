import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  coverImagePublicId?: string;
  author: string;
  category?: string;
  tags: string[];
  status: 'active' | 'inactive';
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [320, 'Excerpt cannot exceed 320 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [50000, 'Content is too long'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    coverImagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    author: {
      type: String,
      trim: true,
      default: 'Ambassador Team',
      maxlength: [120, 'Author name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [80, 'Category cannot exceed 80 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: 'blogposts' },
);

/** Slug is set by admin (permalink) or API on create — do not overwrite when title changes. */
blogPostSchema.pre('save', async function () {
  if (this.slug?.trim()) return;

  const base = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

  const BlogPostModel =
    mongoose.models.BlogPost ?? mongoose.model('BlogPost', blogPostSchema, 'blogposts');
  const candidate = base || `post-${Date.now().toString(36)}`;
  const existing = await BlogPostModel.findOne({ slug: candidate, _id: { $ne: this._id } });
  this.slug = existing ? `${candidate}-${Date.now().toString(36)}` : candidate;
});

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

if (process.env.NODE_ENV !== 'production' && mongoose.models.BlogPost) {
  delete (mongoose.models as Record<string, unknown>).BlogPost;
}

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ??
  mongoose.model<IBlogPost>('BlogPost', blogPostSchema, 'blogposts');

export default BlogPost;
