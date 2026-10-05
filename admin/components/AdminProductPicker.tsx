'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export type AdminProductPickerOption = {
  _id: string;
  name: string;
  categories?: { title?: string }[];
};

type AdminProductPickerProps = {
  value: string;
  onChange: (productId: string) => void;
  /** Display name when `value` is set (e.g. from list filters). */
  selectedName?: string;
  error?: boolean;
  disabled?: boolean;
  /** Shown when no product is selected (filter mode). */
  allowEmpty?: boolean;
  emptyLabel?: string;
  placeholder?: string;
};

function categoryLine(categories: AdminProductPickerOption['categories']): string {
  const titles = (categories ?? [])
    .map((c) => c.title?.trim())
    .filter(Boolean) as string[];
  return titles.length ? titles.join(', ') : '';
}

function optionMatchesQuery(option: AdminProductPickerOption, q: string): boolean {
  const ql = q.toLowerCase();
  if (option.name.toLowerCase().includes(ql)) return true;
  return (option.categories ?? []).some((c) => (c.title ?? '').toLowerCase().includes(ql));
}

export default function AdminProductPicker({
  value,
  onChange,
  selectedName,
  error,
  disabled,
  allowEmpty = false,
  emptyLabel = 'All products',
  placeholder = 'Search by product or category name…',
}: AdminProductPickerProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<AdminProductPickerOption[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/admin/categories', { credentials: 'include' });
        const json = (await res.json()) as { success?: boolean; data?: { _id: string; title: string }[] };
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setCategories(json.data.map((c) => ({ _id: c._id, title: c.title ?? '' })));
        }
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!value) {
      setSelectedLabel('');
      return;
    }
    const inList = options.find((o) => o._id === value);
    if (inList) {
      setSelectedLabel(inList.name);
      return;
    }
    if (selectedName) setSelectedLabel(selectedName);
  }, [value, options, selectedName]);

  const searchProducts = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const trimmed = q.trim();
        const merged = new Map<string, AdminProductPickerOption>();

        const addMany = (rows: AdminProductPickerOption[]) => {
          for (const row of rows) {
            if (row._id) merged.set(row._id, row);
          }
        };

        if (trimmed.length >= 2) {
          const res = await fetch(
            `/api/admin/products?search=${encodeURIComponent(trimmed)}&limit=50`,
            { credentials: 'include' },
          );
          const json = (await res.json()) as { success?: boolean; data?: AdminProductPickerOption[] };
          if (json.success && Array.isArray(json.data)) addMany(json.data);

          const matchedCats = categories.filter((c) =>
            c.title.toLowerCase().includes(trimmed.toLowerCase()),
          );
          await Promise.all(
            matchedCats.slice(0, 5).map(async (cat) => {
              const catRes = await fetch(
                `/api/admin/products?categories=${encodeURIComponent(cat._id)}&limit=50`,
                { credentials: 'include' },
              );
              const catJson = (await catRes.json()) as {
                success?: boolean;
                data?: AdminProductPickerOption[];
              };
              if (catJson.success && Array.isArray(catJson.data)) addMany(catJson.data);
            }),
          );
        } else {
          const res = await fetch('/api/admin/products?limit=30', { credentials: 'include' });
          const json = (await res.json()) as { success?: boolean; data?: AdminProductPickerOption[] };
          if (json.success && Array.isArray(json.data)) addMany(json.data);
        }

        let list = [...merged.values()];
        if (trimmed.length >= 1) {
          list = list.filter((p) => optionMatchesQuery(p, trimmed));
        }
        list.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
        setOptions(list.slice(0, 50));
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [categories],
  );

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      void searchProducts(query);
    }, 280);
    return () => clearTimeout(timer);
  }, [open, query, searchProducts]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const displayValue = open ? query : value ? selectedLabel : '';

  const inputCls = useMemo(
    () =>
      `w-full px-3 py-2 border rounded-lg text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-[#0F4C69]/25 focus:border-[#0F4C69] ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`,
    [error, disabled],
  );

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        value={displayValue}
        placeholder={placeholder}
        onFocus={() => {
          if (disabled) return;
          setOpen(true);
          setQuery(selectedLabel);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value.trim() && allowEmpty) onChange('');
        }}
        className={inputCls}
        autoComplete="off"
      />

      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {allowEmpty ? (
            <li>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange('');
                  setSelectedLabel('');
                  setQuery('');
                  setOpen(false);
                }}
              >
                {emptyLabel}
              </button>
            </li>
          ) : null}
          {loading ? (
            <li className="px-3 py-2 text-xs text-gray-500">Searching…</li>
          ) : options.length === 0 ? (
            <li className="px-3 py-2 text-xs text-gray-500">No products found. Try another name or category.</li>
          ) : (
            options.map((p) => {
              const cat = categoryLine(p.categories);
              return (
                <li key={p._id}>
                  <button
                    type="button"
                    className={`block w-full px-3 py-2 text-left hover:bg-[#0F4C69]/5 ${
                      value === p._id ? 'bg-[#0F4C69]/10' : ''
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(p._id);
                      setSelectedLabel(p.name);
                      setQuery('');
                      setOpen(false);
                    }}
                  >
                    <span className="block text-sm font-medium text-gray-900">{p.name}</span>
                    {cat ? (
                      <span className="block text-[11px] text-gray-500">{cat}</span>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
