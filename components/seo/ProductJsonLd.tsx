import { productDetailPath, productUrlSegment } from '@/lib/siteRoutes';
import { absoluteUrl } from '@/lib/siteUrl';
import { productHasListedPrice } from '@/lib/productFeatures';
import type { PublicProductDetail } from '@/backend/lib/getPublicProductDetail';

type Props = {
  product: PublicProductDetail;
};

export default function ProductJsonLd({ product }: Props) {
  const path = productDetailPath(productUrlSegment({ _id: product._id, slug: product.slug }));
  const url = absoluteUrl(path);
  const hasPrice = productHasListedPrice(product);
  const offerPrice =
    product.price != null && product.price > 0 ? product.price : product.originalPrice;
  const inStock = (product.stock ?? 0) > 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.about || product.metaDescription || product.name).trim().slice(0, 5000),
    image: product.images?.length ? product.images : undefined,
    sku:
      product.specifications['Product Code'] ||
      product.specifications['product code'] ||
      product._id,
    brand: {
      '@type': 'Brand',
      name: 'Ambassador Commercial Kitchen Equipment',
    },
    offers: hasPrice
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: 'PKR',
          price: offerPrice,
          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        }
      : undefined,
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.avgRating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
