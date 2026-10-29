import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category.model';
import { getPublicProductDetail } from '@/backend/lib/getPublicProductDetail';
import { findActiveProductByIdentifier } from '@/backend/lib/findPublicProduct';
import ProductsPage from '@/client/pages/products/ProductsPage';
import ProductDetailPage from '@/client/pages/products/ProductDetailPage';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import { loadProductsListingForPage } from '@/lib/server/productsListingSsr';
import { productDetailPath, productUrlSegment, productsCategoryPath } from '@/lib/siteRoutes';
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
      const canonicalPath = productsCategoryPath(category.slug);
      const title =
        category.metaTitle?.trim() ||
        `${category.title} | Products | Ambassador Commercial Kitchen Equipment`;
      const description = `Browse ${category.title} — commercial kitchen equipment at Ambassador Commercial Kitchen Equipment.`;

      return {
        title,
        description,
        robots: { index: true, follow: true },
        ...canonicalMetadata(canonicalPath),
        openGraph: {
          title,
          description,
          url: absoluteUrl(canonicalPath),
        },
      };
    }

    const product = await findActiveProductByIdentifier(decoded);
    if (product) {
      const canonicalPath = productDetailPath(productUrlSegment(product));
      const title = product.metaTitle?.trim() || `${product.name} | Ambassador Commercial Kitchen Equipment`;
      const description =
        product.metaDescription?.trim() ||
        (product.about?.trim() ? product.about.trim().slice(0, 160) : `Buy ${product.name} from Ambassador Commercial Kitchen Equipment.`);

      return {
        title,
        description,
        robots: { index: true, follow: true },
        ...canonicalMetadata(canonicalPath),
        openGraph: {
          title,
          description,
          url: absoluteUrl(canonicalPath),
        },
      };
    }
  } catch (error) {
    console.error('[products/[slug] generateMetadata]', error);
  }

  return {
    title: 'Products | Ambassador Commercial Kitchen Equipment',
    robots: { index: true, follow: true },
  };
}

/** /products/[slug] — product detail or category listing (single canonical URL per page). */
export default async function ProductsSegmentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const decoded = decodeURIComponent(slug).trim();

  await connectDB();

  const category = await findActiveCategoryBySlug(decoded);
  if (category?.slug) {
    const { categories, listing } = await loadProductsListingForPage({
      searchParams: sp,
      categorySlugFromPath: category.slug,
    });

    return (
      <ProductsPage
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
    const canonicalSlug = productUrlSegment(product);
    const requested = decoded.toLowerCase();

    if (requested !== canonicalSlug) {
      permanentRedirect(productDetailPath(canonicalSlug));
    }

    const detail = await getPublicProductDetail(canonicalSlug);
    if (detail.status === 'not_found' || detail.status === 'unavailable') {
      notFound();
    }

    return (
      <>
        <ProductJsonLd product={detail.product} />
        <ProductDetailPage
          productId={canonicalSlug}
          initialProduct={detail.product}
          initialReviews={detail.reviews}
        />
      </>
    );
  }

  notFound();
}
