import AboutPage from '@/client/pages/about/page';
import { getAboutPageConfig } from '@/backend/lib/loadSitePage';

export default async function About() {
  const config = await getAboutPageConfig();
  return <AboutPage config={config} />;
}
