'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { blogDetailPath } from '@/lib/siteRoutes';

type InternalLinkOption = {
  id: string;
  title: string;
  slug: string;
};

type BlogRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  /** Current post id — exclude from internal link list when editing. */
  excludePostId?: string;
};

const btnClass =
  'rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40';

export default function BlogRichTextEditor({
  value,
  onChange,
  disabled,
  excludePostId,
}: BlogRichTextEditorProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkMode, setLinkMode] = useState<'internal' | 'external'>('external');
  const [externalUrl, setExternalUrl] = useState('https://');
  const [internalPosts, setInternalPosts] = useState<InternalLinkOption[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');
  const [selectedInternalSlug, setSelectedInternalSlug] = useState('');

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-[#0F4C69] underline hover:text-[#E36630]',
        },
      }),
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: value || '<p></p>',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[220px] px-3 py-2 focus:outline-none md:prose-base [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_a]:text-[#0F4C69] [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-[#0F4C69]/30 [&_blockquote]:pl-4',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '<p></p>';
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  const openLinkDialog = useCallback(async () => {
    if (!editor || disabled) return;

    const prev = editor.getAttributes('link').href as string | undefined;
    if (prev?.startsWith('/')) {
      setLinkMode('internal');
      setSelectedInternalSlug(prev.replace(/^\/blog\//, '').split(/[?#]/)[0] ?? '');
      setExternalUrl('https://');
    } else {
      setLinkMode('external');
      setExternalUrl(prev && prev !== '#' ? prev : 'https://');
      setSelectedInternalSlug('');
    }

    setLinkOpen(true);
    setInternalLoading(true);
    try {
      const res = await fetch('/api/admin/blogs', { credentials: 'include' });
      const json = (await res.json()) as {
        success?: boolean;
        data?: { id: string; title: string; slug: string }[];
      };
      if (json.success && Array.isArray(json.data)) {
        setInternalPosts(
          json.data
            .filter((p) => p.id !== excludePostId)
            .map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
        );
      }
    } catch {
      setInternalPosts([]);
    } finally {
      setInternalLoading(false);
    }
  }, [editor, disabled, excludePostId]);

  const applyLink = () => {
    if (!editor) return;

    let href = '';
    if (linkMode === 'internal') {
      if (!selectedInternalSlug) return;
      href = blogDetailPath(selectedInternalSlug);
    } else {
      const url = externalUrl.trim();
      if (!url || url === 'https://') return;
      href = url;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href,
        target: linkMode === 'external' ? '_blank' : null,
        rel: linkMode === 'external' ? 'noopener noreferrer' : null,
      })
      .run();
    setLinkOpen(false);
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
    setLinkOpen(false);
  };

  const filteredInternal = internalPosts.filter((p) =>
    p.title.toLowerCase().includes(internalQuery.trim().toLowerCase()),
  );

  if (!editor) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {!disabled ? (
        <div className="flex flex-wrap gap-1 border-b border-gray-100 bg-gray-50 px-2 py-2">
          <button
            type="button"
            className={btnClass}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </button>
          <button
            type="button"
            className={btnClass}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type="button"
            className={btnClass}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </button>
          <button type="button" className={btnClass} onClick={() => editor.chain().focus().toggleBold().run()}>
            Bold
          </button>
          <button type="button" className={btnClass} onClick={() => editor.chain().focus().toggleItalic().run()}>
            Italic
          </button>
          <button type="button" className={btnClass} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            Bullets
          </button>
          <button type="button" className={btnClass} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            Numbered
          </button>
          <button type="button" className={btnClass} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            Quote
          </button>
          <button type="button" className={btnClass} onClick={() => void openLinkDialog()}>
            Link
          </button>
          <button type="button" className={btnClass} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
            Clear
          </button>
        </div>
      ) : null}

      <EditorContent editor={editor} />

      {linkOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-sm font-bold text-gray-900">Insert link</h3>
            <p className="mt-1 text-xs text-gray-500">Select text first, then add an internal or external URL.</p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  linkMode === 'internal' ? 'bg-[#0F4C69] text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setLinkMode('internal')}
              >
                Internal
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  linkMode === 'external' ? 'bg-[#0F4C69] text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setLinkMode('external')}
              >
                External
              </button>
            </div>

            {linkMode === 'external' ? (
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-gray-700">URL</label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="https://example.com"
                />
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <input
                  type="search"
                  value={internalQuery}
                  onChange={(e) => setInternalQuery(e.target.value)}
                  placeholder="Search posts…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-100">
                  {internalLoading ? (
                    <p className="px-3 py-2 text-xs text-gray-500">Loading posts…</p>
                  ) : filteredInternal.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-gray-500">No posts found.</p>
                  ) : (
                    filteredInternal.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedInternalSlug(p.slug)}
                        className={`block w-full border-b border-gray-50 px-3 py-2 text-left text-xs hover:bg-gray-50 ${
                          selectedInternalSlug === p.slug ? 'bg-[#0F4C69]/10 font-semibold text-[#0F4C69]' : 'text-gray-800'
                        }`}
                      >
                        {p.title}
                        <span className="mt-0.5 block text-[10px] font-normal text-gray-400">/blog/{p.slug}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" className={btnClass} onClick={() => setLinkOpen(false)}>
                Cancel
              </button>
              <button type="button" className={btnClass} onClick={removeLink}>
                Remove link
              </button>
              <button
                type="button"
                className="rounded-md bg-[#E36630] px-3 py-1 text-xs font-bold text-white hover:bg-[#cc5a2a]"
                onClick={applyLink}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
