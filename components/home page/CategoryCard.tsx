'use client';

import Link from 'next/link';
import { PRODUCTS_PATH, productsHref, productsCategoryPath } from '@/lib/siteRoutes';

interface CategoryCardProps {
  title: string;
  image?: string;
  category?: string;
  categorySlug?: string;
  onSeeMore?: () => void;
  children?: React.ReactNode;
}

const CategoryCard = ({ title, image, category, categorySlug, children }: CategoryCardProps) => {
  const href = categorySlug
    ? productsCategoryPath(categorySlug)
    : category
      ? productsHref({ category })
      : PRODUCTS_PATH;

  return (
    <Link href={href} className="block h-full">
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl sm:rounded-xl">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white">{children}</div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-[1] px-3 pb-3 pt-2 text-center sm:px-4 sm:pb-4">
          <h3 className="category-card-title mb-1 line-clamp-2 text-base font-semibold leading-snug text-[#0F4C69] sm:mb-1.5 sm:text-lg md:text-xl">
            {title}
          </h3>
          <span className="category-card-cta inline-block text-xs font-medium text-[#E36630] transition-colors group-hover:text-[#ff8a5c] sm:text-sm">
            See More →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
