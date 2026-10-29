import { permanentRedirect } from 'next/navigation';
import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category.model';
import ProductsPage from '@/client/pages/products/ProductsPage';
import { loadProductsListingForPage } from '@/lib/server/productsListingSsr';
import { usedEquipmentCategoryPath } from '@/lib/siteRoutes';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** /used-equipment — pre-owned listing. ?category=Title redirects to /used-equipment/[slug]. */
export default async function UsedEquipmentListingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const categoryTitle = typeof sp.category === 'string' ? sp.category.trim() : '';

  if (categoryTitle) {
    await connectDB();
    const cat = await Category.findOne({
      title: { $regex: new RegExp(`^${escapeRegex(categoryTitle)}$`, 'i') },
      status: { $ne: 'inactive' },
    })
      .select('slug')
      .lean();

    if (cat?.slug) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(sp)) {
        if (key === 'category') continue;
        if (typeof value === 'string') params.set(key, value);
        else if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      }
      const qs = params.toString();
      permanentRedirect(
        qs ? `${usedEquipmentCategoryPath(cat.slug)}?${qs}` : usedEquipmentCategoryPath(cat.slug),
      );
    }
  }

  const { categories, listing } = await loadProductsListingForPage({
    searchParams: sp,
    usedCatalog: true,
  });

  return (
    <ProductsPage
      catalog="used"
      initialCategories={categories}
      initialListing={{
        rows: listing.data,
        total: listing.total,
        totalPages: listing.totalPages,
        page: listing.page,
      }}
    />
  );
}
