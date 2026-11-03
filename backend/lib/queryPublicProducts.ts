import mongoose from 'mongoose';
import Product from '@/backend/models/Product.model';
import Category from '@/backend/models/Category.model';
import Review from '@/backend/models/Review.model';
import { resolveProductImages } from '@/utils/productMedia.util';
import { sortPopulatedCategories } from '@/lib/storefrontCategories';
import { MAIN_CATALOG_FILTER, USED_EQUIPMENT_FILTER } from '@/backend/lib/productTypeFilters';

export const PUBLIC_PRODUCTS_PAGE_LIMIT = 12;

export type PublicProductsQuery = {
  search?: string;
  categoryTitle?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  brandsRaw?: string;
  featsRaw?: string;
  onSale?: boolean;
  sortBy?: string;
  excludeId?: string;
  usedOnly?: boolean;
  seed?: number;
};

export type PublicListingProduct = {
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
  categories: Array<{ title?: string; slug?: string; sortOrder?: number }>;
  avgRating: number;
  reviewCount: number;
};

export type PublicProductsQueryResult = {
  data: PublicListingProduct[];
  total: number;
  page: number;
  totalPages: number;
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const LISTING_PROJECTION = {
  name: 1,
  slug: 1,
  price: 1,
  originalPrice: 1,
  stock: 1,
  status: 1,
  brands: 1,
  features: 1,
  categories: 1,
  images: 1,
  imagePublicIds: 1,
  createdAt: 1,
  about: 1,
};

const AGG_CATEGORY_LOOKUP = [
  {
    $lookup: {
      from: 'categories',
      localField: 'categories',
      foreignField: '_id',
      as: 'categoryDocs',
    },
  },
  {
    $project: {
      ...LISTING_PROJECTION,
      categories: {
        $map: {
          input: '$categoryDocs',
          as: 'c',
          in: {
            title: '$$c.title',
            slug: '$$c.slug',
            sortOrder: { $ifNull: ['$$c.sortOrder', 0] },
          },
        },
      },
    },
  },
] as const;

function enrichListingProduct(p: Record<string, unknown> & { _id: unknown }) {
  const resolved = resolveProductImages({
    images: p.images,
    imagePublicIds: p.imagePublicIds,
  });
  return {
    ...p,
    _id: String(p._id),
    images: resolved.length ? [resolved[0]] : [],
    categories: sortPopulatedCategories(
      Array.isArray(p.categories) ? (p.categories as { sortOrder?: number; title?: string }[]) : [],
    ),
    specifications: {},
    features: Array.isArray(p.features) ? p.features : [],
    brands: Array.isArray(p.brands) ? p.brands.filter((x): x is string => typeof x === 'string') : [],
  };
}

async function loadRatingMap(productIds: mongoose.Types.ObjectId[]) {
  const ratingMap: Record<string, { avgRating: number; reviewCount: number }> = {};
  if (productIds.length === 0) return ratingMap;

  const ratings = await Review.aggregate([
    { $match: { status: 'approved', productId: { $in: productIds } } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);

  for (const r of ratings) {
    ratingMap[String(r._id)] = { avgRating: r.avgRating, reviewCount: r.reviewCount };
  }
  return ratingMap;
}

function attachRatings(
  products: Record<string, unknown>[],
  ratingMap: Record<string, { avgRating: number; reviewCount: number }>,
) {
  return products.map((p) => {
    const id = String(p._id);
    const r = ratingMap[id];
    return {
      ...enrichListingProduct({ ...p, _id: id }),
      avgRating: r ? +Number(r.avgRating).toFixed(1) : 0,
      reviewCount: r?.reviewCount ?? 0,
    };
  }) as PublicListingProduct[];
}

/** Shared product listing query for API routes and SSR. */
export async function queryPublicProducts(input: PublicProductsQuery): Promise<PublicProductsQueryResult> {
  const search = (input.search ?? '').trim();
  const categoryTitle = (input.categoryTitle ?? '').trim();
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(50, input.limit ?? PUBLIC_PRODUCTS_PAGE_LIMIT);
  const skip = (page - 1) * limit;

  const minPrice = input.minPrice ?? 0;
  const maxPrice = input.maxPrice ?? 0;
  const brandsRaw = (input.brandsRaw ?? '').trim();
  const featsRaw = (input.featsRaw ?? '').trim();
  const onSale = input.onSale ?? false;
  const sortBy = input.sortBy ?? 'newest';
  const excludeId = (input.excludeId ?? '').trim();
  const usedOnly = input.usedOnly ?? false;

  const filter: Record<string, unknown> = {
    status: 'active',
    ...(usedOnly ? USED_EQUIPMENT_FILTER : MAIN_CATALOG_FILTER),
  };

  if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: excludeId };
  }

  if (search) {
    const nameCondition = { name: { $regex: escapeRegex(search), $options: 'i' } };

    const matchingCats = await Category.find({
      title: { $regex: escapeRegex(search), $options: 'i' },
      $nor: [{ status: { $regex: /^inactive$/i } }],
    })
      .select('_id')
      .lean();

    if (matchingCats.length > 0) {
      filter.$or = [nameCondition, { categories: { $in: matchingCats.map((c) => c._id) } }];
    } else {
      filter.name = nameCondition.name;
    }
  } else if (categoryTitle) {
    const cats = await Category.find({
      title: new RegExp(`^${escapeRegex(categoryTitle)}$`, 'i'),
      $nor: [{ status: { $regex: /^inactive$/i } }],
    })
      .select('_id')
      .lean();

    if (!cats.length) {
      return { data: [], total: 0, page, totalPages: 0 };
    }
    filter.categories = { $in: cats.map((c) => c._id) };
  }

  if (minPrice > 0 || maxPrice > 0) {
    const priceField: Record<string, number> = {};
    if (minPrice > 0) priceField.$gte = minPrice;
    if (maxPrice > 0) priceField.$lte = maxPrice;
    filter.originalPrice = priceField;
  }

  if (brandsRaw) {
    filter.brands = { $in: brandsRaw.split(',').map((b) => b.trim()).filter(Boolean) };
  }

  if (featsRaw) {
    filter.features = { $all: featsRaw.split(',').map((f) => f.trim()).filter(Boolean) };
  }

  if (onSale) {
    filter.$or = [
      { features: 'on_sale' },
      {
        price: { $exists: true, $gt: 0 },
        $expr: { $lt: ['$price', '$originalPrice'] },
      },
    ];
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { originalPrice: 1 },
    price_desc: { originalPrice: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };
  const sortOrder = sortMap[sortBy] ?? sortMap.newest;
  const usePriceSort = sortBy === 'price_asc' || sortBy === 'price_desc';
  const useNameCollation = sortBy === 'name_asc' || sortBy === 'name_desc';

  const countPromise = Product.countDocuments(filter);
  let productsPromise: Promise<Record<string, unknown>[]>;

  if (sortBy === 'random') {
    const seed = Number.isFinite(input.seed) ? Number(input.seed) : 1;

    productsPromise = Product.aggregate([
      { $match: filter },
      {
        $addFields: {
          sortRand: {
            $mod: [
              {
                $add: [
                  {
                    $convert: {
                      input: { $substrCP: [{ $toString: '$_id' }, 18, 6] },
                      to: 'int',
                      onError: 0,
                    },
                  },
                  seed,
                ],
              },
              2147483647,
            ],
          },
        },
      },
      { $sort: { sortRand: 1, _id: 1 } },
      { $skip: skip },
      { $limit: limit },
      ...AGG_CATEGORY_LOOKUP,
    ]);
  } else if (usePriceSort) {
    productsPromise = Product.aggregate([
      { $match: filter },
      {
        $addFields: {
          sortPrice: {
            $cond: [{ $gt: [{ $ifNull: ['$price', 0] }, 0] }, '$price', '$originalPrice'],
          },
        },
      },
      { $sort: { sortPrice: sortBy === 'price_desc' ? -1 : 1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      ...AGG_CATEGORY_LOOKUP,
    ]);
  } else {
    productsPromise = (async () => {
      let query = Product.find(filter, LISTING_PROJECTION)
        .populate('categories', 'title slug sortOrder')
        .sort(sortOrder)
        .skip(skip)
        .limit(limit);
      if (useNameCollation) {
        query = query.collation({ locale: 'en', strength: 2 });
      }
      return query.lean() as unknown as Promise<Record<string, unknown>[]>;
    })();
  }

  const [productsResult, total] = await Promise.all([productsPromise, countPromise]);
  const productIds = productsResult.map((p) => new mongoose.Types.ObjectId(String(p._id)));
  const ratingMap = await loadRatingMap(productIds);
  const enriched = attachRatings(productsResult, ratingMap);

  return {
    data: enriched,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
