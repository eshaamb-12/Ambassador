'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DEFAULT_HOME_PAGE_CONFIG, HOME_CUSTOM_KITCHEN_THEME } from '@/lib/homePage.defaults';
import type { HomeCustomKitchenContent } from '@/lib/sitePages.types';
import {
  homeButtonCta,
  homeButtonCompact,
  homeCardBody,
  homeCardTitle,
  homeSectionDescription,
  homeSectionEyebrow,
  homeSectionTitle,
} from '@/lib/homeSectionTypography';

const T = HOME_CUSTOM_KITCHEN_THEME;

interface CustomKitchenHighlightProps {
  content?: HomeCustomKitchenContent;
}

/** Home-page spotlight for flagship Custom Kitchen — copy aligned with `/custom-kitchen`. */
const CustomKitchenHighlight = ({ content: contentProp }: CustomKitchenHighlightProps) => {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.customKitchen;

  return (
    <section
      className="relative overflow-hidden border-t"
      style={{ backgroundColor: T.sectionBg, borderColor: T.sectionBorder }}
    >
      <div className="container relative mx-auto px-4 py-10 sm:py-12 md:py-20 lg:py-24">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div
              className="relative aspect-[4/3] min-h-[220px] overflow-hidden rounded-xl shadow-lg shadow-[#0F4C69]/8 ring-1 ring-[#EBF0F4] sm:min-h-[260px] sm:rounded-2xl md:min-h-[300px] md:aspect-[5/4] lg:aspect-auto lg:h-[min(460px,55vh)] lg:min-h-[340px]"
            >
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
            <div
              className={`absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-lg border px-3 py-1.5 uppercase tracking-wide shadow-sm sm:left-4 sm:top-4 sm:max-w-none sm:rounded-xl sm:px-4 sm:py-2 md:px-5 ${homeButtonCompact}`}
              style={{
                backgroundColor: T.imageBadgeBg,
                borderColor: T.imageBadgeBorder,
                color: T.imageBadgeText,
              }}
            >
              {content.imageBadge}
            </div>
          </div>

          <div className="order-1 space-y-5 sm:space-y-6 lg:order-2">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 sm:gap-2 ${homeSectionEyebrow}`}
                style={{ color: T.eyebrow }}
              >
                <span className="h-px w-5 sm:w-8" style={{ backgroundColor: T.eyebrowLine }} />
                {content.eyebrow}
              </span>
              <h2 className={`mt-3 sm:mt-4 ${homeSectionTitle}`} style={{ color: T.title }}>
                {content.titleBefore}{' '}
                <span style={{ color: T.titleHighlight }}>{content.titleHighlight}</span>{' '}
                {content.titleAfter}
              </h2>
              <p
                className={`mt-3 sm:mt-4 ${homeSectionDescription}`}
                style={{ color: T.description }}
              >
                {content.description}
              </p>
            </div>

            <ul
              className="space-y-3 border-l-2 pl-3.5 sm:space-y-3.5 sm:pl-4 md:space-y-4 md:pl-5"
              style={{ borderColor: T.highlightBorder }}
            >
              {content.highlights.map((item) => (
                <li key={item.title}>
                  <h3
                    className={`font-semibold ${homeCardTitle}`}
                    style={{ color: T.highlightTitle }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-0.5 leading-snug ${homeCardBody}`}
                    style={{ color: T.highlightText }}
                  >
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:pt-2">
              <Link
                href={content.primaryCtaHref}
                className={`inline-flex w-full justify-center rounded-lg px-5 py-3 text-center text-white shadow-lg shadow-[#E36630]/25 transition-colors hover:bg-[#cc5a2a] sm:w-auto sm:px-7 sm:py-3.5 ${homeButtonCta}`}
                style={{ backgroundColor: T.primaryCtaBg }}
              >
                {content.primaryCta}
              </Link>
              <Link
                href={content.secondaryCtaHref}
                className={`inline-flex w-full justify-center rounded-lg border-2 px-5 py-3 text-center transition-colors hover:bg-[#EBF0F4] sm:w-auto sm:px-7 sm:py-3.5 ${homeButtonCta}`}
                style={{
                  borderColor: T.secondaryBorder,
                  color: T.secondaryText,
                  backgroundColor: T.secondaryBg,
                }}
              >
                {content.secondaryCta}
              </Link>
            </div>
            <p className={`leading-relaxed ${homeCardBody}`} style={{ color: T.footerMuted }}>
              Same journey and portfolio detail on our{' '}
              <Link
                href={content.primaryCtaHref}
                className="font-medium underline underline-offset-2 hover:text-[#cc5a2a]"
                style={{ color: T.footerLink }}
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
