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
    <div ref={rootRef} className="absolute inset-0 z-0 bg-[#0f172a]">
      {!loadMedia ? (
        thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt=""
            className="h-full w-full object-cover object-center opacity-90"
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
              className={`absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-300 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
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

export default function HomeTestimonialGalleryCard({ item, isClone = false }: HomeTestimonialGalleryCardProps) {
  return (
    <div
      data-testimonial-card
      className="group/card testimonial-card h-auto shrink-0 grow-0 snap-start rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 sm:rounded-2xl [box-shadow:var(--testimonial-card-shadow)] hover:[box-shadow:var(--testimonial-card-shadow-hover)]"
      style={
        {
          '--testimonial-card-shadow': T.cardShadow,
          '--testimonial-card-shadow-hover': T.cardShadowHover,
        } as CSSProperties
      }
    >
      <article
        className="testimonial-card-inner overflow-hidden rounded-xl border bg-white transition-colors duration-300 group-hover/card:border-[#0F4C69]/25 sm:rounded-2xl"
        style={{ borderColor: T.cardBorder }}
      >
        <div className="testimonial-card-media overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-90 transition-opacity duration-300 group-hover/card:opacity-100"
            aria-hidden
          />

          <TestimonialCardMedia item={item} isClone={isClone} />
        </div>

        <div
          className="relative shrink-0 border-t bg-white px-2 py-2 sm:px-2.5 sm:py-2.5"
          style={{ borderColor: T.cardBorder }}
        >
          <p className="truncate text-[11px] font-bold leading-tight text-[#0F4C69] sm:text-xs">{item.name}</p>
          <p className="mt-1 line-clamp-2 text-[8px] font-semibold uppercase leading-snug tracking-wide text-[#0F4C69]/80 sm:text-[9px]">
            {item.profession}
          </p>
          <div className="mt-1.5 h-0.5 w-7 rounded-full bg-[#E36630]" />
        </div>
      </article>
    </div>
  );
}
