import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import connectDB from '@/backend/config/db';
import HomeTestimonial from '@/backend/models/HomeTestimonial.model';
import { requireAdmin, requireFullAdmin, rejectManagerStatusChange } from '@/backend/lib/adminAuth';

function revalidateHome() {
  revalidatePath('/');
}

/** GET /api/admin/home-testimonials/[id] */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const doc = await HomeTestimonial.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doc }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/admin/home-testimonials/[id]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** PATCH /api/admin/home-testimonials/[id] */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const body = await req.json();
    const deactivateError = await rejectManagerStatusChange(req, body);
    if (deactivateError) return deactivateError;

    const doc = await HomeTestimonial.findById(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) {
        return NextResponse.json({ success: false, message: 'Name cannot be empty.' }, { status: 400 });
      }
      doc.name = name;
    }
    if (body.profession !== undefined) {
      const profession = String(body.profession).trim();
      if (!profession) {
        return NextResponse.json({ success: false, message: 'Profession cannot be empty.' }, { status: 400 });
      }
      doc.profession = profession;
    }
    if (body.videoUrl !== undefined) {
      const videoUrl = String(body.videoUrl).trim();
      if (!videoUrl) {
        return NextResponse.json({ success: false, message: 'Video URL cannot be empty.' }, { status: 400 });
      }
      doc.videoUrl = videoUrl;
    }
    if (body.status !== undefined) {
      doc.status = body.status === 'inactive' ? 'inactive' : 'active';
    }
    if (body.sortOrder !== undefined) {
      doc.sortOrder = Number(body.sortOrder) || 0;
    }

    await doc.save();
    revalidateHome();

    return NextResponse.json(
      { success: true, message: 'Testimonial saved.', data: doc.toObject() },
      { status: 200 },
    );
  } catch (error) {
    console.error('[PATCH /api/admin/home-testimonials/[id]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** DELETE /api/admin/home-testimonials/[id] */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireFullAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const doc = await HomeTestimonial.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    revalidateHome();
    return NextResponse.json({ success: true, message: 'Testimonial deleted.' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/admin/home-testimonials/[id]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
