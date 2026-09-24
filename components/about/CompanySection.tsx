'use client';

import Image from 'next/image';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutCompanyContent } from '@/lib/aboutPage.types';

interface CompanySectionProps {
  content?: AboutCompanyContent;
}

const CompanySection = ({ content: contentProp }: CompanySectionProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.company;

  return (
    <section className="border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                width={600}
                height={700}
                className="w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E36630]" />
            </div>

            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl bg-[#0F4C69] px-6 py-4 text-white shadow-lg md:block">
              <p className="text-3xl font-bold leading-none">{content.floatBadgeValue}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/70">{content.floatBadgeLabel}</p>
            </div>
          </div>

          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#0F4C69]">
              <span className="h-px w-8 bg-[#0F4C69]" />
              {content.eyebrow}
              <span className="h-px w-8 bg-[#0F4C69]" />
            </span>

            <h2 className="mb-5 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {content.titleBefore}{' '}
              <span className="text-[#E36630]">{content.titleHighlight}</span>
            </h2>

            <div className="mb-6 h-1 w-16 rounded-full bg-[#E36630]" />

            <div className="space-y-4 text-base leading-relaxed text-gray-500">
              {content.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8 sm:grid-cols-4">
              {content.highlights.map((item) => (
                <div key={item.label} className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-[#E36630]">{item.value}</p>
                  <p className="mt-0.5 text-xs leading-snug text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
