import { revalidatePath } from 'next/cache';
import {
  productDetailPath,
  productUrlSegment,
  productsCategoryPath,
  usedEquipmentCategoryPath,
} from '@/lib/siteRoutes';

type CategoryRef = { slug?: string | null };

/** Bust cached HTML for a product and related listing URLs after admin changes. */
export function revalidateStorefrontProduct(product: {
  _id: string | { toString(): string };
  slug?: string | null;
  status?: string;
  categories?: CategoryRef[];
}) {
  const segment = productUrlSegment({
    _id: String(product._id),
    slug: product.slug ?? undefined,
  });

  if (product.status === 'active' && segment) {
    revalidatePath(productDetailPath(segment));
  }

  revalidatePath('/products');
  revalidatePath('/used-equipment');

  for (const cat of product.categories ?? []) {
    const slug = typeof cat.slug === 'string' ? cat.slug.trim().toLowerCase() : '';
    if (!slug) continue;
    revalidatePath(productsCategoryPath(slug));
    revalidatePath(usedEquipmentCategoryPath(slug));
  }
}
