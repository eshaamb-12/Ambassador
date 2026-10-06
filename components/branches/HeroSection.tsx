'use client';

import Image from 'next/image';
import { DEFAULT_BRANCHES_PAGE_CONFIG } from '@/lib/branchesPage.defaults';
import type { BranchesHeroContent } from '@/lib/branchesPage.types';

interface HeroSectionProps {
  content?: BranchesHeroContent;
}

const HeroSection = ({ content: contentProp }: HeroSectionProps) => {
  const content = contentProp ?? DEFAULT_BRANCHES_PAGE_CONFIG.hero;
  const src = content.backgroundImage?.trim() || DEFAULT_BRANCHES_PAGE_CONFIG.hero.backgroundImage;

  return (
    <section className="relative h-96 overflow-hidden bg-[#06131A] md:h-[560px]">
      <Image
        src={src}
        alt={content.imageAlt || 'Ambassador branches across Pakistan'}
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E36630]" />
            {content.badge}
          </span>
          <h1
            className="mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
          >
            {content.titleBefore}{' '}
            <span className="text-[#E36630]">{content.titleHighlight}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{content.subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
