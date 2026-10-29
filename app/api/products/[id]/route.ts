import { NextRequest, NextResponse } from 'next/server';
import { getPublicProductDetail } from '@/backend/lib/getPublicProductDetail';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

/** GET /api/products/[id] — single active product by Mongo _id or slug */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product not found.', code: 'not_found' },
        { status: 404, headers: NO_STORE },
      );
    }

    const result = await getPublicProductDetail(id);

    if (result.status === 'unavailable') {
      return NextResponse.json(
        {
          success: false,
          message: 'This product is no longer available.',
          code: 'unavailable',
        },
        { status: 404, headers: NO_STORE },
      );
    }

    if (result.status === 'not_found') {
      return NextResponse.json(
        { success: false, message: 'Product not found.', code: 'not_found' },
        { status: 404, headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          product: result.product,
          reviews: result.reviews,
        },
      },
      { status: 200, headers: NO_STORE },
    );
  } catch (error) {
    console.error('[GET /api/products/[id]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
