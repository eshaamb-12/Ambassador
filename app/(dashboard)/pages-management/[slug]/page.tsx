import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AboutPageEditor from '@/admin/pages/pages-management/AboutPageEditor';
import HomePageEditor from '@/admin/pages/pages-management/HomePageEditor';
import { getAboutPageConfig, getHomePageConfig, isManagedPageSlug } from '@/backend/lib/loadSitePage';
import { MANAGED_PAGES } from '@/lib/sitePages.types';

export default async function PageEditorAppRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isManagedPageSlug(slug)) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <p className="text-gray-600">This page is not available for editing yet.</p>
          <Link href="/pages-management" className="mt-4 inline-block text-[#0F4C69] hover:underline">
            Back to pages
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const meta = MANAGED_PAGES.find((p) => p.slug === slug)!;
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{meta.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{meta.path}</p>
        </div>
        {slug === 'home' ? <HomePageEditor initialConfig={await getHomePageConfig()} /> : null}
        {slug === 'about' ? <AboutPageEditor initialConfig={await getAboutPageConfig()} /> : null}
      </div>
    </DashboardLayout>
  );
}
