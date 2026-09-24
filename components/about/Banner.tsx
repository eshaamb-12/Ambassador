'use client';

import Image from 'next/image';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutBannerContent } from '@/lib/aboutPage.types';

interface BannerProps {
  content?: AboutBannerContent;
}

const Banner = ({ content: contentProp }: BannerProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.banner;

  return (
    <div className="relative h-96 overflow-hidden md:h-[600px]">
      <Image
        src={content.imageUrl}
        alt={content.imageAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />

      <div className="absolute inset-0 flex items-center justify-start">
        <div className="w-full max-w-[640px] px-4 text-center text-white sm:px-6">
          <h1 className="mb-4 text-4xl font-bold leading-tight text-[#E36630] md:mb-6 md:text-5xl">
            {content.title}
          </h1>
          <p className="mx-auto max-w-[520px] text-lg font-semibold leading-relaxed md:text-xl lg:text-2xl">
            {content.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
