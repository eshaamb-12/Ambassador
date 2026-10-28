'use client';

import Image from 'next/image';
import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';
import type { HomeClientLogosContent } from '@/lib/sitePages.types';
import {
  homeSectionDescriptionLight,
  homeSectionEyebrowLight,
  homeSectionTitleLight,
} from '@/lib/homeSectionTypography';

/**
 * Client logo slider — edit this list to swap images or reorder.
 * Paths are under `/public` (leading `/` in URL).
 */
const CLIENT_LOGO_IMAGES: string[] = [
  '/Images/SizeUpdated/Avari-Xpress.png',
  '/Images/SizeUpdated/BABA-BAKERS.png',
  '/Images/SizeUpdated/Baked.png',
  '/Images/SizeUpdated/Bamboo-Union.png',
  '/Images/SizeUpdated/Brim.png',
  '/Images/SizeUpdated/Burger-Lab-Logo.png',
  '/Images/SizeUpdated/Cafe-Aylanto.png',
  '/Images/SizeUpdated/Cafe-Brie.png',
  '/Images/SizeUpdated/CarreFour.png',
  '/Images/SizeUpdated/Cheezious-Logo.png',
  '/Images/SizeUpdated/CN.png',
  '/Images/SizeUpdated/CoThm-College.png',
  '/Images/SizeUpdated/Crave-Kitchen.png',
  '/Images/SizeUpdated/DAHLIA.png',
  '/Images/SizeUpdated/DAN-And-DAN.png',
  '/Images/SizeUpdated/Dominos.png',
  '/Images/SizeUpdated/DOUBLESHOT.png',
  '/Images/SizeUpdated/Drip.png',
  '/Images/SizeUpdated/English-Tea-House.png',
  '/Images/SizeUpdated/FRED.png',
  '/Images/SizeUpdated/Fuoco.png',
  '/Images/SizeUpdated/Howdy.png',
  '/Images/SizeUpdated/Jalal-Sons.png',
  '/Images/SizeUpdated/Johnny-Jugnu.png',
  '/Images/SizeUpdated/Khan-baba.png',
  '/Images/SizeUpdated/KITE.png',
  '/Images/SizeUpdated/LUMS-UNI.png',
  '/Images/SizeUpdated/MANDARIN-ORIENTAL.png',
  '/Images/SizeUpdated/MarriottHotel.png',
  '/Images/SizeUpdated/Nisa-Sultan.png',
  '/Images/SizeUpdated/Pc-Hotel.png',
  '/Images/SizeUpdated/Poly-MATH.png',
  '/Images/SizeUpdated/Pop-Up-Kitchen.png',
  '/Images/SizeUpdated/Rina-Kitchen.png',
  '/Images/SizeUpdated/Salt-Logo.png',
  '/Images/SizeUpdated/Sarpinos.png',
  '/Images/SizeUpdated/Sashas.png',
  '/Images/SizeUpdated/Serena-Hotel.png',
  '/Images/SizeUpdated/Steak-Away.png',
  '/Images/SizeUpdated/Subway.png',
  '/Images/SizeUpdated/Suleman-Logo.png',
  '/Images/SizeUpdated/Sumo.png',
  '/Images/SizeUpdated/Tariq-Sweets.png',
  '/Images/SizeUpdated/The-Cakery.png',
  '/Images/SizeUpdated/The-Coffee-Bean.png',
  '/Images/SizeUpdated/Third-Culture.png',
  '/Images/SizeUpdated/TLT.png',
];

const logos = CLIENT_LOGO_IMAGES.map((logo, i) => ({
  id: String(i + 1),
  logo,
  name: `Client ${i + 1}`,
}));

const SEGMENT_GAP = 'gap-10 sm:gap-12 md:gap-14 lg:gap-16';
/** Matches gap so the -50% loop seam stays even. */
const SEGMENT_TAIL = 'pr-10 sm:pr-12 md:pr-14 lg:pr-16';

const FADE_LEFT =
  'pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#EBF0F4] to-transparent sm:w-16 md:w-24';
const FADE_RIGHT =
  'pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#EBF0F4] to-transparent sm:w-16 md:w-24';

interface LogoCardProps {
  logo: { id: string; logo: string; name: string };
}

const LogoCard = ({ logo }: LogoCardProps) => (
  <div className="group flex shrink-0 items-center">
    <Image
      src={logo.logo}
      alt={logo.name}
      width={400}
      height={160}
      className="
        h-auto w-auto max-h-14 max-w-[7.5rem] object-contain object-center
        sm:max-h-16 sm:max-w-[8.5rem]
        md:max-h-[4.25rem] md:max-w-[10rem]
        lg:max-h-24 lg:max-w-none
        transition-transform duration-300 group-hover:scale-[1.02]
      "
      sizes="(max-width: 1023px) 160px, 400px"
      draggable={false}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://placehold.co/160x64/EBF0F4/0F4C69?text=${logo.id}`;
      }}
    />
  </div>
);

function LogoSegment({
  items,
  prefix,
  ariaHidden,
}: {
  items: typeof logos;
  prefix: string;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 flex-nowrap items-center ${SEGMENT_GAP} ${SEGMENT_TAIL}`}
      aria-hidden={ariaHidden}
    >
      {items.map((item) => (
        <LogoCard key={`${prefix}-${item.id}`} logo={item} />
      ))}
    </div>
  );
}

interface ClientLogosSliderProps {
  intro?: HomeClientLogosContent;
  /** Compact logo strip (e.g. directly under hero). */
  variant?: 'strip' | 'full';
}

const ClientLogosSlider = ({
  intro: introProp,
  variant = 'strip',
}: ClientLogosSliderProps) => {
  const intro = introProp ?? DEFAULT_HOME_PAGE_CONFIG.clientLogos;
  const showIntro = variant === 'full';

  return (
    <>
      <style>{`
        @keyframes client-logos-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .client-logos-marquee-inner {
          display: flex;
          width: max-content;
          flex-wrap: nowrap;
          align-items: center;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          animation: client-logos-marquee 70s linear infinite;
        }
        @media (min-width: 640px) {
          .client-logos-marquee-inner {
            animation-duration: 60s;
          }
        }
        @media (min-width: 1024px) {
          .client-logos-marquee-inner {
            animation-duration: 50s;
          }
        }
        .client-logos-marquee-track:hover .client-logos-marquee-inner {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .client-logos-marquee-inner {
            animation: none;
            transform: none;
          }
        }
      `}</style>

      <section
        className={`border-[#0F4C69]/10 bg-[#EBF0F4] ${
          showIntro ? 'border-t border-gray-200 py-8 sm:py-10 md:py-16' : 'border-y py-6 sm:py-7 md:py-8 lg:py-10'
        }`}
      >
        {showIntro ? (
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center sm:mb-10 md:mb-12">
              <span className={`mb-3 inline-flex items-center gap-1.5 sm:mb-4 sm:gap-2 ${homeSectionEyebrowLight}`}>
                <span className="h-px w-6 bg-[#0F4C69] sm:w-8" />
                {intro.eyebrow}
                <span className="h-px w-6 bg-[#0F4C69] sm:w-8" />
              </span>
              <h2 className={`mb-3 sm:mb-4 ${homeSectionTitleLight}`}>
                {intro.title} <span className="text-[#E36630]">{intro.titleHighlight}</span>
              </h2>
              <p className={`mx-auto max-w-2xl px-1 ${homeSectionDescriptionLight}`}>
                {intro.description}
              </p>
              <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#E36630] sm:mt-5 sm:w-16" />
            </div>
          </div>
        ) : null}

        <div className="overflow-x-hidden overflow-y-visible">
          <div className="client-logos-marquee-track relative flex min-h-14 items-center sm:min-h-16 md:min-h-[4.25rem] lg:min-h-0">
            <div className={FADE_LEFT} aria-hidden />
            <div className={FADE_RIGHT} aria-hidden />

            <div className="client-logos-marquee-inner">
              <LogoSegment items={logos} prefix="a" />
              <LogoSegment items={logos} prefix="b" ariaHidden />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientLogosSlider;
