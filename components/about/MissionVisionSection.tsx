'use client';

import Image from 'next/image';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutIntroHeader } from '@/lib/aboutPage.types';

const logos = Array.from({ length: 44 }, (_, i) => ({
  id: String(i + 1),
  logo: `/Images/Logo Final/logo${i + 1}.webp`,
  name: `Client ${i + 1}`,
}));

interface MissionVisionSectionProps {
  intro?: AboutIntroHeader;
}

const MissionVisionSection = ({ intro: introProp }: MissionVisionSectionProps) => {
  const intro = introProp ?? DEFAULT_ABOUT_PAGE_CONFIG.clientLogos;

  return (
    <section className="border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
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

        <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {logos.map((logo) => (
            <div key={logo.id} className="group flex items-center justify-center">
              <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E36630] hover:shadow-md">
                <Image
                  src={logo.logo}
                  alt={logo.name}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/80x80/E36630/ffffff?text=${logo.id}`;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
