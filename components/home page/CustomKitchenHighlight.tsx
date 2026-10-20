'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';
import type { HomeCustomKitchenContent } from '@/lib/sitePages.types';
import {
  homeButtonCta,
  homeButtonCompact,
  homeCardBodyOnDark,
  homeCardTitle,
  homeSectionDescriptionOnDark,
  homeSectionEyebrowOnDark,
  homeSectionTitleOnDark,
} from '@/lib/homeSectionTypography';

interface CustomKitchenHighlightProps {
  content?: HomeCustomKitchenContent;
}

/** Home-page spotlight for flagship Custom Kitchen — copy aligned with `/custom-kitchen`. */
const CustomKitchenHighlight = ({ content: contentProp }: CustomKitchenHighlightProps) => {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.customKitchen;

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#0F4C69] text-white">
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#E36630]/10 blur-3xl sm:-right-24 sm:h-64 sm:w-64 md:-right-32 md:h-[480px] md:w-[480px]"
        aria-hidden
      />
      <div className="container relative mx-auto px-4 py-10 sm:py-12 md:py-20 lg:py-24">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] min-h-[220px] overflow-hidden rounded-xl shadow-2xl shadow-black/30 ring-1 ring-white/10 sm:min-h-[260px] sm:rounded-2xl md:min-h-[300px] md:aspect-[5/4] lg:aspect-auto lg:h-[min(460px,55vh)] lg:min-h-[340px]">
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
            <div className={`absolute -bottom-2.5 left-0 max-w-[calc(100%-1rem)] rounded-lg bg-[#E36630] px-3 py-1.5 uppercase tracking-wide shadow-lg sm:-bottom-3 sm:left-0 sm:max-w-none sm:rounded-xl sm:px-4 sm:py-2 md:-bottom-4 md:left-4 md:px-5 ${homeButtonCompact} text-white`}>
              {content.imageBadge}
            </div>
          </div>

          <div className="order-1 space-y-5 sm:space-y-6 lg:order-2">
            <div>
              <span className={`inline-flex items-center gap-1.5 sm:gap-2 ${homeSectionEyebrowOnDark}`}>
                <span className="h-px w-5 bg-[#E36630] sm:w-8" />
                {content.eyebrow}
                <span className="h-px w-5 bg-[#E36630] sm:w-8" />
              </span>
              <h2 className={`mt-3 sm:mt-4 ${homeSectionTitleOnDark}`}>
                {content.titleBefore}{' '}
                <span className="text-[#E36630]">{content.titleHighlight}</span>{' '}
                <span className="text-white">{content.titleAfter}</span>
              </h2>
              <p className={`mt-3 sm:mt-4 ${homeSectionDescriptionOnDark}`}>
                {content.description}
              </p>
            </div>

            <ul className="space-y-3 border-l-2 border-[#E36630]/50 pl-3.5 sm:space-y-3.5 sm:pl-4 md:space-y-4 md:pl-5">
              {content.highlights.map((item) => (
                <li key={item.title}>
                  <h3 className={`font-semibold text-white ${homeCardTitle}`}>{item.title}</h3>
                  <p className={`mt-0.5 leading-snug ${homeCardBodyOnDark}`}>{item.text}</p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:pt-2">
              <Link
                href={content.primaryCtaHref}
                className={`inline-flex w-full justify-center rounded-lg bg-[#E36630] px-5 py-3 text-center text-white shadow-lg shadow-orange-950/40 transition-colors hover:bg-[#cc5a2a] sm:w-auto sm:px-7 sm:py-3.5 ${homeButtonCta}`}
              >
                {content.primaryCta}
              </Link>
              <Link
                href={content.secondaryCtaHref}
                className={`inline-flex w-full justify-center rounded-lg border-2 border-white/35 bg-white/5 px-5 py-3 text-center text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10 sm:w-auto sm:px-7 sm:py-3.5 ${homeButtonCta}`}
              >
                {content.secondaryCta}
              </Link>
            </div>
            <p className={`leading-relaxed text-white/45 ${homeCardBodyOnDark}`}>
              Same journey and portfolio detail on our{' '}
              <Link
                href={content.primaryCtaHref}
                className="font-medium text-[#E36630]/90 underline underline-offset-2 hover:text-[#ffa066]"
              >
                {content.footerLinkText}
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomKitchenHighlight;
