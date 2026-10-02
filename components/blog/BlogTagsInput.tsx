'use client';

import { useState } from 'react';
import { BLOG_MAX_TAGS, BLOG_TAG_MAX } from '@/lib/blogTags';

type BlogTagsInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  disabled?: boolean;
};

export default function BlogTagsInput({ tags, onChange, suggestions, disabled }: BlogTagsInputProps) {
  const [draft, setDraft] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/\s+/g, ' ').slice(0, BLOG_TAG_MAX);
    if (!tag) return;
    const key = tag.toLowerCase();
    if (tags.some((t) => t.toLowerCase() === key)) return;
    if (tags.length >= BLOG_MAX_TAGS) return;
    onChange([...tags, tag]);
    setDraft('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-[#0F4C69]/10 px-2.5 py-1 text-xs font-semibold text-[#0F4C69]"
          >
            {tag}
            {!disabled ? (
              <button
                type="button"
                aria-label={`Remove tag ${tag}`}
                className="text-[#0F4C69]/70 hover:text-red-600"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
              >
                ×
              </button>
            ) : null}
          </span>
        ))}
      </div>

      {!disabled ? (
        <>
          <div className="mt-2 flex gap-2">
            <input
              list="blog-tag-suggestions"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(draft);
                }
              }}
              placeholder="Add tag and press Enter"
              maxLength={BLOG_TAG_MAX}
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => addTag(draft)}
              className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Add
            </button>
          </div>
          <datalist id="blog-tag-suggestions">
            {suggestions.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <p className="mt-1 text-xs text-gray-500">
            Like categories — pick a suggestion or type a new tag (max {BLOG_MAX_TAGS}).
          </p>
        </>
      ) : null}
    </div>
  );
}
