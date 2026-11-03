import connectDB from '@/backend/config/db';
import Review from '@/backend/models/Review.model';
import {
  findActiveProductByIdentifier,
  findInactiveProductByIdentifier,
} from '@/backend/lib/findPublicProduct';
import { resolveProductImages, resolveProductVideos } from '@/utils/productMedia.util';
import { orderProductSpecifications } from '@/lib/productSpecifications';

export type PublicProductReview = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

export type PublicProductDetail = {
  _id: string;
  slug?: string;
  name: string;
  about: string;
  price?: number;
  originalPrice: number;
  stock: number;
  images: string[];
  imagePublicIds: string[];
  videos: string[];
  videoPublicIds: string[];
  brands?: unknown;
  specifications: Record<string, string>;
  specificationOrder?: string[];
  categories: Array<{ title?: string; slug?: string; sortOrder?: number }>;
  features?: string[];
  metaTitle?: string;
  metaDescription?: string;
  avgRating: number;
  reviewCount: number;
};

export type GetPublicProductDetailResult =
  | { status: 'ok'; product: PublicProductDetail; reviews: PublicProductReview[] }
  | { status: 'not_found' }
  | { status: 'unavailable' };

/** Load a single active product + approved reviews (storefront / SSR). */
export async function getPublicProductDetail(identifier: string): Promise<GetPublicProductDetailResult> {
  await connectDB();

  const product = await findActiveProductByIdentifier(identifier);
  if (!product) {
    const inactive = await findInactiveProductByIdentifier(identifier);
    if (inactive) return { status: 'unavailable' };
    return { status: 'not_found' };
  }

  const productId = String(product._id);

  const reviews = await Review.find({ productId, status: 'approved' })
    .sort({ createdAt: -1 })
    .select('reviewerName rating comment createdAt')
    .lean();

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? +Number(reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : 0;

  const images = resolveProductImages({
    images: product.images,
    imagePublicIds: product.imagePublicIds,
  });
  const videos = resolveProductVideos({
    videos: product.videos,
    videoPublicIds: product.videoPublicIds,
  });

  const specifications = orderProductSpecifications(
    (product.specifications as Record<string, string>) ?? {},
    Array.isArray(product.specificationOrder) ? product.specificationOrder : undefined,
  );

  const detail: PublicProductDetail = {
    _id: productId,
    slug: product.slug,
    name: product.name,
    about: product.about ?? '',
    price: product.price,
    originalPrice: product.originalPrice ?? 0,
    stock: product.stock ?? 0,
    images,
    videos,
    imagePublicIds: product.imagePublicIds ?? [],
    videoPublicIds: product.videoPublicIds ?? [],
    brands: product.brands,
    specifications,
    specificationOrder: Array.isArray(product.specificationOrder) ? product.specificationOrder : undefined,
    categories: (product.categories ?? []) as PublicProductDetail['categories'],
    features: Array.isArray(product.features) ? product.features : [],
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    avgRating,
    reviewCount,
  };

  return {
    status: 'ok',
    product: detail,
    reviews: reviews.map((r) => ({
      _id: String(r._id),
      name: r.reviewerName,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    })),
  };
}
