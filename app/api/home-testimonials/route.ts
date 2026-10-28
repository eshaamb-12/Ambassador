import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import HomeTestimonial from '@/backend/models/HomeTestimonial.model';

/** Public GET — active home page testimonial cards */
export async function GET() {
  try {
    await connectDB();
    const items = await HomeTestimonial.find({ status: 'active' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('name profession videoUrl sortOrder')
      .lean();

    const data = items.map((d) => ({
      _id: String(d._id),
      name: d.name,
      profession: d.profession,
      videoUrl: d.videoUrl ?? '',
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/home-testimonials]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
