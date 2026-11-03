import { unstable_cache } from 'next/cache';
import connectDB from '@/backend/config/db';
import {
  queryPublicProducts,
  type PublicProductsQuery,
  type PublicProductsQueryResult,
} from '@/backend/lib/queryPublicProducts';

/** Cached storefront listing (invalidated on admin product changes). */
export async function getPublicProductsCached(
  query: PublicProductsQuery,
): Promise<PublicProductsQueryResult> {
  await connectDB();
  const key = JSON.stringify(query);
  return unstable_cache(async () => queryPublicProducts(query), ['storefront-products', key], {
    revalidate: 120,
    tags: ['storefront-products'],
  })();
}
