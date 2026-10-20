import mongoose from 'mongoose';
import {
  MAIN_CATALOG_FILTER,
  USED_EQUIPMENT_FILTER,
} from '@/backend/lib/productTypeFilters';
import { PRODUCT_BRAND_KEYS } from '@/backend/lib/productMarketingFields';

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Strip wrapping quotes and extra whitespace from dashboard search. */
export function normalizeAdminSearchQuery(raw: string): string {
  return raw
    .trim()
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Minimum relevance score (0–200) to include in fuzzy admin search results. */
export const ADMIN_SEARCH_MIN_SCORE = 50;

export function getProductTypeFilter(productType: string): Record<string, unknown> | null {
  if (productType === 'main') return { ...MAIN_CATALOG_FILTER };
  if (productType === 'used') return { ...USED_EQUIPMENT_FILTER };
  return null;
}

function searchOrConditions(trimmedSearch: string): Record<string, unknown>[] {
  const escaped = escapeRegex(trimmedSearch);
  const orConditions: Record<string, unknown>[] = [
    { name: { $regex: escaped, $options: 'i' } },
    { slug: { $regex: escaped, $options: 'i' } },
    { metaTitle: { $regex: escaped, $options: 'i' } },
    { about: { $regex: escaped, $options: 'i' } },
    { brands: { $elemMatch: { $regex: escaped, $options: 'i' } } },
  ];

  if (
    mongoose.Types.ObjectId.isValid(trimmedSearch) &&
    String(new mongoose.Types.ObjectId(trimmedSearch)) === trimmedSearch
  ) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(trimmedSearch) });
  } else if (/^[a-f0-9]{4,24}$/i.test(trimmedSearch)) {
    orConditions.push({
      $expr: {
        $regexMatch: {
          input: { $toString: '$_id' },
          regex: escaped,
          options: 'i',
        },
      },
    });
  }

  const tokens = trimmedSearch.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length > 1) {
    orConditions.push({
      $and: tokens.map((token) => ({
        $or: [
          { name: { $regex: escapeRegex(token), $options: 'i' } },
          { slug: { $regex: escapeRegex(token), $options: 'i' } },
        ],
      })),
    });
  }

  return orConditions;
}

/** Combine catalog, search, status, category, and stock into one Mongo filter. */
export function buildAdminProductListFilter(options: {
  search?: string;
  productType?: string;
  status?: string;
  stock?: string;
  categoryId?: string;
  categoryIdsParam?: string;
  brand?: string;
  /** When true, category filters are ignored (text search spans all categories). */
  ignoreCategory?: boolean;
}): Record<string, unknown> {
  const clauses: Record<string, unknown>[] = [];

  const typeFilter = getProductTypeFilter(options.productType ?? 'all');
  if (typeFilter) clauses.push(typeFilter);

  const trimmedSearch = normalizeAdminSearchQuery(options.search ?? '');
  if (trimmedSearch) {
    clauses.push({ $or: searchOrConditions(trimmedSearch) });
  }

  if (options.status && options.status !== 'all') {
    clauses.push({ status: options.status });
  }

  if (!options.ignoreCategory) {
    if (options.categoryIdsParam) {
      const ids = options.categoryIdsParam
        .split(',')
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (ids.length) {
        clauses.push({ categories: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) } });
      }
    } else if (options.categoryId && mongoose.Types.ObjectId.isValid(options.categoryId)) {
      clauses.push({ categories: new mongoose.Types.ObjectId(options.categoryId) });
    }
  }

  if (options.stock === 'in_stock') clauses.push({ stock: { $gt: 0 } });
  if (options.stock === 'out_of_stock') clauses.push({ stock: { $lte: 0 } });

  const brand = (options.brand ?? 'all').trim().toLowerCase();
  if (brand !== 'all' && (PRODUCT_BRAND_KEYS as readonly string[]).includes(brand)) {
    clauses.push({ brands: brand });
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) row[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[b.length];
}

export function productSearchRelevanceScore(query: string, name: string, slug: string): number {
  const q = query.toLowerCase().trim();
  const n = name.toLowerCase();
  const s = slug.toLowerCase();
  if (!q) return 0;

  if (n === q || s === q) return 200;
  if (n.startsWith(q)) return 150;
  if (n.includes(q)) return 120;
  if (s.includes(q)) return 110;

  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length > 1 && tokens.every((t) => n.includes(t))) return 100;

  const distName = levenshtein(q, n.slice(0, Math.min(n.length, q.length + 15)));
  const simName = 1 - distName / Math.max(q.length, n.length, 1);
  if (simName >= 0.72) return Math.round(simName * 90);

  let bestWord = 0;
  for (const word of n.split(/[\s\-_/]+/)) {
    if (word.length < q.length) continue;
    if (word.includes(q)) {
      bestWord = Math.max(bestWord, 0.92);
      continue;
    }
    if (word.length < 3) continue;
    const d = levenshtein(q, word);
    const sim = 1 - d / Math.max(q.length, word.length, 1);
    if (sim > bestWord) bestWord = sim;
  }
  if (bestWord >= 0.75) return Math.round(bestWord * 80);

  const distSlug = levenshtein(q.replace(/\s+/g, '-'), s.slice(0, Math.min(s.length, q.length + 15)));
  const simSlug = 1 - distSlug / Math.max(q.length, s.length, 1);
  if (simSlug >= 0.7) return Math.round(simSlug * 75);

  return 0;
}

const FUZZY_CANDIDATE_CAP = 4000;

/** When strict regex finds nothing, rank by relevance (typos, partial words). */
type ProductSearchCandidate = {
  _id: mongoose.Types.ObjectId;
  name?: string;
  slug?: string;
};

export async function fuzzyAdminProductIds(
  findCandidates: (filter: Record<string, unknown>) => Promise<ProductSearchCandidate[]>,
  baseFilter: Record<string, unknown>,
  query: string,
  skip: number,
  limit: number,
): Promise<{ ids: mongoose.Types.ObjectId[]; total: number }> {
  const q = normalizeAdminSearchQuery(query);
  if (q.length < 2) return { ids: [], total: 0 };

  const candidates = await findCandidates(baseFilter);

  const scored = candidates
    .map((p) => ({
      id: p._id,
      score: productSearchRelevanceScore(q, p.name ?? '', p.slug ?? ''),
    }))
    .filter((x) => x.score >= ADMIN_SEARCH_MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  const total = scored.length;
  const ids = scored.slice(skip, skip + limit).map((x) => x.id);
  return { ids, total };
}

export function rankProductCandidatesBySearch(
  query: string,
  candidates: ProductSearchCandidate[],
  skip: number,
  limit: number,
  minScore = ADMIN_SEARCH_MIN_SCORE,
): { ids: mongoose.Types.ObjectId[]; total: number } {
  const q = normalizeAdminSearchQuery(query);
  if (q.length < 2) return { ids: [], total: 0 };

  const scored = candidates
    .map((p) => ({
      id: p._id,
      score: productSearchRelevanceScore(q, p.name ?? '', p.slug ?? ''),
    }))
    .filter((x) => x.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return {
    total: scored.length,
    ids: scored.slice(skip, skip + limit).map((x) => x.id),
  };
}

export function sortProductsByIdOrder<T extends { _id: unknown }>(products: T[], ids: mongoose.Types.ObjectId[]): T[] {
  const order = new Map(ids.map((id, i) => [String(id), i]));
  return [...products].sort(
    (a, b) => (order.get(String(a._id)) ?? 9999) - (order.get(String(b._id)) ?? 9999),
  );
}
