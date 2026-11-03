import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category.model';
import { getStorefrontCategoriesServer } from '@/backend/lib/getStorefrontCategoriesServer';
import {
  PUBLIC_PRODUCTS_PAGE_LIMIT,
  type PublicProductsQuery,
  type PublicProductsQueryResult,
} from '@/backend/lib/queryPublicProducts';
import { getPublicProductsCached } from '@/lib/server/cachedPublicProducts';
import type { StorefrontCategory } from '@/lib/storefrontCategories';

const SORT_MAP: Record<string, string> = {
  random: 'random',
  newest: 'newest',
  name: 'name_asc',
  'price-low': 'price_asc',
  'price-high': 'price_desc',
};

function spString(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v[0] ?? '';
  return '';
}

async function categoryTitleForSlug(slug: string): Promise<string | null> {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  if (!normalized) return null;
  const cat = await Category.findOne({
    slug: normalized,
    status: { $ne: 'inactive' },
  })
    .select('title')
    .lean();
  return cat?.title?.trim() || null;
}

export type ProductsListingSsrPayload = {
  categories: StorefrontCategory[];
  listing: PublicProductsQueryResult;
};

/** Build the first-paint listing query from URL (matches storefront defaults). */
export async function loadProductsListingForPage(options: {
  searchParams: Record<string, string | string[] | undefined>;
  categorySlugFromPath?: string;
  usedCatalog?: boolean;
}): Promise<ProductsListingSsrPayload> {
  await connectDB();

  const categories = await getStorefrontCategoriesServer();
  const sp = options.searchParams;

  const search = spString(sp, 'search').trim();
  const page = Math.max(1, parseInt(spString(sp, 'page') || '1', 10));
  const sortUi = spString(sp, 'sort') || 'random';
  const sortBy = SORT_MAP[sortUi] ?? 'newest';

  let categoryTitle = spString(sp, 'category').trim();
  if (!categoryTitle && !search && options.categorySlugFromPath) {
    categoryTitle = (await categoryTitleForSlug(options.categorySlugFromPath)) ?? '';
  }

  const query: PublicProductsQuery = {
    page,
    limit: PUBLIC_PRODUCTS_PAGE_LIMIT,
    search,
    categoryTitle: search ? '' : categoryTitle,
    minPrice: parseFloat(spString(sp, 'minPrice') || '0') || 0,
    maxPrice: parseFloat(spString(sp, 'maxPrice') || '0') || 0,
    brandsRaw: spString(sp, 'brands'),
    featsRaw: spString(sp, 'features'),
    sortBy,
    usedOnly: options.usedCatalog ?? false,
  };

  if (sortBy === 'random') {
    const seedRaw = parseInt(spString(sp, 'seed') || '', 10);
    query.seed = Number.isFinite(seedRaw) ? seedRaw : 1;
  }

  const listing = await getPublicProductsCached(query);

  return { categories, listing };
}
