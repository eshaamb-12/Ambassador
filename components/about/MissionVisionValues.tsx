'use client';

import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutMissionValuesContent } from '@/lib/aboutPage.types';

interface MissionVisionValuesProps {
  content?: AboutMissionValuesContent;
}

const MissionVisionValues = ({ content: contentProp }: MissionVisionValuesProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.missionValues;
  const { intro } = content;

  return (
    <section className="border-t border-gray-200 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#0F4C69]">
            <span className="h-px w-8 bg-[#0F4C69]" />
            {intro.eyebrow}
            <span className="h-px w-8 bg-[#0F4C69]" />
          </span>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {intro.title} <span className="text-[#E36630]">{intro.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            {intro.description}
          </p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#E36630]" />
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-[#0F4C69] p-8 text-white shadow-lg">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/5" />
            <div className="relative">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#E36630]">
                {content.missionLabel}
              </p>
              <h3 className="mb-4 text-2xl font-bold leading-snug">{content.missionTitle}</h3>
              <p className="text-sm leading-relaxed text-white/75">{content.missionBody}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#E36630] p-8 text-white shadow-lg">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">
                {content.visionLabel}
              </p>
              <h3 className="mb-4 text-2xl font-bold leading-snug">{content.visionTitle}</h3>
              <p className="text-sm leading-relaxed text-white/80">{content.visionBody}</p>
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900">{content.valuesTitle}</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">{content.valuesSubtitle}</p>
        </div>

        <div className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.valuesImageUrl} alt="Values" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default MissionVisionValues;
