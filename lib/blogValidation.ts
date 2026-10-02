import {
  BLOG_CATEGORY_MAX,
  BLOG_CONTENT_MAX,
  BLOG_EXCERPT_MAX,
  BLOG_TITLE_MAX,
} from '@/lib/blog.types';
import { isValidBlogSlug, normalizeBlogSlug, slugFromBlogTitle } from '@/lib/blogSlug';
import { normalizeBlogTags } from '@/lib/blogTags';
import { sanitizeBlogHtml, stripHtmlForWordCount } from '@/lib/blogHtml';

export type BlogWritePayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImagePublicId: string;
  author: string;
  category?: string;
  tags: string[];
  status: 'active' | 'inactive';
  publishedAt: Date;
};

export function validateBlogWriteBody(
  body: Record<string, unknown>,
  isCreate: boolean,
): { data?: BlogWritePayload; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
  const rawContent = typeof body.content === 'string' ? body.content.trim() : '';
  const content = sanitizeBlogHtml(rawContent);
  const coverImage = typeof body.coverImage === 'string' ? body.coverImage.trim() : '';
  const coverImagePublicId =
    typeof body.coverImagePublicId === 'string' ? body.coverImagePublicId.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : 'Ambassador Team';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const tags = normalizeBlogTags(body.tags);
  const status = body.status === 'inactive' ? 'inactive' : 'active';
  const publishedAtRaw = body.publishedAt;

  let slug =
    typeof body.slug === 'string' && body.slug.trim()
      ? normalizeBlogSlug(body.slug)
      : title
        ? slugFromBlogTitle(title)
        : '';

  if (isCreate && !title) errors.title = 'Title is required.';
  if (isCreate && !excerpt) errors.excerpt = 'Excerpt is required.';
  const contentPlain = stripHtmlForWordCount(content);
  if (isCreate && !contentPlain) errors.content = 'Content is required.';
  if (title.length > BLOG_TITLE_MAX) {
    errors.title = `Title cannot exceed ${BLOG_TITLE_MAX} characters.`;
  }
  if (excerpt.length > BLOG_EXCERPT_MAX) {
    errors.excerpt = `Excerpt cannot exceed ${BLOG_EXCERPT_MAX} characters (short summary for blog cards).`;
  }
  if (content.length > BLOG_CONTENT_MAX) {
    errors.content = `Content is too long (max ${BLOG_CONTENT_MAX} characters).`;
  }
  if (category.length > BLOG_CATEGORY_MAX) {
    errors.category = `Category cannot exceed ${BLOG_CATEGORY_MAX} characters.`;
  }
  if (!slug) errors.slug = 'Permalink is required.';
  else if (!isValidBlogSlug(slug)) {
    errors.slug = 'Permalink may only use lowercase letters, numbers, and hyphens.';
  }

  if (Object.keys(errors).length > 0) return { errors, data: undefined };

  let publishedAt = new Date();
  if (publishedAtRaw) {
    const parsed = new Date(String(publishedAtRaw));
    if (!Number.isNaN(parsed.getTime())) publishedAt = parsed;
  }

  return {
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      coverImagePublicId,
      author: author || 'Ambassador Team',
      category: category || undefined,
      tags,
      status,
      publishedAt,
    },
    errors,
  };
}
