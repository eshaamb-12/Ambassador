import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'p',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'a',
  'blockquote',
  'span',
];

/** Sanitize admin-authored HTML before storing or rendering on the storefront. */
export function sanitizeBlogHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return '';

  return sanitizeHtml(trimmed, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      '*': ['class', 'id'],
      a: ['href', 'target', 'rel', 'class', 'id'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
  });
}

export function isBlogHtmlContent(content: string): boolean {
  const t = content.trim();
  if (!t) return false;
  if (t.startsWith('<')) return true;
  return /<(p|h[1-6]|ul|ol|li|a|blockquote|div)\b/i.test(t);
}

export function stripHtmlForWordCount(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Table of contents entries from sanitized HTML (h2/h3). */
export function extractHeadingsFromBlogHtml(html: string): { level: 2 | 3; text: string; id: string }[] {
  const headings: { level: 2 | 3; text: string; id: string }[] = [];
  const re = /<h([23])[^>]*(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  const used = new Map<string, number>();

  while ((match = re.exec(html)) !== null) {
    const level = match[1] === '2' ? 2 : 3;
    const idAttr = match[2]?.trim();
    const text = stripHtmlForWordCount(match[3] ?? '');
    if (!text) continue;

    let id = idAttr || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ level, text, id });
  }

  return headings;
}
