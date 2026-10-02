import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import BlogPost from '@/backend/models/BlogPost.model';
import { toBlogPost } from '@/backend/lib/blogPosts';
import { ensureUniqueBlogSlug } from '@/backend/lib/blogSlugUnique';
import { requireAdmin } from '@/backend/lib/adminAuth';
import { validateBlogWriteBody } from '@/lib/blogValidation';

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
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const docs = await BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: docs.map((d) => toBlogPost(d as never)) });
  } catch (error) {
    console.error('[GET /api/admin/blogs]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await req.json();
    const { data, errors } = validateBlogWriteBody(body, true);
    if (!data) {
      const firstError = Object.values(errors)[0] ?? 'Please check the form.';
      return NextResponse.json({ success: false, message: firstError, errors }, { status: 422 });
    }

    const slug = await ensureUniqueBlogSlug(data.slug);
    const doc = await BlogPost.create({ ...data, slug });

    return NextResponse.json(
      { success: true, message: 'Blog post created.', data: toBlogPost(doc) },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/admin/blogs]', error);
    const msg =
      error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000
        ? 'That permalink is already in use. Choose another URL slug.'
        : error && typeof error === 'object' && 'errors' in error
          ? Object.values((error as { errors: Record<string, { message?: string }> }).errors)
              .map((e) => e.message)
              .filter(Boolean)
              .join(' ') || 'Validation failed.'
          : 'Server error.';
    const status = msg !== 'Server error.' ? 422 : 500;
    return NextResponse.json({ success: false, message: msg }, { status });
  }
}
