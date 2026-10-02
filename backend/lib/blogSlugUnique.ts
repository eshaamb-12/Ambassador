import BlogPost from '@/backend/models/BlogPost.model';
import type { Types } from 'mongoose';

export async function ensureUniqueBlogSlug(
  slug: string,
  excludeId?: Types.ObjectId | string,
): Promise<string> {
  let candidate = slug;
  let attempt = 0;

  while (attempt < 20) {
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await BlogPost.findOne(query).select('_id').lean();
    if (!existing) return candidate;

    attempt += 1;
    candidate = `${slug}-${attempt}`;
  }

  return `${slug}-${Date.now().toString(36)}`;
}
