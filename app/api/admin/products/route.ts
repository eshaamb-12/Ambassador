import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Product from '@/backend/models/Product.model';
import Review from '@/backend/models/Review.model';
import {
  resolveProductCategoryIds,
  validateProductTaxonomy,
  toObjectIdArray,
} from '@/backend/lib/productTaxonomy';
import {
  sanitizeProductFeatures,
  sanitizeProductBrands,
} from '@/backend/lib/productMarketingFields';
import { productPricingFromBody } from '@/backend/lib/productPriceRules';
import { requireAdmin, requireFullAdmin, rejectManagerStatusChange } from '@/backend/lib/adminAuth';
import {
  buildAdminProductListFilter,
  fuzzyAdminProductIds,
  normalizeAdminSearchQuery,
  rankProductCandidatesBySearch,
  sortProductsByIdOrder,
} from '@/backend/lib/adminProductSearch';
import { parseWeightKg } from '@/lib/shippingQuote';
import mongoose from 'mongoose';

const FUZZY_CANDIDATE_CAP = 4000;

const ADMIN_PAGE_LIMIT = 10;

// Fields needed by the admin product listing table
const ADMIN_LIST_PROJECTION = {
  name: 1, slug: 1, price: 1, originalPrice: 1,
  stock: 1, status: 1, brands: 1, features: 1, isUsed: 1,
  categories: 1, images: { $slice: 1 }, createdAt: 1,
};

/** GET /api/admin/products?page=1&limit=10&search=...&status=...&category=...&categories=id1,id2&stock=...&brand=... */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search     = searchParams.get('search')   ?? '';
    const status     = searchParams.get('status')   ?? 'all';
    const stock      = searchParams.get('stock')    ?? 'all';
    const categoryId = searchParams.get('category') ?? '';
    const categoryIdsParam = searchParams.get('categories') ?? '';
    const brand = searchParams.get('brand') ?? 'all';
    const productType = searchParams.get('productType') ?? 'all';
    const page       = Math.max(1, parseInt(searchParams.get('page')  ?? '1', 10));
    const limit      = Math.min(50, parseInt(searchParams.get('limit') ?? String(ADMIN_PAGE_LIMIT), 10));
    const skip       = (page - 1) * limit;

    const trimmedSearch = normalizeAdminSearchQuery(search);
    const searchActive = trimmedSearch.length >= 2;

    const filter = buildAdminProductListFilter({
      search: trimmedSearch,
      productType,
      status,
      stock,
      categoryId,
      categoryIdsParam,
      brand,
      ignoreCategory: searchActive,
    });

    const baseFilterWithoutSearch = buildAdminProductListFilter({
      productType,
      status,
      stock,
      categoryId,
      categoryIdsParam,
      brand,
      ignoreCategory: searchActive,
    });

    type AdminProductRow = { _id: unknown; name?: string; slug?: string; [key: string]: unknown };
    let products: AdminProductRow[] = [];
    let total: number;

    const ratingsPromise = Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);

    if (searchActive) {
      const strictTotal = await Product.countDocuments(filter);
      let ranked: { ids: mongoose.Types.ObjectId[]; total: number };

      if (strictTotal > 0) {
        const candidates = await Product.find(filter, { name: 1, slug: 1 })
          .limit(FUZZY_CANDIDATE_CAP)
          .lean();
        ranked = rankProductCandidatesBySearch(trimmedSearch, candidates, skip, limit);
      } else {
        ranked = await fuzzyAdminProductIds(
          (baseFilter) =>
            Product.find(baseFilter, { name: 1, slug: 1 }).limit(FUZZY_CANDIDATE_CAP).lean(),
          baseFilterWithoutSearch,
          trimmedSearch,
          skip,
          limit,
        );
      }

      total = ranked.total;
      if (ranked.ids.length === 0) {
        products = [];
      } else {
        const found = await Product.find({ _id: { $in: ranked.ids } }, ADMIN_LIST_PROJECTION)
          .populate('categories', 'title')
          .lean();
        products = sortProductsByIdOrder(found, ranked.ids) as unknown as AdminProductRow[];
      }
    } else if (trimmedSearch.length === 1) {
      total = await Product.countDocuments(filter);
      products = (await Product.find(filter, ADMIN_LIST_PROJECTION)
        .populate('categories', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()) as unknown as AdminProductRow[];
    } else {
      total = await Product.countDocuments(filter);
      products = (await Product.find(filter, ADMIN_LIST_PROJECTION)
        .populate('categories', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()) as unknown as AdminProductRow[];
    }

    const ratings = await ratingsPromise;

    const ratingMap: Record<string, { avgRating: number; reviewCount: number }> = {};
    for (const r of ratings) ratingMap[String(r._id)] = { avgRating: r.avgRating, reviewCount: r.reviewCount };

    const enriched = products.map((p) => ({
      ...p,
      avgRating:   +(ratingMap[String(p._id)]?.avgRating   ?? 0).toFixed(1),
      reviewCount:   ratingMap[String(p._id)]?.reviewCount ?? 0,
    }));

    return NextResponse.json(
      { success: true, data: enriched, total, page, totalPages: Math.ceil(total / limit) },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/admin/products]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** POST /api/admin/products — create a new product */
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();

    const body = await req.json();
    const deactivateError = await rejectManagerStatusChange(req, body, { isCreate: true });
    if (deactivateError) return deactivateError;

    const {
      name,
      price,
      originalPrice,
      stock,
      status,
      about,
      images,
      imagePublicIds,
      videos,
      videoPublicIds,
      specifications,
      specificationOrder,
      metaTitle,
      metaDescription,
      features,
      brands,
      weightKg,
      isUsed,
    } = body;

    const categoryIds = resolveProductCategoryIds(body);

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Product name is required.' }, { status: 400 });
    }
    if (!categoryIds) {
      return NextResponse.json({ success: false, message: 'At least one category is required.' }, { status: 400 });
    }

    const tax = await validateProductTaxonomy(categoryIds);
    if (!tax.ok) {
      return NextResponse.json({ success: false, message: tax.message }, { status: tax.status });
    }
    const pricing = productPricingFromBody({ features, originalPrice, price });
    if (!pricing.ok) {
      return NextResponse.json({ success: false, message: pricing.message }, { status: 400 });
    }

    const parsedWeight = parseWeightKg(weightKg);
    if (parsedWeight == null) {
      return NextResponse.json(
        { success: false, message: 'Weight (kg) is required and must be greater than 0.' },
        { status: 400 },
      );
    }

    const product = await Product.create({
      name: name.trim(),
      categories: toObjectIdArray(categoryIds),
      ...(pricing.price != null ? { price: pricing.price } : {}),
      originalPrice: pricing.originalPrice,
      stock: Number(stock ?? 0),
      weightKg: parsedWeight,
      status: status ?? 'active',
      about: about?.trim() ?? '',
      images: images ?? [],
      imagePublicIds: imagePublicIds ?? [],
      videos: videos ?? [],
      videoPublicIds: videoPublicIds ?? [],
      specifications: specifications ?? {},
      specificationOrder: Array.isArray(specificationOrder)
        ? specificationOrder.map((k: unknown) => String(k).trim()).filter(Boolean)
        : [],
      metaTitle: metaTitle?.trim() ?? '',
      metaDescription: metaDescription?.trim() ?? '',
      features: sanitizeProductFeatures(features),
      brands: sanitizeProductBrands(brands),
      isUsed: Boolean(isUsed),
    });

    const populated = await product.populate([{ path: 'categories', select: 'title' }]);

    return NextResponse.json(
      { success: true, message: 'Product created successfully.', data: populated },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/admin/products]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
