'use client';

import { useEffect, useId, useRef, useState } from 'react';

type CategoryRow = { _id: string; title: string };

type AdminCategoryPickerProps = {
  value: string;
  onChange: (categoryId: string) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
  placeholder?: string;
};

export default function AdminCategoryPicker({
  value,
  onChange,
  allowEmpty = true,
  emptyLabel = 'All categories',
  placeholder = 'Search category by name…',
}: AdminCategoryPickerProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/admin/categories', { credentials: 'include' });
        const json = (await res.json()) as { success?: boolean; data?: CategoryRow[] };
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setCategories(json.data.map((c) => ({ _id: c._id, title: c.title ?? '' })));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = categories.find((c) => c._id === value);
  const q = query.trim().toLowerCase();
  const filtered = categories.filter((c) => !q || c.title.toLowerCase().includes(q));

  const displayValue = open ? query : selected?.title ?? '';

  return (
    <div ref={rootRef} className="relative w-full md:w-52">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        value={displayValue}
        placeholder={placeholder}
        onFocus={() => {
          setOpen(true);
          setQuery(selected?.title ?? '');
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0F4C69]/30 focus:border-[#0F4C69]"
        autoComplete="off"
      />
      {open ? (
        <ul
          id={listId}
          className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {allowEmpty ? (
            <li>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange('');
                  setQuery('');
                  setOpen(false);
                }}
              >
                {emptyLabel}
              </button>
            </li>
          ) : null}
          {loading ? (
            <li className="px-3 py-2 text-xs text-gray-500">Loading…</li>
          ) : filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-gray-500">No categories match.</li>
          ) : (
            filtered.map((c) => (
              <li key={c._id}>
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#0F4C69]/5 ${
                    value === c._id ? 'bg-[#0F4C69]/10 font-medium' : ''
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(c._id);
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  {c.title}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
