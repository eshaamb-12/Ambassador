'use client';

import { useEffect, useState } from 'react';
import {
  fetchStorefrontCategories,
  type StorefrontCategory,
} from '@/lib/storefrontCategories';

export function useStorefrontCategories(initial?: StorefrontCategory[]) {
  const [categories, setCategories] = useState<StorefrontCategory[]>(initial ?? []);
  const [loading, setLoading] = useState(!initial?.length);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (initial?.length) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchStorefrontCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initial]);

  return { categories, loading };
}
