export const BLOG_TAG_MAX = 40;
export const BLOG_MAX_TAGS = 12;

export function normalizeBlogTags(raw: unknown): string[] {
  if (!Array.isArray(raw) && typeof raw !== 'string') return [];

  const parts =
    typeof raw === 'string'
      ? raw.split(/[,;|]/)
      : raw.map((item) => String(item ?? ''));

  const seen = new Set<string>();
  const out: string[] = [];

  for (const part of parts) {
    const tag = part.trim().replace(/\s+/g, ' ');
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag.slice(0, BLOG_TAG_MAX));
    if (out.length >= BLOG_MAX_TAGS) break;
  }

  return out;
}
