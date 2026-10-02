export const BLOG_SLUG_MAX = 120;

/** URL segment for /blog/[slug] — lowercase, hyphens, no leading/trailing hyphen. */
export function normalizeBlogSlug(raw: string): string {
  const base = String(raw ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base.slice(0, BLOG_SLUG_MAX);
}

export function slugFromBlogTitle(title: string): string {
  return normalizeBlogSlug(title) || `post-${Date.now().toString(36)}`;
}

export function isValidBlogSlug(slug: string): boolean {
  if (!slug || slug.length > BLOG_SLUG_MAX) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
