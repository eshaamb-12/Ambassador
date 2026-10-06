import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/backend/config/db';
import SitePage from '@/backend/models/SitePage.model';
import { mergeAboutPageConfig } from '@/lib/aboutPageConfig.util';
import { mergeBlogPageConfig } from '@/lib/blogPageConfig.util';
import { mergeBranchesPageConfig } from '@/lib/branchesPageConfig.util';
import { mergeGalleryPageConfig } from '@/lib/galleryPageConfig.util';
import { mergeHomePageConfig } from '@/lib/homePageConfig.util';
import type { AboutPageConfig } from '@/lib/aboutPage.types';
import type { BlogPageConfig } from '@/lib/blogPage.types';
import type { BranchesPageConfig } from '@/lib/branchesPage.types';
import type { GalleryPageConfig } from '@/lib/galleryPage.types';
import { MANAGED_PAGES, type HomePageConfig, type ManagedPageSlug } from '@/lib/sitePages.types';

export function isManagedPageSlug(slug: string): slug is ManagedPageSlug {
  return MANAGED_PAGES.some((p) => p.slug === slug);
}

export async function getHomePageConfig(): Promise<HomePageConfig> {
  noStore();
  try {
    await connectDB();
    const doc = await SitePage.findOne({ slug: 'home' }).lean();
    if (!doc?.content) return mergeHomePageConfig(null);
    return mergeHomePageConfig(doc.content as Record<string, unknown>);
  } catch (error) {
    console.error('[getHomePageConfig]', error);
    return mergeHomePageConfig(null);
  }
}

export async function saveHomePageConfig(config: HomePageConfig): Promise<HomePageConfig> {
  await connectDB();
  const meta = MANAGED_PAGES.find((p) => p.slug === 'home')!;
  const content = mergeHomePageConfig(config as unknown as Record<string, unknown>);
  await SitePage.findOneAndUpdate(
    { slug: 'home' },
    { $set: { title: meta.title, content } },
    { upsert: true, new: true },
  );
  return content;
}

export async function getAboutPageConfig(): Promise<AboutPageConfig> {
  noStore();
  try {
    await connectDB();
    const doc = await SitePage.findOne({ slug: 'about' }).lean();
    if (!doc?.content) return mergeAboutPageConfig(null);
    return mergeAboutPageConfig(doc.content as Record<string, unknown>);
  } catch (error) {
    console.error('[getAboutPageConfig]', error);
    return mergeAboutPageConfig(null);
  }
}

export async function saveAboutPageConfig(config: AboutPageConfig): Promise<AboutPageConfig> {
  await connectDB();
  const meta = MANAGED_PAGES.find((p) => p.slug === 'about')!;
  const content = mergeAboutPageConfig(config);
  await SitePage.findOneAndUpdate(
    { slug: 'about' },
    { $set: { title: meta.title, content } },
    { upsert: true, new: true },
  );
  return content;
}

export async function getBlogPageConfig(): Promise<BlogPageConfig> {
  noStore();
  try {
    await connectDB();
    const doc = await SitePage.findOne({ slug: 'blog' }).lean();
    if (!doc?.content) return mergeBlogPageConfig(null);
    return mergeBlogPageConfig(doc.content as Record<string, unknown>);
  } catch (error) {
    console.error('[getBlogPageConfig]', error);
    return mergeBlogPageConfig(null);
  }
}

export async function saveBlogPageConfig(config: BlogPageConfig): Promise<BlogPageConfig> {
  await connectDB();
  const meta = MANAGED_PAGES.find((p) => p.slug === 'blog')!;
  const content = mergeBlogPageConfig(config);
  await SitePage.findOneAndUpdate(
    { slug: 'blog' },
    { $set: { title: meta.title, content } },
    { upsert: true, new: true },
  );
  return content;
}

export async function getGalleryPageConfig(): Promise<GalleryPageConfig> {
  noStore();
  try {
    await connectDB();
    const doc = await SitePage.findOne({ slug: 'gallery' }).lean();
    if (!doc?.content) return mergeGalleryPageConfig(null);
    return mergeGalleryPageConfig(doc.content as Record<string, unknown>);
  } catch (error) {
    console.error('[getGalleryPageConfig]', error);
    return mergeGalleryPageConfig(null);
  }
}

export async function saveGalleryPageConfig(config: GalleryPageConfig): Promise<GalleryPageConfig> {
  await connectDB();
  const meta = MANAGED_PAGES.find((p) => p.slug === 'gallery')!;
  const content = mergeGalleryPageConfig(config);
  await SitePage.findOneAndUpdate(
    { slug: 'gallery' },
    { $set: { title: meta.title, content } },
    { upsert: true, new: true },
  );
  return content;
}

export async function getBranchesPageConfig(): Promise<BranchesPageConfig> {
  noStore();
  try {
    await connectDB();
    const doc = await SitePage.findOne({ slug: 'branches' }).lean();
    if (!doc?.content) return mergeBranchesPageConfig(null);
    return mergeBranchesPageConfig(doc.content as Record<string, unknown>);
  } catch (error) {
    console.error('[getBranchesPageConfig]', error);
    return mergeBranchesPageConfig(null);
  }
}

export async function saveBranchesPageConfig(config: BranchesPageConfig): Promise<BranchesPageConfig> {
  await connectDB();
  const meta = MANAGED_PAGES.find((p) => p.slug === 'branches')!;
  const content = mergeBranchesPageConfig(config);
  await SitePage.findOneAndUpdate(
    { slug: 'branches' },
    { $set: { title: meta.title, content } },
    { upsert: true, new: true },
  );
  return content;
}
