'use client';

import { DEFAULT_GALLERY_PAGE_CONFIG } from '@/lib/galleryPage.defaults';
import type { GalleryHeroContent } from '@/lib/galleryPage.types';

type GalleryHeroSectionProps = {
  content?: GalleryHeroContent;
};

const GalleryHeroSection = ({ content: contentProp }: GalleryHeroSectionProps) => {
  const content = contentProp ?? DEFAULT_GALLERY_PAGE_CONFIG.hero;
  const src = content.imageUrl?.trim() || DEFAULT_GALLERY_PAGE_CONFIG.hero.imageUrl;

  return (
    <div className="relative h-96 bg-gray-900 py-16 text-white md:h-[600px]">
      <div className="absolute inset-0">
        <img
          src={src}
          alt={content.imageAlt || 'Gallery & Reviews'}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/1920x400/E36630/ffffff?text=Gallery+Reviews';
          }}
        />
      </div>
      <div className="relative z-10 flex h-full items-center justify-center text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold drop-shadow-lg md:text-5xl">{content.title}</h1>
          <p className="text-xl text-orange-100 drop-shadow-lg md:text-2xl">{content.subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default GalleryHeroSection;
