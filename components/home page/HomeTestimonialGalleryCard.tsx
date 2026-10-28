'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  directGalleryVideoUrl,
  getYouTubeEmbedUrl,
  getYouTubeVideoId,
  youTubeThumbnailUrl,
} from '@/lib/galleryVideo.util';
import { HOME_TESTIMONIALS_THEME } from '@/lib/homePage.defaults';
import type { HomeTestimonialItem } from '@/lib/sitePages.types';

const T = HOME_TESTIMONIALS_THEME;

interface HomeTestimonialGalleryCardProps {
  item: HomeTestimonialItem;
  /** Off-screen loop clones — lazy media only (saves load time). */
  isClone?: boolean;
}

function VideoLoadingShell({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#EBF0F4] to-white px-4 text-center">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#0F4C69]/20 border-t-[#E36630]" aria-hidden />
      <p className="text-xs font-medium text-[#0F4C69]">{label}</p>
    </div>
  );
}

function VideoFallback({ name, onRetry }: { name: string; onRetry?: () => void }) {
  return (
    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#EBF0F4] to-white px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#E36630] shadow-md ring-4 ring-[#0F4C69]/10">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-[#0F4C69]">Video unavailable</span>
      <p className="text-[10px] text-gray-500">{name}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-md bg-[#0F4C69] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0d3d55]"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

function TestimonialCardMedia({ item, isClone }: { item: HomeTestimonialItem; isClone?: boolean }) {
  const videoUrl = item.videoUrl?.trim() ?? '';
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const directVideoUrl = videoUrl ? directGalleryVideoUrl(videoUrl) : '';
  const youtubeId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const thumbUrl = youtubeId ? youTubeThumbnailUrl(youtubeId) : null;

  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loadMedia, setLoadMedia] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: isClone ? '0px' : '120px', threshold: isClone ? 0.45 : 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isClone]);

  useEffect(() => {
    if (inView) setLoadMedia(true);
  }, [inView]);

  useEffect(() => {
    setMediaReady(false);
    setMediaError(false);
  }, [videoUrl, retryKey]);

  const retry = useCallback(() => {
    setMediaError(false);
    setMediaReady(false);
    setLoadMedia(false);
    setRetryKey((k) => k + 1);
    requestAnimationFrame(() => setLoadMedia(true));
  }, []);

  if (!videoUrl) {
    return (
      <div ref={rootRef} className="absolute inset-0 z-0">
        <VideoFallback name={item.name} />
      </div>
    );
  }

  const showLoader = loadMedia && !mediaReady && !mediaError;

  return (
    <div ref={rootRef} className="absolute inset-0 z-0 bg-[#EBF0F4]">
      {!loadMedia ? (
        thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt=""
            className="h-full w-full object-cover opacity-90"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <VideoLoadingShell label="Loading when visible…" />
        )
      ) : null}

      {loadMedia && embedUrl ? (
        <>
          {showLoader ? <VideoLoadingShell label="Loading video…" /> : null}
          {mediaError ? <VideoFallback name={item.name} onRetry={retry} /> : null}
          {!mediaError ? (
            <iframe
              key={retryKey}
              src={`${embedUrl}?rel=0&modestbranding=1`}
              title={`${item.name} testimonial video`}
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setMediaReady(true)}
              onError={() => setMediaError(true)}
            />
          ) : null}
        </>
      ) : null}

      {loadMedia && directVideoUrl ? (
        <>
          {showLoader ? <VideoLoadingShell label="Loading video…" /> : null}
          {mediaError ? <VideoFallback name={item.name} onRetry={retry} /> : null}
          {!mediaError ? (
            <video
              key={retryKey}
              src={directVideoUrl}
              className={`relative z-0 h-full w-full object-cover transition-opacity duration-300 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
              controls
              preload="metadata"
              playsInline
              onLoadedData={() => setMediaReady(true)}
              onCanPlay={() => setMediaReady(true)}
              onError={() => setMediaError(true)}
            />
          ) : null}
        </>
      ) : null}

      {loadMedia && !embedUrl && !directVideoUrl ? <VideoFallback name={item.name} onRetry={retry} /> : null}
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.45l.665 1.262C6.33 7.908 4.5 10.348 4.5 13.011c0 1.396.385 2.396 1.083 3.31l-1 .001zm9 0c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.45l.665 1.262c-2.868 1.135-4.697 3.575-4.697 6.238 0 1.396.385 2.396 1.083 3.31l-1 .001z" />
    </svg>
  );
}

export default function HomeTestimonialGalleryCard({ item, isClone = false }: HomeTestimonialGalleryCardProps) {
  return (
    <div
      data-testimonial-card
      className="group/card testimonial-card h-[32rem] w-[min(88vw,18rem)] shrink-0 grow-0 snap-start rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 sm:h-[36rem] md:h-[38rem] lg:h-[40rem] xl:h-[42rem] [box-shadow:var(--testimonial-card-shadow)] hover:[box-shadow:var(--testimonial-card-shadow-hover)]"
      style={
        {
          '--testimonial-card-shadow': T.cardShadow,
          '--testimonial-card-shadow-hover': T.cardShadowHover,
        } as CSSProperties
      }
    >
      <article
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white transition-colors duration-300 group-hover/card:border-[#0F4C69]/25"
        style={{ borderColor: T.cardBorder }}
      >
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#E36630] via-[#0F4C69] to-[#E36630]" aria-hidden />

        <div className="relative min-h-0 flex-1 bg-[#EBF0F4]">
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0F4C69]/20 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover/card:opacity-80"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute bottom-3 left-3 z-[2] flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0F4C69] shadow-sm backdrop-blur-sm sm:text-[11px]"
            aria-hidden
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E36630] animate-pulse" />
            Story
          </div>

          <TestimonialCardMedia item={item} isClone={isClone} />
        </div>

        <div
          className="relative shrink-0 overflow-hidden border-t bg-gradient-to-br from-[#EBF0F4] via-white to-white px-4 py-4 sm:px-5 sm:py-4"
          style={{ borderColor: T.cardBorder }}
        >
          <QuoteIcon className="pointer-events-none absolute -right-1 -top-2 h-16 w-16 text-[#0F4C69]/[0.07] sm:h-20 sm:w-20" />

          <div className="relative flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold leading-tight text-[#0F4C69] sm:text-lg">{item.name}</p>
              <div className="mt-2 h-0.5 w-10 rounded-full bg-[#E36630] transition-all duration-300 group-hover/card:w-14" />
            </div>
            <span className="max-w-[48%] shrink-0 rounded-md bg-[#0F4C69] px-2 py-1 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-white shadow-sm sm:max-w-[52%] sm:px-2.5 sm:py-1.5 sm:text-[10px]">
              {item.profession}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
