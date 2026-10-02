'use client';

import { useEffect, useRef, useState } from 'react';
import { compressImage, uploadMedia } from '@/utils/uploadMedia';
import { cloudinaryUrlFromPublicId } from '@/utils/productMedia.util';
import {
  emptyMediaSlot,
  initMediaSlot,
  type AdminMediaSlot,
} from '@/utils/adminMediaSlot';
import BlogRichTextEditor from '@/components/blog/BlogRichTextEditor';
import BlogTagsInput from '@/components/blog/BlogTagsInput';
import {
  BLOG_CATEGORY_MAX,
  BLOG_EXCERPT_MAX,
  BLOG_TITLE_MAX,
  type BlogPost,
} from '@/lib/blog.types';
import { normalizeBlogSlug, slugFromBlogTitle } from '@/lib/blogSlug';
import { BLOG_PATH } from '@/lib/siteRoutes';

export type AdminBlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  status: 'active' | 'inactive';
  publishedAt: string;
};

export type AdminBlogSavePayload = AdminBlogForm & {
  coverImage: string;
  coverImagePublicId: string;
};

export function emptyBlogForm(): AdminBlogForm {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '<p></p>',
    author: 'Ambassador Team',
    category: '',
    tags: [],
    status: 'active',
    publishedAt: today,
  };
}

export function blogToForm(post: BlogPost): AdminBlogForm {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: post.category ?? '',
    tags: post.tags ?? [],
    status: post.status,
    publishedAt: post.publishedAt.slice(0, 10),
  };
}

type AdminBlogModalProps = {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  form: AdminBlogForm;
  setForm: React.Dispatch<React.SetStateAction<AdminBlogForm>>;
  sourcePost: BlogPost | null;
  error: string | null;
  submitting: boolean;
  onClose: () => void;
  onSave: (payload: AdminBlogSavePayload) => Promise<void>;
  canChangeStatus: boolean;
  /** Preset + categories already used on other posts (for datalist suggestions). */
  categorySuggestions: string[];
  tagSuggestions: string[];
};

/** Blog cards/detail never need full 1920px — smaller file uploads faster. */
const BLOG_COVER_MAX_PX = 1200;

export default function AdminBlogModal({
  open,
  mode,
  form,
  setForm,
  sourcePost,
  error,
  submitting,
  onClose,
  onSave,
  canChangeStatus,
  categorySuggestions,
  tagSuggestions,
}: AdminBlogModalProps) {
  const [coverSlot, setCoverSlot] = useState<AdminMediaSlot>(emptyMediaSlot());
  const [coverUploadPct, setCoverUploadPct] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const uploadTaskRef = useRef<Promise<{ url: string; publicId: string }> | null>(null);
  const coverUploadGenRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    coverUploadGenRef.current += 1;
    uploadTaskRef.current = null;
    if (sourcePost) {
      setCoverSlot(
        initMediaSlot(sourcePost.coverImage, sourcePost.coverImagePublicId),
      );
    } else {
      setCoverSlot(emptyMediaSlot());
    }
    setCoverUploadPct(null);
    setUploadStatus('');
    setLocalError(null);
  }, [open, sourcePost?.id, mode]);

  if (!open) return null;

  const readOnly = mode === 'view';
  const title = mode === 'add' ? 'Add Blog Post' : mode === 'edit' ? 'Edit Blog Post' : 'Blog Post';
  const busy = submitting || saving;

  const uploadCoverFile = async (
    file: File,
    taskId: number,
  ): Promise<{ url: string; publicId: string }> => {
    const prepared = await compressImage(file, BLOG_COVER_MAX_PX, 0.85);
    return uploadMedia(
      prepared,
      (pct) => {
        if (coverUploadGenRef.current === taskId) setCoverUploadPct(pct);
      },
      { preferServer: true },
    );
  };

  const startCoverUpload = (file: File) => {
    const taskId = ++coverUploadGenRef.current;
    setCoverSlot({
      url: '',
      publicId: '',
      file,
      preview: URL.createObjectURL(file),
    });
    setCoverUploadPct(0);
    setUploadStatus('Uploading cover…');
    setLocalError(null);

    const task = uploadCoverFile(file, taskId);
    uploadTaskRef.current = task;

    void task
      .then((result) => {
        if (coverUploadGenRef.current !== taskId) return;
        setCoverSlot({
          url: result.url,
          publicId: result.publicId,
          file: null,
          preview: result.url,
        });
        setUploadStatus('Cover uploaded');
        setCoverUploadPct(null);
      })
      .catch((e) => {
        if (coverUploadGenRef.current !== taskId) return;
        setLocalError(e instanceof Error ? e.message : 'Cover upload failed.');
        setUploadStatus('');
        setCoverUploadPct(null);
      })
      .finally(() => {
        if (coverUploadGenRef.current === taskId) uploadTaskRef.current = null;
      });
  };

  const clearCover = () => {
    coverUploadGenRef.current += 1;
    uploadTaskRef.current = null;
    setCoverSlot(emptyMediaSlot());
    setCoverUploadPct(null);
    setUploadStatus('');
  };

  const resolveCoverForSave = async (): Promise<{ url: string; publicId: string }> => {
    if (coverSlot.url || coverSlot.publicId) {
      const url =
        coverSlot.url || cloudinaryUrlFromPublicId(coverSlot.publicId, 'image') || '';
      return { url, publicId: coverSlot.publicId };
    }

    if (coverSlot.file) {
      if (uploadTaskRef.current) {
        setUploadStatus('Finishing cover upload…');
        return uploadTaskRef.current;
      }
      setCoverUploadPct(0);
      setUploadStatus('Uploading cover…');
      const taskId = ++coverUploadGenRef.current;
      const result = await uploadCoverFile(coverSlot.file, taskId);
      setCoverUploadPct(null);
      setCoverSlot({
        url: result.url,
        publicId: result.publicId,
        file: null,
        preview: result.url,
      });
      setUploadStatus('Cover uploaded');
      return result;
    }

    return { url: '', publicId: '' };
  };

  const handleSubmit = async () => {
    setLocalError(null);

    const title = form.title.trim();
    const excerpt = form.excerpt.trim();
    if (!title) {
      setLocalError('Title is required.');
      return;
    }
    if (!excerpt) {
      setLocalError('Excerpt is required.');
      return;
    }
    const contentPlain = form.content.replace(/<[^>]+>/g, ' ').trim();
    if (!contentPlain) {
      setLocalError('Content is required.');
      return;
    }
    if (title.length > BLOG_TITLE_MAX) {
      setLocalError(`Title cannot exceed ${BLOG_TITLE_MAX} characters.`);
      return;
    }
    if (excerpt.length > BLOG_EXCERPT_MAX) {
      setLocalError(
        `Excerpt is too long (${excerpt.length}/${BLOG_EXCERPT_MAX}). Use a short summary — full text goes in Content.`,
      );
      return;
    }
    const category = form.category.trim();
    if (category.length > BLOG_CATEGORY_MAX) {
      setLocalError(`Category cannot exceed ${BLOG_CATEGORY_MAX} characters.`);
      return;
    }

    setSaving(true);
    try {
      const cover = await resolveCoverForSave();
      setUploadStatus('Saving post…');

      const slug = normalizeBlogSlug(form.slug.trim() || slugFromBlogTitle(form.title));
      if (!slug) {
        setLocalError('Permalink is required.');
        return;
      }

      await onSave({
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        author: form.author.trim() || 'Ambassador Team',
        category,
        tags: form.tags,
        status: form.status,
        publishedAt: form.publishedAt,
        coverImage: cover.url,
        coverImagePublicId: cover.publicId,
      });
      setUploadStatus('');
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Save failed.');
      setUploadStatus('');
    } finally {
      setSaving(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {displayError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {displayError}
            </div>
          ) : null}

          {/* Cover image — same pattern as product modal media upload */}
          <div className="rounded-xl bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Cover Image</h3>
            {!readOnly ? (
              <>
                <div className="relative flex h-28 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white transition-colors hover:border-[#0F4C69] hover:bg-[#0F4C69]/5">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) startCoverUpload(file);
                      e.target.value = '';
                    }}
                  />
                  <div className="pointer-events-none flex flex-col items-center justify-center">
                    <svg className="mb-1 h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500">+ Add Cover Image</span>
                    <span className="text-xs text-gray-400">JPEG · PNG · WebP · max 5 MB</span>
                  </div>
                </div>

                {coverSlot.preview ? (
                  <div className="mt-3 flex gap-2">
                    <div className="group relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      <img src={coverSlot.preview} alt="Cover preview" className="h-full w-full object-cover" />
                      {coverUploadPct != null ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                          <span className="text-[10px] font-bold text-white">{coverUploadPct}%</span>
                          <div className="mt-1 h-1 w-12 overflow-hidden rounded-full bg-white/30">
                            <div
                              className="h-full rounded-full bg-[#E36630] transition-all duration-150"
                              style={{ width: `${coverUploadPct}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={clearCover}
                        className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : coverSlot.preview ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img src={coverSlot.preview} alt="Cover" className="max-h-48 w-full object-cover" />
              </div>
            ) : (
              <p className="text-sm text-gray-400">No cover image</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Title</label>
            <input
              disabled={readOnly}
              maxLength={BLOG_TITLE_MAX}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Permalink</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="shrink-0 text-xs text-gray-500">
                {BLOG_PATH}/
              </span>
              <input
                disabled={readOnly}
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: normalizeBlogSlug(e.target.value) }))
                }
                placeholder="my-post-url"
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
              />
              {!readOnly ? (
                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  onClick={() =>
                    setForm((f) => ({ ...f, slug: slugFromBlogTitle(f.title) }))
                  }
                >
                  From title
                </button>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Public URL for this post. Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Author</label>
              <input
                disabled={readOnly}
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Publish date</label>
              <input
                type="date"
                disabled={readOnly}
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Category</label>
              <input
                disabled={readOnly}
                list="blog-category-suggestions"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Type a new category or pick a suggestion"
                maxLength={BLOG_CATEGORY_MAX}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
              />
              <datalist id="blog-category-suggestions">
                {categorySuggestions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {!readOnly ? (
                <p className="mt-1 text-xs text-gray-500">
                  Select from suggestions or enter a new category name.
                </p>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Status</label>
              <select
                disabled={readOnly || !canChangeStatus}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value === 'inactive' ? 'inactive' : 'active' }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
              >
                <option value="active">Active (published)</option>
                <option value="inactive">Inactive (hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Tags</label>
            <BlogTagsInput
              tags={form.tags}
              onChange={(tags) => setForm((f) => ({ ...f, tags }))}
              suggestions={tagSuggestions}
              disabled={readOnly}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-gray-700">Excerpt</label>
              {!readOnly ? (
                <span
                  className={`text-xs tabular-nums ${
                    form.excerpt.length > BLOG_EXCERPT_MAX ? 'font-semibold text-red-600' : 'text-gray-400'
                  }`}
                >
                  {form.excerpt.length}/{BLOG_EXCERPT_MAX}
                </span>
              ) : null}
            </div>
            <p className="mb-2 text-xs text-gray-500">
              Short summary for blog cards (not the full article — use Content below for that).
            </p>
            <textarea
              disabled={readOnly}
              rows={3}
              maxLength={BLOG_EXCERPT_MAX}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Content</label>
            <p className="mb-2 text-xs text-gray-500">
              WordPress-style editor — use H1/H2/H3, lists, and Link for internal posts or external URLs.
            </p>
            <BlogRichTextEditor
              value={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
              disabled={readOnly}
              excludePostId={sourcePost?.id}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-6 py-4">
          <div className="text-xs text-gray-400">{uploadStatus}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {!readOnly ? (
              <button
                type="button"
                disabled={busy || coverUploadPct != null}
                onClick={() => void handleSubmit()}
                className="rounded-lg bg-[#0F4C69] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d4259] disabled:opacity-50"
              >
                {busy
                  ? uploadStatus || 'Saving…'
                  : coverUploadPct != null
                    ? 'Uploading cover…'
                    : mode === 'add'
                      ? 'Create Post'
                      : 'Save Changes'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
