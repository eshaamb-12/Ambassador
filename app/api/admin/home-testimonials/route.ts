import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/backend/config/db';
import HomeTestimonial from '@/backend/models/HomeTestimonial.model';
import { requireAdmin, rejectManagerStatusChange } from '@/backend/lib/adminAuth';

function revalidateHome() {
  revalidatePath('/');
}

/** GET /api/admin/home-testimonials */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() ?? '';

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await HomeTestimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/admin/home-testimonials]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** POST /api/admin/home-testimonials */
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await req.json();
    const deactivateError = await rejectManagerStatusChange(req, body, { isCreate: true });
    if (deactivateError) return deactivateError;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const profession = typeof body.profession === 'string' ? body.profession.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const videoUrl = typeof body.videoUrl === 'string' ? body.videoUrl.trim() : '';
    const status = body.status === 'inactive' ? 'inactive' : ('active' as const);
    const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder) || 0;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Name is required.' }, { status: 400 });
    }
    if (!profession) {
      return NextResponse.json({ success: false, message: 'Profession is required.' }, { status: 400 });
    }
    if (!videoUrl) {
      return NextResponse.json(
        { success: false, message: 'Video is required (upload from PC or paste a link).' },
        { status: 400 },
      );
    }

    const doc = await HomeTestimonial.create({
      name,
      profession,
      description,
      videoUrl,
      status,
      sortOrder,
    });

    revalidateHome();
    return NextResponse.json(
      { success: true, message: 'Testimonial created.', data: doc.toObject() },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/admin/home-testimonials]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
