import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import {
  PUBLIC_PRODUCTS_PAGE_LIMIT,
  queryPublicProducts,
} from '@/backend/lib/queryPublicProducts';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

/** GET /api/products?page=1&limit=12&search=...&category=... */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const seedRaw = parseInt(searchParams.get('seed') ?? '', 10);

    const result = await queryPublicProducts({
      search: searchParams.get('search') ?? '',
      categoryTitle: searchParams.get('category') ?? '',
      page: Math.max(1, parseInt(searchParams.get('page') ?? '1', 10)),
      limit: Math.min(
        50,
        parseInt(searchParams.get('limit') ?? String(PUBLIC_PRODUCTS_PAGE_LIMIT), 10),
      ),
      minPrice: parseFloat(searchParams.get('minPrice') ?? '0') || 0,
      maxPrice: parseFloat(searchParams.get('maxPrice') ?? '0') || 0,
      brandsRaw: searchParams.get('brands') ?? '',
      featsRaw: searchParams.get('features') ?? '',
      onSale: searchParams.get('sale') === '1',
      sortBy: searchParams.get('sort') ?? 'newest',
      excludeId: searchParams.get('exclude') ?? '',
      usedOnly: searchParams.get('used') === '1' || searchParams.get('used') === 'true',
      seed: Number.isFinite(seedRaw) ? seedRaw : undefined,
    });

    return NextResponse.json({ success: true, ...result }, { status: 200, headers: NO_STORE });
  } catch (error) {
    console.error('[GET /api/products]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
