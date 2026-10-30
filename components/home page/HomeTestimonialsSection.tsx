'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_HOME_PAGE_CONFIG, HOME_TESTIMONIALS_THEME } from '@/lib/homePage.defaults';
import type { HomeTestimonialItem, HomeTestimonialsContent } from '@/lib/sitePages.types';
import { homeSectionDescriptionLight, homeSectionTitleLight } from '@/lib/homeSectionTypography';
import HomeTestimonialGalleryCard from './HomeTestimonialGalleryCard';
import { animateScrollLeft } from '@/lib/smoothScrollElement.util';

const T = HOME_TESTIMONIALS_THEME;
const SCROLL_DURATION_MS = 780;
/** Clone sets for seamless infinite scroll (only middle set is “home”; jumps are instant after arrow nav). */
const LOOP_COPIES = 3;

interface HomeTestimonialsSectionProps {
  content?: HomeTestimonialsContent;
}

function cardsPerSet(totalCards: number) {
  return totalCards / LOOP_COPIES;
}

function getTrackMetrics(track: HTMLElement) {
  const cards = track.querySelectorAll<HTMLElement>('[data-testimonial-card]');
  const card = cards[0];
  if (!card) return { step: 0, visible: 1 };

  const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
  const step = card.offsetWidth + gap;
  const visible = Math.max(1, Math.floor((track.clientWidth + gap) / step));

  return { step, visible };
}

export default function HomeTestimonialsSection({ content: contentProp }: HomeTestimonialsSectionProps) {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.testimonials;
  const [apiItems, setApiItems] = useState<HomeTestimonialItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/home-testimonials');
        const json = await res.json();
        if (cancelled || !json.success || !Array.isArray(json.data)) return;
        const mapped: HomeTestimonialItem[] = json.data.map(
          (d: { name: string; profession: string; videoUrl?: string }) => ({
            name: d.name,
            profession: d.profession,
            videoUrl: d.videoUrl ?? '',
          }),
        );
        setApiItems(mapped);
      } catch {
        if (!cancelled) setApiItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cmsItems = content.items;
  const items =
    apiItems === null
      ? cmsItems
      : apiItems.length > 0
        ? apiItems
        : cmsItems.filter((i) => (i.videoUrl ?? '').trim());

  const trackRef = useRef<HTMLDivElement>(null);
  const navScrollPendingRef = useRef(false);
  const cancelScrollAnimRef = useRef<(() => void) | null>(null);
  const itemsLen = items.length;

  const loopSlides = useMemo(() => {
    if (itemsLen === 0) return [];
    const out: { item: HomeTestimonialItem; copy: number; index: number }[] = [];
    for (let copy = 0; copy < LOOP_COPIES; copy++) {
      items.forEach((item, index) => {
        out.push({ item, copy, index });
      });
    }
    return out;
  }, [items, itemsLen]);

  const normalizeInfiniteScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || itemsLen <= 1) return;

    const cards = track.querySelectorAll<HTMLElement>('[data-testimonial-card]');
    const perSet = cardsPerSet(cards.length);
    if (perSet < 1) return;

    const middleStart = cards[perSet];
    const thirdStart = cards[perSet * 2];
    if (!middleStart || !thirdStart) return;

    const segment = middleStart.offsetLeft - cards[0].offsetLeft;
    if (segment <= 0) return;

    const { step } = getTrackMetrics(track);
    const left = track.scrollLeft;

    if (left >= thirdStart.offsetLeft - step) {
      track.scrollLeft = left - segment;
    } else if (left < middleStart.offsetLeft - step * 0.5) {
      track.scrollLeft = left + segment;
    }
  }, [itemsLen]);

  const initMiddleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || itemsLen <= 1) return;
    const cards = track.querySelectorAll<HTMLElement>('[data-testimonial-card]');
    const perSet = cardsPerSet(cards.length);
    const middle = cards[perSet];
    if (middle) track.scrollLeft = middle.offsetLeft;
  }, [itemsLen]);

  useLayoutEffect(() => {
    initMiddleScroll();
  }, [loopSlides, initMiddleScroll]);

  useEffect(() => {
    return () => {
      cancelScrollAnimRef.current?.();
    };
  }, [loopSlides]);

  const finishNavScroll = useCallback(
    (track: HTMLElement) => {
      track.classList.remove('testimonial-track--smooth-scroll');
      normalizeInfiniteScroll();
      navScrollPendingRef.current = false;
    },
    [normalizeInfiniteScroll],
  );

  const scrollByPage = useCallback(
    (dir: -1 | 1) => {
      const track = trackRef.current;
      if (!track || itemsLen <= 1 || navScrollPendingRef.current) return;

      const { step, visible } = getTrackMetrics(track);
      if (step <= 0) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const remaining = dir === 1 ? maxScroll - track.scrollLeft : track.scrollLeft;

      let delta = Math.min(visible * step, Math.max(0, remaining));
      if (delta < step) {
        delta = step;
      }

      let targetLeft = track.scrollLeft + dir * delta;
      targetLeft = Math.max(0, Math.min(maxScroll, targetLeft));

      cancelScrollAnimRef.current?.();
      navScrollPendingRef.current = true;
      track.classList.add('testimonial-track--smooth-scroll');

      cancelScrollAnimRef.current = animateScrollLeft(track, targetLeft, SCROLL_DURATION_MS, () => {
        cancelScrollAnimRef.current = null;
        finishNavScroll(track);
      });
    },
    [itemsLen, finishNavScroll],
  );

  const [trackScrollable, setTrackScrollable] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      setTrackScrollable(track.scrollWidth > track.clientWidth + 4);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [loopSlides]);

  const showArrows = itemsLen > 1 && trackScrollable;

  if (items.length === 0) return null;

  const arrowBtnClass =
    'absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 shadow-md backdrop-blur-sm transition-all hover:border-[#0F4C69]/30 hover:bg-white hover:shadow-lg sm:h-11 sm:w-11 md:h-12 md:w-12';

  return (
    <section className="border-t border-gray-100 bg-white py-10 sm:py-12 md:py-14">
      <div className="container mx-auto mb-6 max-w-3xl px-4 text-center sm:mb-8">
        <h2 className={homeSectionTitleLight}>
          <span style={{ color: T.title }}>{content.titleBefore} </span>
          <span style={{ color: T.titleHighlight }}>{content.titleHighlight}</span>
        </h2>
        <p className={`mt-3 ${homeSectionDescriptionLight}`}>{content.subtitle}</p>
        <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#E36630] sm:w-14" aria-hidden />
      </div>

      <div className="relative w-full">
        {showArrows ? (
          <>
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Previous testimonials"
              className={`${arrowBtnClass} left-2 sm:left-4 md:left-6 lg:left-8`}
              style={{ borderColor: T.navButtonBorder, color: T.navButtonIcon }}
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label="Next testimonials"
              className={`${arrowBtnClass} right-2 sm:right-4 md:right-6 lg:right-8`}
              style={{ borderColor: T.navButtonBorder, color: T.navButtonIcon }}
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}

        <div
          ref={trackRef}
          className="testimonial-track testimonial-track-full flex w-full max-w-[100vw] items-center gap-4 overflow-x-auto overflow-y-visible pb-10 pt-5 [scrollbar-width:none] sm:gap-5 sm:pb-11 sm:pt-6 md:pb-12 lg:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {loopSlides.map(({ item, copy, index }) => (
            <HomeTestimonialGalleryCard
              key={`loop-${copy}-${index}-${item.name}`}
              item={item}
              isClone={copy !== 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
