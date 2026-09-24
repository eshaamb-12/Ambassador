'use client';

import Banner from '@/components/about/Banner';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import MissionVisionValues from '@/components/about/MissionVisionValues';
import CompanySection from '@/components/about/CompanySection';
import CeoAwardSection from '@/components/about/CeoAwardSection';
import CertificatesSection from '@/components/about/CertificatesSection';
import TestimonialsSection from '@/components/about/TestimonialsSection';
import FAQSection from '@/components/about/FAQSection';
import SignupBanner from '@/components/common/signup-banner';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutPageConfig, AboutSectionId } from '@/lib/aboutPage.types';

const SECTION_WRAPPER: Record<AboutSectionId, 'none' | 'white' | 'gray'> = {
  banner: 'none',
  company: 'white',
  ceoAward: 'gray',
  certificates: 'white',
  missionValues: 'white',
  clientLogos: 'gray',
  testimonials: 'white',
  faq: 'gray',
  signup: 'none',
};

interface AboutPageProps {
  config?: AboutPageConfig;
}

const AboutPage = ({ config: configProp }: AboutPageProps) => {
  const config = configProp ?? DEFAULT_ABOUT_PAGE_CONFIG;

  const renderSection = (id: AboutSectionId) => {
    switch (id) {
      case 'banner':
        return <Banner content={config.banner} />;
      case 'company':
        return <CompanySection content={config.company} />;
      case 'ceoAward':
        return <CeoAwardSection content={config.ceoAward} />;
      case 'certificates':
        return <CertificatesSection intro={config.certificates} />;
      case 'missionValues':
        return <MissionVisionValues content={config.missionValues} />;
      case 'clientLogos':
        return <MissionVisionSection intro={config.clientLogos} />;
      case 'testimonials':
        return <TestimonialsSection content={config.testimonials} />;
      case 'faq':
        return <FAQSection content={config.faq} />;
      case 'signup':
        return <SignupBanner content={config.signup} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {config.sections
        .filter((s) => s.enabled)
        .map((section) => {
          const inner = renderSection(section.id);
          const wrap = SECTION_WRAPPER[section.id];
          if (wrap === 'white') {
            return (
              <div key={section.id} className="bg-white">
                {inner}
              </div>
            );
          }
          if (wrap === 'gray') {
            return (
              <div key={section.id} className="bg-[#E3E6E6]">
                {inner}
              </div>
            );
          }
          return <div key={section.id}>{inner}</div>;
        })}
    </div>
  );
};

export default AboutPage;
