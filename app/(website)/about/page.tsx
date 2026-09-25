import AboutPage from '@/client/pages/about/page';
import { getAboutPageConfig } from '@/backend/lib/loadSitePage';

/** CMS content must be read from Mongo on each request — not baked in at build time. */
export const dynamic = 'force-dynamic';

export default async function About() {
  const config = await getAboutPageConfig();
  return <AboutPage config={config} />;
}
