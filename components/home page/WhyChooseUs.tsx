'use client';

import type { ReactNode } from 'react';
import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';
import type { HomeWhyChooseUsContent } from '@/lib/sitePages.types';
import {
  homeCardBodyLight,
  homeCardTitleLight,
  homeSectionDescriptionLight,
  homeSectionEyebrowLight,
  homeSectionTitleLight,
} from '@/lib/homeSectionTypography';

type ReasonIcon = {
  iconAlt: string;
  icon: ReactNode;
};

const reasonIcons: ReasonIcon[] = [
  {
    iconAlt: 'Premium quality commercial kitchen equipment manufacturing icon',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    iconAlt: 'Nationwide delivery and installation across Pakistan icon',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    iconAlt: 'Custom commercial kitchen design and fabrication icon',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    iconAlt: 'Expert after-sales support for commercial kitchen equipment icon',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    iconAlt: 'One-year warranty on commercial kitchen equipment icon',
    icon: (
      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

interface WhyChooseUsProps {
  content?: HomeWhyChooseUsContent;
}

const WhyChooseUs = ({ content: contentProp }: WhyChooseUsProps) => {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.whyChooseUs;
  const reasons = content.reasons.map((reason, i) => ({
    ...reason,
    ...(reasonIcons[i] ?? reasonIcons[0]),
  }));

  return (
    <section className="border-t border-gray-200 bg-[#E3E6E6] py-8 sm:py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <span className={`mb-3 inline-flex flex-wrap items-center justify-center gap-1.5 sm:mb-4 sm:gap-2 ${homeSectionEyebrowLight}`}>
            <span className="h-px w-5 bg-[#0F4C69] sm:w-6" />
            {content.eyebrowBefore} <span className="text-[#E36630]">{content.eyebrowHighlight}</span>
            <span className="h-px w-5 bg-[#0F4C69] sm:w-6" />
          </span>
          <h2 className={`mb-3 px-1 sm:mb-4 ${homeSectionTitleLight}`}>
            {content.title}
          </h2>
          <p className={`mx-auto max-w-2xl px-1 ${homeSectionDescriptionLight}`}>
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div
              key={`${reason.title}-${i}`}
              className={`group rounded-lg border border-gray-100 bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.10)] transition-all duration-300 hover:border-[#E36630] hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] sm:rounded-xl sm:p-5 md:p-6 ${
                i === reasons.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div
                role="img"
                aria-label={reason.iconAlt}
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E36630]/10 text-[#E36630] transition-colors duration-300 group-hover:bg-[#E36630] group-hover:text-white sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl"
              >
                {reason.icon}
              </div>
              <h3 className={`mb-1.5 transition-colors duration-300 group-hover:text-[#E36630] sm:mb-2 ${homeCardTitleLight}`}>
                {reason.title}
              </h3>
              <p className={homeCardBodyLight}>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
