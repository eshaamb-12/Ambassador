'use client';

import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { productsHref, productDetailPath, primaryCategorySlug, productUrlSegment } from '@/lib/siteRoutes';
import { PRODUCT_PLACEHOLDER } from '@/utils/productMedia.util';
import { DEFAULT_HOME_PAGE_CONFIG, HOME_SALE_THEME } from '@/lib/homePage.defaults';
import type { HomeSaleContent } from '@/lib/sitePages.types';
import { homeButtonCompact } from '@/lib/homeSectionTypography';

const T = HOME_SALE_THEME;

interface SaleProduct {
  _id: string;
  slug?: string;
  name: string;
  price?: number;
  originalPrice: number;
  images: string[];
  stock?: number;
  categories?: Array<{ title?: string; slug?: string }>;
}

const SALE_LIMIT = 24;
const SCROLL_PX_PER_SEC = 50;

function displayPrice(p: SaleProduct): number {
  return p.price != null && p.price > 0 ? p.price : p.originalPrice;
}

function discountPercent(p: SaleProduct): number {
  const sale = displayPrice(p);
  if (p.originalPrice <= 0 || sale >= p.originalPrice) return 0;
  return Math.round((1 - sale / p.originalPrice) * 100);
}

function categoryTitle(cats?: SaleProduct['categories']): string {
  return cats?.[0]?.title ?? '';
}

const SALE_CARD_WIDTH =
  'w-[14rem] sm:w-[15.5rem] md:w-[16.5rem] lg:w-[17rem]';
const SALE_CARD_HEIGHT =
  'h-[21rem] sm:h-[22rem] md:h-[23rem] lg:h-[24rem]';

function SaleProductCard({ product }: { product: SaleProduct }) {
  const salePrice = displayPrice(product);
  const pct = discountPercent(product);
  const hasDiscount = pct > 0;
  const outOfStock = (product.stock ?? 0) <= 0;
  const image = product.images?.[0] || PRODUCT_PLACEHOLDER;
  const category = categoryTitle(product.categories);
  const categorySlug = primaryCategorySlug(product.categories);
  const detailHref = productDetailPath(productUrlSegment(product), categorySlug);

  const cardStyle = {
    borderColor: T.cardBorder,
    '--sale-card-shadow': T.cardShadow,
    '--sale-card-shadow-hover': T.cardShadowHover,
  } as CSSProperties;

  return (
    <div
      data-sale-card
      className="group/sale shrink-0 px-1.5 pb-3 pt-1 transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <article
        className={`flex flex-col overflow-hidden rounded-xl border bg-white [box-shadow:var(--sale-card-shadow)] transition-shadow duration-300 group-hover/sale:[box-shadow:var(--sale-card-shadow-hover)] sm:rounded-2xl ${SALE_CARD_HEIGHT} ${SALE_CARD_WIDTH}`}
        style={cardStyle}
      >
        <Link
          href={detailHref}
          className="relative block h-[70%] shrink-0 overflow-hidden"
          style={{ backgroundColor: T.cardImageBg }}
        >
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain object-center transition-transform duration-500 group-hover/sale:scale-[1.03]"
            sizes="(max-width: 640px) 224px, (max-width: 768px) 248px, 272px"
          />
          {hasDiscount && (
            <span className="absolute left-2 top-2 rounded-full bg-[#E36630] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {pct}% OFF
            </span>
          )}
          {outOfStock && (
            <span className="absolute right-2 top-2 rounded-full bg-gray-900/75 px-2 py-0.5 text-[9px] font-semibold text-white sm:right-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
              Out of Stock
            </span>
          )}
        </Link>

        <div className="flex h-[30%] min-h-0 shrink-0 flex-col px-2.5 pb-2 pt-1.5 sm:px-3 sm:pb-2.5 sm:pt-2">
          <p
            className="mb-0.5 h-3 shrink-0 truncate text-[9px] font-semibold uppercase leading-none tracking-wider sm:h-3.5 sm:text-[10px]"
            style={{ color: T.category }}
          >
            {category || '\u00A0'}
          </p>

          <Link href={detailHref} className="mb-1 min-h-0 flex-1 overflow-hidden">
            <h3
              className="line-clamp-2 text-[11px] font-bold leading-tight transition-colors group-hover/sale:text-[#E36630] sm:text-xs"
              style={{ color: T.productTitle }}
            >
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto shrink-0 space-y-1 sm:space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0 leading-none">
              <span className="text-sm font-extrabold sm:text-base" style={{ color: T.price }}>
                PKR {salePrice.toLocaleString()}
              </span>
              {hasDiscount ? (
                <span className="text-xs font-medium line-through sm:text-sm" style={{ color: T.priceWas }}>
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              ) : null}
            </div>

            <Link
              href={detailHref}
              className="flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-[#0F4C69] text-[10px] font-bold text-white transition-colors hover:bg-[#0d3d55] sm:h-9 sm:text-[11px]"
            >
              Buy
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

interface SaleSectionProps {
  content?: HomeSaleContent;
}

export default function SaleSection({ content: contentProp }: SaleSectionProps) {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.sale;
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const slideStepRef = useRef(292);
  const lastFrameRef = useRef(0);

  const canLoop = products.length > 1;
  const loopProducts = canLoop ? [...products, ...products] : products;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({
          sale: '1',
          limit: String(SALE_LIMIT),
          sort: 'newest',
        });
        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        if (!cancelled && json?.success && Array.isArray(json.data)) {
          const sorted = [...(json.data as SaleProduct[])].sort(
            (a, b) => discountPercent(b) - discountPercent(a)
          );
          setProducts(sorted);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const applyTransform = useCallback((offset: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offset}px, 0, 0)`;
    }
  }, []);

  const measureTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;

    const totalWidth = track.scrollWidth;
    loopWidthRef.current = totalWidth / 2;

    const card = track.querySelector<HTMLElement>('[data-sale-card]');
    if (card) {
      const gap = parseFloat(getComputedStyle(track).gap || '20');
      slideStepRef.current = card.offsetWidth + gap;
    }

    const loopWidth = loopWidthRef.current;
    if (loopWidth > 0 && offsetRef.current >= loopWidth) {
      offsetRef.current %= loopWidth;
      applyTransform(offsetRef.current);
    }
  }, [canLoop, applyTransform]);

  useEffect(() => {
    if (loading || !canLoop) return;
    measureTrack();

    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measureTrack);
    observer.observe(track);
    return () => observer.disconnect();
  }, [loading, canLoop, products, measureTrack]);

  useEffect(() => {
    if (!canLoop || paused || loading) return;

    let raf = 0;

    const tick = (now: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = now;
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;

      const loopWidth = loopWidthRef.current;
      if (loopWidth > 0) {
        offsetRef.current += (SCROLL_PX_PER_SEC * delta) / 1000;
        if (offsetRef.current >= loopWidth) {
          offsetRef.current -= loopWidth;
        }
        applyTransform(offsetRef.current);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastFrameRef.current = 0;
    };
  }, [canLoop, paused, loading, applyTransform]);

  const nudge = useCallback((dir: 'left' | 'right') => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return;

    const step = slideStepRef.current;
    offsetRef.current += dir === 'right' ? step : -step;

    if (offsetRef.current >= loopWidth) offsetRef.current -= loopWidth;
    if (offsetRef.current < 0) offsetRef.current += loopWidth;

    applyTransform(offsetRef.current);
  }, [applyTransform]);

  if (!loading && products.length === 0) return null;

  return (
    <section
      className="relative overflow-x-hidden border-t py-10 sm:py-12 md:py-16"
      style={{ backgroundColor: T.sectionBg, borderColor: T.sectionBorder }}
    >
      <div className="container relative mx-auto px-4">
        <div className="mb-6 flex flex-col items-center gap-4 text-center sm:mb-8 sm:gap-6 md:mb-10">
          <div className="max-w-3xl">
            <span
              className={`mb-3 inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 font-bold uppercase tracking-[0.12em] sm:mb-4 sm:gap-2 sm:px-4 sm:tracking-[0.16em] ${homeButtonCompact}`}
              style={{ backgroundColor: T.badgeBg, color: T.badgeText }}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E36630] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E36630]" />
              </span>
              <span className="truncate">{content.badge}</span>
            </span>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              <span style={{ color: T.title }}>{content.titleBefore} </span>
              <span style={{ color: T.titleHighlight }}>
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> </span>
                {content.titleHighlight}
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg" style={{ color: T.description }}>
              {content.description}
            </p>
          </div>

          <Link
            href={productsHref({ features: 'on_sale' })}
            className={`inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#E36630] px-5 py-2.5 text-white shadow-lg shadow-[#E36630]/25 transition-all hover:bg-[#cc5a2a] hover:shadow-[#E36630]/35 sm:w-auto sm:max-w-none ${homeButtonCompact}`}
          >
            {content.ctaText}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex w-full gap-3 overflow-x-hidden sm:gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`shrink-0 animate-pulse rounded-xl border bg-[#EBF0F4] first:ml-3 last:mr-3 sm:rounded-2xl sm:first:ml-4 sm:last:mr-4 md:first:ml-6 md:last:mr-6 ${SALE_CARD_HEIGHT} ${SALE_CARD_WIDTH}`}
              style={{ borderColor: T.cardBorder }}
            />
          ))}
        </div>
      ) : (
        <div
          ref={viewportRef}
          className="relative w-full overflow-x-clip py-2 pb-12 pt-2 sm:pb-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-8 sm:w-12 md:w-20"
            style={{ background: `linear-gradient(to right, ${T.fadeEdge}, transparent)` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-8 sm:w-12 md:w-20"
            style={{ background: `linear-gradient(to left, ${T.fadeEdge}, transparent)` }}
            aria-hidden
          />

          {canLoop && (
            <>
              <button
                type="button"
                onClick={() => nudge('left')}
                aria-label="Previous sale product"
                className="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 hover:bg-[#E36630] md:flex md:left-4 md:h-10 md:w-10 lg:left-6 lg:h-11 lg:w-11"
                style={{ backgroundColor: T.navButton }}
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => nudge('right')}
                aria-label="Next sale product"
                className="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 hover:bg-[#E36630] md:flex md:right-4 md:h-10 md:w-10 lg:right-6 lg:h-11 lg:w-11"
                style={{ backgroundColor: T.navButton }}
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div
            ref={trackRef}
            className="flex w-max gap-3 pl-3 sm:gap-4 sm:pl-4 md:gap-5 md:pl-6"
            style={{ willChange: canLoop ? 'transform' : undefined }}
          >
            {loopProducts.map((product, index) => (
              <SaleProductCard key={`${product._id}-${index}`} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
