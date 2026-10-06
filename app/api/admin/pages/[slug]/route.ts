import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/backend/lib/adminAuth';
import {
  getAboutPageConfig,
  getBlogPageConfig,
  getBranchesPageConfig,
  getGalleryPageConfig,
  getHomePageConfig,
  isManagedPageSlug,
  saveAboutPageConfig,
  saveBlogPageConfig,
  saveBranchesPageConfig,
  saveGalleryPageConfig,
  saveHomePageConfig,
} from '@/backend/lib/loadSitePage';
import { aboutPageConfigForSave } from '@/lib/aboutPageConfig.util';
import { blogPageConfigForSave } from '@/lib/blogPageConfig.util';
import { branchesPageConfigForSave } from '@/lib/branchesPageConfig.util';
import { galleryPageConfigForSave } from '@/lib/galleryPageConfig.util';
import { homePageConfigForSave } from '@/lib/homePageConfig.util';
import type { AboutPageConfig } from '@/lib/aboutPage.types';
import type { BlogPageConfig } from '@/lib/blogPage.types';
import type { BranchesPageConfig } from '@/lib/branchesPage.types';
import type { GalleryPageConfig } from '@/lib/galleryPage.types';
import type { HomePageConfig } from '@/lib/sitePages.types';

export const dynamic = 'force-dynamic';

/** GET /api/admin/pages/[slug] */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { slug } = await params;
  if (!isManagedPageSlug(slug)) {
    return NextResponse.json({ success: false, message: 'Unknown page.' }, { status: 404 });
  }

  try {
    if (slug === 'home') {
      const data = await getHomePageConfig();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    if (slug === 'about') {
      const data = await getAboutPageConfig();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    if (slug === 'blog') {
      const data = await getBlogPageConfig();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    if (slug === 'gallery') {
      const data = await getGalleryPageConfig();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    if (slug === 'branches') {
      const data = await getBranchesPageConfig();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: 'Not implemented.' }, { status: 501 });
  } catch (error) {
    console.error('[GET /api/admin/pages/[slug]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** PATCH /api/admin/pages/[slug] */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { slug } = await params;
  if (!isManagedPageSlug(slug)) {
    return NextResponse.json({ success: false, message: 'Unknown page.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    if (slug === 'home') {
      const saved = await saveHomePageConfig(homePageConfigForSave(body as HomePageConfig));
      revalidatePath('/');
      revalidatePath('/api/pages/home');
      return NextResponse.json(
        { success: true, message: 'Home page saved.', data: saved },
        { status: 200 },
      );
    }
    if (slug === 'about') {
      const saved = await saveAboutPageConfig(aboutPageConfigForSave(body as AboutPageConfig));
      revalidatePath('/about');
      revalidatePath('/api/pages/about');
      return NextResponse.json(
        { success: true, message: 'About page saved.', data: saved },
        { status: 200 },
      );
    }
    if (slug === 'blog') {
      const saved = await saveBlogPageConfig(blogPageConfigForSave(body as BlogPageConfig));
      revalidatePath('/blog');
      revalidatePath('/api/pages/blog');
      return NextResponse.json(
        { success: true, message: 'Blog page saved.', data: saved },
        { status: 200 },
      );
    }
    if (slug === 'gallery') {
      const saved = await saveGalleryPageConfig(galleryPageConfigForSave(body as GalleryPageConfig));
      revalidatePath('/gallery');
      revalidatePath('/api/pages/gallery');
      return NextResponse.json(
        { success: true, message: 'Gallery page saved.', data: saved },
        { status: 200 },
      );
    }
    if (slug === 'branches') {
      const saved = await saveBranchesPageConfig(branchesPageConfigForSave(body as BranchesPageConfig));
      revalidatePath('/branches');
      revalidatePath('/api/pages/branches');
      return NextResponse.json(
        { success: true, message: 'Showrooms page saved.', data: saved },
        { status: 200 },
      );
    }
    return NextResponse.json({ success: false, message: 'Not implemented.' }, { status: 501 });
  } catch (error) {
    console.error('[PATCH /api/admin/pages/[slug]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
