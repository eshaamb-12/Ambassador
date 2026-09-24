import connectDB from '@/backend/config/db';
import SitePage from '@/backend/models/SitePage.model';
import { mergeAboutPageConfig } from '@/lib/aboutPageConfig.util';
import { mergeHomePageConfig } from '@/lib/homePageConfig.util';
import type { AboutPageConfig } from '@/lib/aboutPage.types';
import { MANAGED_PAGES, type HomePageConfig, type ManagedPageSlug } from '@/lib/sitePages.types';

export function isManagedPageSlug(slug: string): slug is ManagedPageSlug {
  return MANAGED_PAGES.some((p) => p.slug === slug);
}

export async function getHomePageConfig(): Promise<HomePageConfig> {
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
