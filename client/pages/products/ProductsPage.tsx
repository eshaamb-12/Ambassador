'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
} from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductRatingDropdown from '@/components/products/ProductRatingDropdown';
import CartPopup from '@/components/products/CartPopup';
import WishlistButton from '@/components/products/WishlistButton';
import { useCart } from '@/contexts/CartContext';
import PageLoader from '@/components/ui/PageLoader';
import {
  PRODUCTS_PATH,
  USED_EQUIPMENT_PATH,
  productsCategoryPath,
  usedEquipmentCategoryPath,
  productDetailPath,
  productUrlSegment,
  slugFromCatalogPath,
  slugFromCollectionPath,
} from '@/lib/siteRoutes';
import { useStorefrontCategories } from '@/hooks/useStorefrontCategories';
import { PRODUCT_PLACEHOLDER } from '@/utils/productMedia.util';

interface ApiCategoryRef {
  _id?: string;
  title?: string;
  slug?: string;
}

interface ApiProductRow {
  _id: string;
  slug?: string;
  name: string;
  about?: string;
  price?: number;
  originalPrice: number;
  stock: number;
  images: string[];
  features: string[];
  brands: string[];
  specifications: Record<string, string>;
  categories: ApiCategoryRef[];
  avgRating?: number;
  reviewCount?: number;
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string | undefined;
  categoryTitles: string[];
  price: number;
  originalPrice: number;
  image: string;
  featured: boolean;
  stock: number;
  features: string[];
  brands: string[];
  specifications: Record<string, string>;
  avgRating: number;
  reviewCount: number;
}

function normalizeBrandTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0);
}

function mapApiToProduct(p: ApiProductRow): Product {
  const catRefs = Array.isArray(p.categories) ? p.categories : [];
  const cats = catRefs.map((c) => c.title).filter((t): t is string => Boolean(t));
  const category = cats[0] ?? 'Uncategorized';
  const categorySlug = catRefs.find((c) => c.slug)?.slug ?? catRefs[0]?.slug;
  const displayPrice =
    p.price != null && p.price > 0 ? p.price : p.originalPrice ?? 0;
  const image = p.images?.[0] || PRODUCT_PLACEHOLDER;
  const feat = Array.isArray(p.features) ? p.features : [];
  const featured =
    feat.includes('best_seller') || feat.includes('new_arrival');
  return {
    _id: String(p._id),
    slug: p.slug?.trim().toLowerCase() || undefined,
    name: p.name,
    description: (p.about ?? '').trim(),
    category,
    categorySlug: categorySlug || undefined,
    categoryTitles: cats,
    price: displayPrice,
    originalPrice: p.originalPrice ?? displayPrice,
    image,
    featured,
    stock: p.stock ?? 0,
    features: feat,
    brands: normalizeBrandTags(p.brands),
    specifications: p.specifications ?? {},
    avgRating: p.avgRating ?? 0,
    reviewCount: p.reviewCount ?? 0,
  };
}

type BrandFilterKey = 'ambassador' | 'imported';

const BRAND_FILTERS: { key: BrandFilterKey; label: string; apiSlug: string }[] = [
  { key: 'ambassador', label: 'Ambassador', apiSlug: 'ambassador' },
  { key: 'imported', label: 'Imported', apiSlug: 'imported' },
];

/** Labels for product card / display (order: Ambassador, then Imported) */
function formatBrandLabels(slugs: string[]): string {
  if (!slugs.length) return '';
  const ordered = BRAND_FILTERS.map(({ apiSlug, label }) =>
    slugs.includes(apiSlug) ? label : null
  ).filter((x): x is string => x != null);
  const unknown = slugs.filter((s) => !BRAND_FILTERS.some((b) => b.apiSlug === s));
  return [...ordered, ...unknown].join(' · ');
}

type ProductFeatureFilterKey =
  | 'freeShipping'
  | 'onSale'
  | 'newArrival'
  | 'bestSeller'
  | 'customization';

const FEATURE_FILTERS: { key: ProductFeatureFilterKey; label: string; apiFlag: string }[] = [
  { key: 'freeShipping', label: 'Free Shipping', apiFlag: 'free_shipping' },
  { key: 'onSale', label: 'On Sale', apiFlag: 'on_sale' },
  { key: 'newArrival', label: 'New Arrival', apiFlag: 'new_arrival' },
  { key: 'bestSeller', label: 'Best Seller', apiFlag: 'best_seller' },
  { key: 'customization', label: 'Customization', apiFlag: 'customization' },
];

const ALL = 'All Categories';

const SORT_MAP: Record<string, string> = {
  random:       'random',
  name:         'name_asc',
  'price-low':  'price_asc',
  'price-high': 'price_desc',
  newest:       'newest',
};

const API_SORT_TO_UI: Record<string, string> = {
  random: 'random',
  name_asc: 'name',
  price_asc: 'price-low',
  price_desc: 'price-high',
  newest: 'newest',
};

function filtersFromSearchParams(sp: URLSearchParams) {
  const f = (sp.get('features') || '').split(',').filter(Boolean);
  const b = (sp.get('brands') || '').split(',').filter(Boolean);
  const sortRaw = sp.get('sort');
  return {
    features: {
      freeShipping: f.includes('free_shipping'),
      onSale: f.includes('on_sale'),
      newArrival: f.includes('new_arrival'),
      bestSeller: f.includes('best_seller'),
      customization: f.includes('customization'),
    } satisfies Record<ProductFeatureFilterKey, boolean>,
    brands: {
      ambassador: b.includes('ambassador'),
      imported: b.includes('imported'),
    } satisfies Record<BrandFilterKey, boolean>,
    priceRange: {
      min: Math.max(0, parseInt(sp.get('minPrice') || '0', 10) || 0),
      max: Math.max(0, parseInt(sp.get('maxPrice') || '0', 10) || 0),
    },
    sortBy: (sortRaw && API_SORT_TO_UI[sortRaw]) || 'random',
  };
}

const PAGE_SIZE = 12;

 function ProductResultRow({
  product,
  onAddToCart,
  onBuyItNow,
}: {
  product: Product;
  onAddToCart: () => void;
  onBuyItNow: () => void;
}) {
  const showStrike = product.originalPrice > product.price && product.price > 0;
  const detailHref = productDetailPath(productUrlSegment(product), product.categorySlug);

  return (
    <article className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6">
      <div className="relative h-[min(58vw,280px)] w-full shrink-0 overflow-hidden rounded-xl bg-[#F3F3F3] sm:aspect-square sm:h-auto sm:w-[220px] sm:rounded-lg sm:shadow-md md:w-[260px] lg:w-[300px]">
        <Link href={detailHref} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 sm:p-3"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 220px, 300px"
          />
        </Link>
        <WishlistButton productId={product._id} />
      </div>

      <div className="min-w-0 flex-1">
        <Link href={detailHref} className="block">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#0F4C69] hover:text-[#E36630] hover:underline sm:text-lg md:text-xl">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1">
          <ProductRatingDropdown
            productId={product._id}
            averageRating={product.reviewCount ? product.avgRating : 0}
            totalReviews={product.reviewCount}
            productName={product.name}
          />
        </div>

        {product.brands.length > 0 && (
          <p className="mt-1 text-xs font-semibold text-[#E36630]">{formatBrandLabels(product.brands)}</p>
        )}

        {product.category ? (
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#0F4C69]">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {product.category}
          </span>
        ) : null}

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-700 sm:line-clamp-4 sm:text-base">
          {product.description || 'No description available for this product.'}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-semibold text-[#E36630] sm:text-2xl">
            PKR {product.price.toLocaleString()}
          </span>
          {showStrike ? (
            <span className="text-sm text-gray-500 line-through">
              List Price: PKR {product.originalPrice.toLocaleString()}
            </span>
          ) : null}
          {showStrike ? (
            <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={product.stock <= 0}
            className="w-full rounded-xl bg-[#E36630] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#cc5a2a] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-2"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={onBuyItNow}
            disabled={product.stock <= 0}
            className="w-full rounded-xl border-2 border-[#0F4C69] px-4 py-2.5 text-sm font-semibold text-[#0F4C69] transition-colors hover:bg-[#0F4C69] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-2"
          >
            Buy it Now
          </button>
        </div>
      </div>
    </article>
  );
}

type CategoryMeta = { title: string; slug: string };

type ProductsFilterSidebarProps = {
  categories: string[];
  activeCategory: string;
  categoryListScrollRef: RefObject<HTMLDivElement | null>;
  categoryOptionRefs: MutableRefObject<Map<string, HTMLLabelElement>>;
  onSelectCategory: (value: string) => void;
  features: Record<ProductFeatureFilterKey, boolean>;
  onFeatureChange: (feature: ProductFeatureFilterKey, checked: boolean) => void;
  brands: Record<BrandFilterKey, boolean>;
  onBrandChange: (key: BrandFilterKey, checked: boolean) => void;
  availability: { readyToShip: boolean; customOrder: boolean };
  onAvailabilityChange: (key: string, checked: boolean) => void;
  priceRange: { min: number; max: number };
  setPriceRange: Dispatch<SetStateAction<{ min: number; max: number }>>;
  onClearAll: () => void;
  showHeader?: boolean;
  className?: string;
};

function ProductsFilterSidebar({
  categories,
  activeCategory,
  categoryListScrollRef,
  categoryOptionRefs,
  onSelectCategory,
  features,
  onFeatureChange,
  brands,
  onBrandChange,
  availability,
  onAvailabilityChange,
  priceRange,
  setPriceRange,
  onClearAll,
  showHeader = true,
  className = '',
}: ProductsFilterSidebarProps) {
  return (
    <div className={className}>
      {showHeader ? (
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-[#0F4C69] hover:text-[#E36630] hover:underline"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <div className="mb-4 border-b border-gray-200 pb-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">Category</h3>
        <div ref={categoryListScrollRef} className="max-h-48 space-y-2 overflow-y-auto pr-1 sm:max-h-56 lg:max-h-64">
          {categories.map((category) => (
            <label
              key={category}
              ref={(node) => {
                if (node) categoryOptionRefs.current.set(category, node);
                else categoryOptionRefs.current.delete(category);
              }}
              className="flex cursor-pointer items-center gap-2 py-0.5"
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={activeCategory === category}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="accent-[#E36630] focus:ring-2 focus:ring-[#E36630]/35"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200 pb-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">Features</h3>
        <div className="space-y-2">
          {FEATURE_FILTERS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 py-0.5">
              <input
                type="checkbox"
                checked={features[key]}
                onChange={(e) => onFeatureChange(key, e.target.checked)}
                className="accent-[#E36630] focus:ring-2 focus:ring-[#E36630]/35"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200 pb-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">Brand</h3>
        <div className="space-y-2">
          {BRAND_FILTERS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 py-0.5">
              <input
                type="checkbox"
                checked={brands[key]}
                onChange={(e) => onBrandChange(key, e.target.checked)}
                className="accent-[#E36630] focus:ring-2 focus:ring-[#E36630]/35"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200 pb-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">Availability</h3>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 py-0.5">
            <input
              type="checkbox"
              checked={availability.readyToShip}
              onChange={(e) => onAvailabilityChange('readyToShip', e.target.checked)}
              className="accent-[#E36630] focus:ring-2 focus:ring-[#E36630]/35"
            />
            <span className="text-sm text-gray-700">Ready to Ship</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 py-0.5">
            <input
              type="checkbox"
              checked={availability.customOrder}
              onChange={(e) => onAvailabilityChange('customOrder', e.target.checked)}
              className="accent-[#E36630] focus:ring-2 focus:ring-[#E36630]/35"
            />
            <span className="text-sm text-gray-700">Custom Order</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">
              Min: PKR {priceRange.min.toLocaleString()}
            </label>
            <input
              type="range"
              min={0}
              max={500000}
              step={1000}
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: parseInt(e.target.value, 10) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">
              Max: PKR {priceRange.max > 0 ? priceRange.max.toLocaleString() : 'Any'}
            </label>
            <input
              type="range"
              min={0}
              max={500000}
              step={1000}
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: parseInt(e.target.value, 10) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function pageFromSearchParams(sp: URLSearchParams): number {
  const n = parseInt(sp.get('page') || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export type StorefrontProductCatalog = 'new' | 'used';

interface ProductsPageProps {
  /** When routed via /products/[categorySlug] or /used-equipment/[categorySlug] */
  categorySlugFromPath?: string;
  /** `used` — pre-owned catalog at /used-equipment */
  catalog?: StorefrontProductCatalog;
}

const ProductsPage = ({ categorySlugFromPath, catalog = 'new' }: ProductsPageProps = {}) => {
  const isUsedCatalog = catalog === 'used';
  const listingBasePath = isUsedCatalog ? USED_EQUIPMENT_PATH : PRODUCTS_PATH;
  const categoryPathForSlug = isUsedCatalog ? usedEquipmentCategoryPath : productsCategoryPath;
  const slugFromListingPath = (path: string) =>
    isUsedCatalog ? slugFromCatalogPath(path, listingBasePath) : slugFromCollectionPath(path);
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const pathname      = usePathname();
  const isMounted     = useRef(false);
  const filtersReadyFromUrl = useRef(false);
  const suppressPageReset = useRef(false);
  const preferAllCategories = useRef(false);
  const categoryListScrollRef = useRef<HTMLDivElement>(null);
  const categoryOptionRefs = useRef<Map<string, HTMLLabelElement>>(new Map());

  // ── Initialise all filter state from URL on first render ──
  const [products,  setProducts]  = useState<Product[]>([]);
  const { categories: storefrontCategories } = useStorefrontCategories();
  const categoryMeta = useMemo(
    () =>
      storefrontCategories
        .filter((c) => c.title && c.slug)
        .map((c) => ({ title: c.title, slug: c.slug })),
    [storefrontCategories],
  );
  const categories = useMemo(
    () => [ALL, ...storefrontCategories.map((c) => c.title).filter(Boolean)],
    [storefrontCategories],
  );
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [total,     setTotal]     = useState(0);
  const [totalPages,setTotalPages]= useState(0);

  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') || ALL,
  );
  const [searchTerm,  setSearchTerm]  = useState(() => searchParams.get('search')  || '');
  const [shuffleSeed] = useState(() => Date.now());
  const [sortBy,      setSortBy]      = useState(() => filtersFromSearchParams(searchParams).sortBy);
  const [currentPage, setCurrentPage] = useState(() => Math.max(1, parseInt(searchParams.get('page') || '1', 10)));
  const [priceRange,  setPriceRange]  = useState(() => filtersFromSearchParams(searchParams).priceRange);
  const [features, setFeatures] = useState<Record<ProductFeatureFilterKey, boolean>>(
    () => filtersFromSearchParams(searchParams).features,
  );
  const [brands, setBrands] = useState<Record<BrandFilterKey, boolean>>(
    () => filtersFromSearchParams(searchParams).brands,
  );
  const [availability, setAvailability] = useState(() => ({
    readyToShip: false,
    customOrder: false,
  }));

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedProduct,  setAddedProduct]  = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { addToCart } = useCart();

  const slugPath = useMemo(
    () => categorySlugFromPath ?? slugFromListingPath(pathname),
    [categorySlugFromPath, pathname, isUsedCatalog],
  );

  const categoryTitleForSlug = useMemo(() => {
    if (!slugPath || categoryMeta.length === 0) return null;
    const normalized = slugPath.toLowerCase();
    return categoryMeta.find((c) => c.slug.toLowerCase() === normalized)?.title ?? null;
  }, [slugPath, categoryMeta]);

  /** Sidebar + API category — matches /products/[categorySlug] even before state catches up. */
  const activeCategory = useMemo(() => {
    if (selectedCategory !== ALL) return selectedCategory;
    if (preferAllCategories.current) return ALL;
    if (slugPath && categoryTitleForSlug) return categoryTitleForSlug;
    return ALL;
  }, [selectedCategory, slugPath, categoryTitleForSlug]);

  // Keep the selected category visible inside the scrollable category list
  useEffect(() => {
    const container = categoryListScrollRef.current;
    if (!container) return;

    if (activeCategory === ALL) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const option = categoryOptionRefs.current.get(activeCategory);
    option?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeCategory, categories]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== ALL) count += 1;
    if (Object.values(features).some(Boolean)) {
      count += Object.values(features).filter(Boolean).length;
    }
    if (Object.values(brands).some(Boolean)) {
      count += Object.values(brands).filter(Boolean).length;
    }
    if (availability.readyToShip || availability.customOrder) {
      count += Number(availability.readyToShip) + Number(availability.customOrder);
    }
    if (priceRange.min > 0 || priceRange.max > 0) count += 1;
    return count;
  }, [activeCategory, features, brands, availability, priceRange]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFiltersOpen]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileFiltersOpen]);

  const handleSelectCategory = useCallback((value: string) => {
    preferAllCategories.current = value === ALL;
    setSelectedCategory(value);
    setSearchTerm('');
    filtersReadyFromUrl.current = true;
  }, []);

  const buildListingPath = useCallback(
    (overrides: Record<string, string> = {}) => {
      const p = new URLSearchParams();
      const cat = overrides.category ?? activeCategory;
      const q = (overrides.search ?? searchTerm).trim();
      const sort = overrides.sort ?? sortBy;
      const page = overrides.page ?? String(currentPage);
      const minP = overrides.minPrice ?? String(priceRange.min);
      const maxP = overrides.maxPrice ?? String(priceRange.max);
      const feat =
        overrides.features ??
        FEATURE_FILTERS.filter(({ key }) => features[key as ProductFeatureFilterKey])
          .map(({ apiFlag }) => apiFlag)
          .join(',');
      const br =
        overrides.brands ??
        (() => {
          const set = new Set(
            BRAND_FILTERS.filter(({ key }) => brands[key as BrandFilterKey]).map(({ apiSlug }) => apiSlug)
          );
          if (availability.readyToShip) set.add('imported');
          if (availability.customOrder) set.add('ambassador');
          return [...set].join(',');
        })();

      if (sort !== 'random') p.set('sort', sort);
      if (page !== '1') p.set('page', page);
      if (Number(minP) > 0) p.set('minPrice', minP);
      if (Number(maxP) > 0) p.set('maxPrice', maxP);
      if (feat) p.set('features', feat);
      if (br) p.set('brands', br);

      const qs = p.toString();

      if (q) {
        p.set('search', q);
        const searchQs = p.toString();
        return searchQs ? `${listingBasePath}?${searchQs}` : listingBasePath;
      }

      if (cat && cat !== ALL) {
        const slug =
          categoryMeta.find((c) => c.title === cat)?.slug ??
          (slugPath && categoryTitleForSlug === cat ? slugPath : undefined);
        if (slug) {
          return qs ? `${categoryPathForSlug(slug)}?${qs}` : categoryPathForSlug(slug);
        }
        p.set('category', cat);
        const legacyQs = p.toString();
        return legacyQs ? `${listingBasePath}?${legacyQs}` : listingBasePath;
      }

      return qs ? `${listingBasePath}?${qs}` : listingBasePath;
    },
    [
      activeCategory,
      searchTerm,
      sortBy,
      currentPage,
      priceRange,
      features,
      brands,
      availability,
      categoryMeta,
      slugPath,
      categoryTitleForSlug,
      listingBasePath,
      categoryPathForSlug,
    ]
  );

  // ── Write filters to the URL (path + query, replaceState — no history entry) ──
  const syncURL = useCallback(
    (overrides: Record<string, string> = {}) => {
      if (loading) return;
      setLoading(true);
      setLoadError(null);
      router.replace(buildListingPath(overrides), { scroll: false });
    },
    [buildListingPath, loading, router]
  );

  // Sync URL whenever any filter changes (internal — uses router.replace so no history entry)
  useEffect(() => {
    if (!filtersReadyFromUrl.current) return;
    if (slugPath && categoryMeta.length === 0) return;
    syncURL();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCategory, searchTerm, sortBy, currentPage, priceRange, features, brands, availability, categoryMeta, slugPath, categoryTitleForSlug, activeCategory]);

  // Respond to external navigation (header search, path-based category URLs)
  useEffect(() => {
    const newSearch = searchParams.get('search') ?? '';
    if (newSearch.trim()) {
      setSearchTerm(newSearch);
      setSelectedCategory(ALL);
      filtersReadyFromUrl.current = true;
      return;
    }

    setSearchTerm('');

    if (slugPath && categoryMeta.length > 0) {
      preferAllCategories.current = false;
      suppressPageReset.current = true;
      setSelectedCategory(categoryTitleForSlug ?? ALL);
      setCurrentPage(pageFromSearchParams(searchParams));
      filtersReadyFromUrl.current = true;
      return;
    }

    if (!slugPath) {
      suppressPageReset.current = true;
      setSelectedCategory(searchParams.get('category') ?? ALL);
      setCurrentPage(pageFromSearchParams(searchParams));
      filtersReadyFromUrl.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, categoryMeta, categorySlugFromPath, slugPath, categoryTitleForSlug]);

  // Migrate legacy ?category=Title to /products/slug
  useEffect(() => {
    const legacyTitle = searchParams.get('category')?.trim();
    if (!legacyTitle || searchParams.get('search')?.trim() || categoryMeta.length === 0) return;
    if (slugFromListingPath(pathname) || categorySlugFromPath) return;

    const match = categoryMeta.find((c) => c.title.toLowerCase() === legacyTitle.toLowerCase());
    if (!match?.slug) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    const qs = params.toString();
    router.replace(qs ? `${categoryPathForSlug(match.slug)}?${qs}` : categoryPathForSlug(match.slug), {
      scroll: false,
    });
  }, [searchParams, categoryMeta, pathname, categorySlugFromPath, router, isUsedCatalog]);

  // Fetch products from server whenever any filter or page changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams();
        params.set('page',  String(currentPage));
        params.set('limit', String(PAGE_SIZE));
        if (searchTerm.trim()) {
          params.set('search', searchTerm.trim());
        } else if (activeCategory !== ALL) {
          params.set('category', activeCategory);
        }
        if (priceRange.min > 0)             params.set('minPrice', String(priceRange.min));
        if (priceRange.max > 0)             params.set('maxPrice', String(priceRange.max));
        const apiSort = SORT_MAP[sortBy] ?? 'random';
        params.set('sort', apiSort);
        if (apiSort === 'random') params.set('seed', String(shuffleSeed));

        // Merge brand checkboxes + availability into a single brands param
        const activeBrands = new Set(BRAND_FILTERS.filter(({ key }) => brands[key]).map(({ apiSlug }) => apiSlug));
        if (availability.readyToShip) activeBrands.add('imported');
        if (availability.customOrder) activeBrands.add('ambassador');
        if (activeBrands.size)              params.set('brands', [...activeBrands].join(','));

        const activeFeats = FEATURE_FILTERS.filter(({ key }) => features[key]).map(({ apiFlag }) => apiFlag);
        if (activeFeats.length)             params.set('features', activeFeats.join(','));
        if (isUsedCatalog)                  params.set('used', '1');

        const res  = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
        const json = await res.json();
        if (!json?.success || !Array.isArray(json.data)) throw new Error(json?.message || 'Failed to load products.');
        if (cancelled) return;

        const mapped = (json.data as ApiProductRow[]).map(mapApiToProduct);
        setProducts(mapped);
        setTotal(json.total ?? mapped.length);
        setTotalPages(json.totalPages ?? 1);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load products.');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentPage, searchTerm, activeCategory, priceRange, sortBy, brands, features, availability, shuffleSeed, isUsedCatalog]);

  // Reset to page 1 when a filter changes — not on mount or URL/path hydration (?page=2 on category URLs)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (suppressPageReset.current) {
      suppressPageReset.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, sortBy, brands, features, availability]);

  const filteredProducts = products; // server already filtered

  const handleFeatureChange = (feature: ProductFeatureFilterKey, checked: boolean) => {
    setFeatures((prev) => ({ ...prev, [feature]: checked }));
  };

  const handleBrandChange = (key: BrandFilterKey, checked: boolean) => {
    setBrands((prev) => ({ ...prev, [key]: checked }));
  };

  const handleAvailabilityChange = (key: string, checked: boolean) => {
    setAvailability((prev) => ({ ...prev, [key]: checked }));
  };

  const buildCartItem = (product: Product) => {
    const code =
      product.specifications['Product Code'] ||
      product.specifications['product code'] ||
      product._id;
    return {
      id: product._id,
      title: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      productCode: String(code),
    };
  };

  const handleAddToCart = (product: Product) => {
    addToCart(buildCartItem(product));
    setAddedProduct(product);
    setShowCartPopup(true);
    setTimeout(() => setShowCartPopup(false), 3000);
  };

  const handleBuyItNow = (product: Product) => {
    if (product.stock <= 0) return;
    addToCart(buildCartItem(product));
    router.push('/checkout');
  };

  const clearFilters = () => {
    preferAllCategories.current = true;
    filtersReadyFromUrl.current = true;
    setSelectedCategory(ALL);
    setPriceRange({ min: 0, max: 0 });
    setSortBy('newest');
    setSearchTerm('');
    setFeatures({
      freeShipping: false,
      onSale: false,
      newArrival: false,
      bestSeller: false,
      customization: false,
    });
    setBrands({
      ambassador: false,
      imported: false,
    });
    setAvailability({
      readyToShip: false,
      customOrder: false,
    });
  };

  const filterSidebarProps: ProductsFilterSidebarProps = {
    categories,
    activeCategory,
    categoryListScrollRef,
    categoryOptionRefs,
    onSelectCategory: handleSelectCategory,
    features,
    onFeatureChange: handleFeatureChange,
    brands,
    onBrandChange: handleBrandChange,
    availability,
    onAvailabilityChange: handleAvailabilityChange,
    priceRange,
    setPriceRange,
    onClearAll: clearFilters,
  };

  if (loadError && !loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-4">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-[#E36630] px-4 py-2 text-white hover:bg-[#cc5a2a]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-28 z-20 border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-[1600px] px-4">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[1.25rem] text-sm text-gray-600">
              {!loading && (
                <>
                  {searchTerm.trim() ? (
                    <>
                      <span className="font-semibold">
                        {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)}
                      </span>{' '}
                      of <span className="font-semibold">{total}</span> results for{' '}
                      <span className="font-semibold text-gray-800">&quot;{searchTerm.trim()}&quot;</span>
                    </>
                  ) : activeCategory !== ALL ? (
                    <>
                      <span className="font-semibold">
                        {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)}
                      </span>{' '}
                      of <span className="font-semibold">{total}</span> results in{' '}
                      <span className="font-semibold text-gray-800">{activeCategory}</span>
                    </>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="font-semibold">
                        {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)}
                      </span>{' '}
                      of <span className="font-semibold">{total}</span>{' '}
                      {isUsedCatalog ? 'used items' : 'products'}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-[#E36630] hover:text-[#E36630] lg:hidden sm:flex-none"
                aria-expanded={mobileFiltersOpen}
                aria-controls="products-mobile-filters"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M10 12h4" />
                </svg>
                Filters
                {activeFilterCount > 0 ? (
                  <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#E36630] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
              <label htmlFor="products-sort" className="text-sm text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="products-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-[#E36630] focus:ring-2 focus:ring-[#E36630]/35 sm:min-w-[10rem] sm:flex-none sm:py-1.5"
              >
                <option value="random">Featured Mix</option>
                <option value="newest">Newest First</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1600px]">
        <div className="flex flex-col lg:flex-row">
          <main className="order-1 min-w-0 flex-1 px-4 py-4 pb-24 lg:order-2 lg:px-6 lg:pb-4">
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">Results</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Check each product page for other buying options. Prices and availability may vary.
            </p>

            {loading ? (
              <PageLoader
                message="Loading products…"
                fullScreen={false}
                className="min-h-[280px] bg-white"
              />
            ) : filteredProducts.length > 0 ? (
              <div className="mt-3 divide-y divide-gray-200 border-t border-gray-200">
                {filteredProducts.map((product) => (
                  <ProductResultRow
                    key={product._id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onBuyItNow={() => handleBuyItNow(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 border-t border-gray-200 py-16 text-center">
                <div className="mb-2 text-lg font-medium text-gray-800">No products found</div>
                <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}

            {!loading && totalPages > 1 && (() => {
              const getPages = (): (number | '…')[] => {
                if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
                const pages: (number | '…')[] = [1];
                if (currentPage > 3) pages.push('…');
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push('…');
                pages.push(totalPages);
                return pages;
              };
              return (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[#E36630] hover:text-[#E36630] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {getPages().map((page, idx) =>
                      page === '…' ? (
                        <span key={`ellipsis-${idx}`} className="select-none px-2 py-2 text-sm text-gray-400">…</span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`min-h-[36px] min-w-[36px] rounded-lg text-sm font-semibold transition-colors ${
                            currentPage === page
                              ? 'bg-[#E36630] text-white'
                              : 'border border-gray-200 bg-white text-gray-700 hover:border-[#E36630] hover:text-[#E36630]'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[#E36630] hover:text-[#E36630] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              );
            })()}
          </main>

          <aside className="order-2 hidden shrink-0 lg:order-1 lg:block lg:w-60 lg:border-r lg:border-gray-200 lg:px-5 xl:w-64">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto py-4 pr-1">
              <ProductsFilterSidebar {...filterSidebarProps} />
            </div>
          </aside>
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="products-mobile-filters-title">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            id="products-mobile-filters"
            className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
              <h2 id="products-mobile-filters-title" className="min-w-0 text-base font-bold text-gray-900">
                Filters
                {activeFilterCount > 0 ? (
                  <span className="ml-1 text-sm font-medium text-[#E36630]">({activeFilterCount})</span>
                ) : null}
              </h2>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-[#0F4C69] hover:text-[#E36630] hover:underline"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Close filters panel"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
              <ProductsFilterSidebar {...filterSidebarProps} showHeader={false} />
            </div>
            <div className="border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-[#0F4C69] py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d3d55]"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CartPopup
        show={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={
          addedProduct
            ? {
                title: addedProduct.name,
                images: [addedProduct.image],
                specifications: {
                  'Product Code':
                    addedProduct.specifications['Product Code'] ||
                    addedProduct.specifications['product code'] ||
                    addedProduct._id,
                },
                price: addedProduct.price,
              }
            : undefined
        }
      />
    </div>
  );
};

export default ProductsPage;
