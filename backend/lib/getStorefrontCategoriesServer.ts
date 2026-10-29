import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category.model';
import { categoryListSort, ensureCategorySortOrders } from '@/backend/lib/categoryOrder';
import { sortStorefrontCategories, type StorefrontCategory } from '@/lib/storefrontCategories';

/** Active categories for storefront (SSR — no /api call). */
export async function getStorefrontCategoriesServer(): Promise<StorefrontCategory[]> {
  await connectDB();
  await ensureCategorySortOrders();

  const categories = await Category.find({
    $nor: [{ status: { $regex: /^inactive$/i } }],
  })
    .select('title slug image sortOrder')
    .sort(categoryListSort)
    .lean();

  return sortStorefrontCategories(
    categories.map((c) => ({
      _id: String(c._id),
      title: c.title ?? '',
      slug: (c.slug ?? '').trim().toLowerCase(),
      image: c.image,
      sortOrder: c.sortOrder,
    })),
  ).filter((c) => c.title && c.slug);
}
