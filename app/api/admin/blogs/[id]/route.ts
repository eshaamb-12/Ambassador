import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/backend/config/db';
import BlogPost from '@/backend/models/BlogPost.model';
import { toBlogPost } from '@/backend/lib/blogPosts';
import { requireAdmin, requireFullAdmin } from '@/backend/lib/adminAuth';
import { ensureUniqueBlogSlug } from '@/backend/lib/blogSlugUnique';
import { validateBlogWriteBody } from '@/lib/blogValidation';

function mongooseValidationMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object' || !('errors' in error)) return null;
  const messages = Object.values((error as { errors: Record<string, { message?: string }> }).errors)
    .map((e) => e.message)
    .filter(Boolean);
  return messages.length ? messages.join(' ') : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const doc = await BlogPost.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: toBlogPost(doc as never) });
  } catch (error) {
    console.error('[GET /api/admin/blogs/[id]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const doc = await BlogPost.findById(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    const body = await req.json();

    const merged: Record<string, unknown> = {
      title: body.title ?? doc.title,
      slug: body.slug ?? doc.slug,
      excerpt: body.excerpt ?? doc.excerpt,
      content: body.content ?? doc.content,
      coverImage: body.coverImage ?? doc.coverImage,
      coverImagePublicId: body.coverImagePublicId ?? doc.coverImagePublicId,
      author: body.author ?? doc.author,
      category: body.category ?? doc.category,
      tags: body.tags ?? doc.tags,
      status: body.status ?? doc.status,
      publishedAt: body.publishedAt ?? doc.publishedAt,
    };

    const { data, errors } = validateBlogWriteBody(merged, false);
    if (!data) {
      const firstError = Object.values(errors)[0] ?? 'Please check the form.';
      return NextResponse.json({ success: false, message: firstError, errors }, { status: 422 });
    }

    if (!data.title) {
      return NextResponse.json({ success: false, message: 'Title cannot be empty.' }, { status: 400 });
    }
    if (!data.content) {
      return NextResponse.json({ success: false, message: 'Content is required.' }, { status: 422 });
    }

    const slug =
      data.slug !== doc.slug ? await ensureUniqueBlogSlug(data.slug, doc._id) : doc.slug;

    doc.title = data.title;
    doc.slug = slug;
    doc.excerpt = data.excerpt;
    doc.content = data.content;
    doc.coverImage = data.coverImage;
    doc.coverImagePublicId = data.coverImagePublicId;
    doc.author = data.author;
    doc.category = data.category;
    doc.tags = data.tags;
    doc.status = data.status;
    doc.publishedAt = data.publishedAt;

    await doc.save();

    return NextResponse.json(
      { success: true, message: 'Blog post updated.', data: toBlogPost(doc) },
      { status: 200 },
    );
  } catch (error) {
    console.error('[PATCH /api/admin/blogs/[id]]', error);
    const msg = mongooseValidationMessage(error) ?? 'Server error.';
    return NextResponse.json({ success: false, message: msg }, { status: msg === 'Server error.' ? 500 : 422 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireFullAdmin(req);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog post deleted.' });
  } catch (error) {
    console.error('[DELETE /api/admin/blogs/[id]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
