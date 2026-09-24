'use client';

import Image from 'next/image';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutCeoAwardContent } from '@/lib/aboutPage.types';

interface CeoAwardSectionProps {
  content?: AboutCeoAwardContent;
}

const CeoAwardSection = ({ content: contentProp }: CeoAwardSectionProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.ceoAward;

  return (
    <section className="border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
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
              <p className="pt-2 font-semibold text-gray-900">
                — {content.signatureName}
                <br />
                <span className="text-sm font-medium text-[#0F4C69]">{content.signatureRole}</span>
              </p>
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

          <div className="relative mx-auto w-full max-w-[480px] lg:mx-0 lg:ml-auto">
            <div className="relative aspect-[1536/1460] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E36630]" />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-[#0F4C69] px-6 py-4 text-white shadow-lg md:block">
              <p className="text-lg font-bold leading-tight">{content.imageBadgeLine1}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/70">{content.imageBadgeLine2}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoAwardSection;
