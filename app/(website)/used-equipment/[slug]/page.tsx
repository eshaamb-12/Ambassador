import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category.model';
import { findActiveProductByIdentifier } from '@/backend/lib/findPublicProduct';
import ProductsPage from '@/client/pages/products/ProductsPage';
import { loadProductsListingForPage } from '@/lib/server/productsListingSsr';
import { productDetailPath, productUrlSegment, usedEquipmentCategoryPath } from '@/lib/siteRoutes';
import { absoluteUrl, canonicalMetadata } from '@/lib/siteUrl';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function findActiveCategoryBySlug(slug: string) {
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  if (!decoded) return null;
  return Category.findOne({
    slug: decoded,
    status: { $ne: 'inactive' },
  })
    .select('title metaTitle slug')
    .lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug).trim();

  try {
    await connectDB();

    const category = await findActiveCategoryBySlug(decoded);
    if (category?.slug) {
      const canonicalPath = usedEquipmentCategoryPath(category.slug);
      const title =
        category.metaTitle?.trim() ||
        `${category.title} | Used Equipment | Ambassador Commercial Kitchen Equipment`;
      const description = `Browse pre-owned ${category.title} — used commercial kitchen equipment at Ambassador.`;

      return {
        title,
        description,
        ...canonicalMetadata(canonicalPath),
        openGraph: {
          title,
          description,
          url: absoluteUrl(canonicalPath),
        },
      };
    }
  } catch (error) {
    console.error('[used-equipment/[slug] generateMetadata]', error);
  }

  return { title: 'Used Equipment | Ambassador Commercial Kitchen Equipment' };
}

/** /used-equipment/[slug] — category listing; product slugs redirect to /products/[slug]. */
export default async function UsedEquipmentSegmentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const decoded = decodeURIComponent(slug).trim();

  await connectDB();

  const category = await findActiveCategoryBySlug(decoded);
  if (category?.slug) {
    const { categories, listing } = await loadProductsListingForPage({
      searchParams: sp,
      categorySlugFromPath: category.slug,
      usedCatalog: true,
    });

    return (
      <ProductsPage
        catalog="used"
        categorySlugFromPath={category.slug}
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

  const product = await findActiveProductByIdentifier(decoded);
  if (product) {
    permanentRedirect(productDetailPath(productUrlSegment(product)));
  }

  notFound();
}
