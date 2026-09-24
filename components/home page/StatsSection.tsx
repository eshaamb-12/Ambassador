'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';
import type { HomeStatItem, HomeStatsContent } from '@/lib/sitePages.types';

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

const StatCard = ({ stat, active }: { stat: HomeStatItem; active: boolean }) => {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div className="bg-white px-3 py-4 text-center sm:px-4 sm:py-5 md:bg-transparent md:px-4 md:py-6 lg:py-0">
      <p className="mb-0.5 text-3xl font-black text-[#E36630] sm:mb-1 sm:text-4xl md:text-5xl">
        {active ? count : 0}
        {stat.suffix}
      </p>
      <h3 className="mb-0.5 text-sm font-bold text-[#0F4C69] sm:mb-1 sm:text-base">{stat.label}</h3>
      <p className="text-xs leading-snug text-gray-500 sm:text-sm">{stat.description}</p>
    </div>
  );
};

interface StatsSectionProps {
  content?: HomeStatsContent;
}

const StatsSection = ({ content: contentProp }: StatsSectionProps) => {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.stats;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#FAFAFA] py-8 sm:py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center sm:mb-8 md:mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F4C69] sm:gap-2 sm:text-sm sm:tracking-widest">
            <span className="h-px w-5 bg-[#0F4C69] sm:w-6" />
            {content.eyebrow}
            <span className="h-px w-5 bg-[#0F4C69] sm:w-6" />
          </span>
          <h2 className="mt-3 text-2xl font-bold text-[#0F4C69] sm:mt-4 sm:text-3xl md:text-4xl">
            {content.heading}
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white md:rounded-none md:border-0 md:bg-transparent">
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 md:grid-cols-4 md:divide-y-0">
            {content.stats.map((stat, i) => (
              <StatCard key={i} stat={stat} active={active} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-gray-100 pt-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-6 sm:pt-8 md:gap-12">
          {content.trustBadges.map((badge) => (
            <div
              key={badge}
              className="flex max-w-xs items-center justify-center gap-2 text-center text-xs text-gray-600 sm:max-w-none sm:text-sm"
            >
              <svg className="h-4 w-4 shrink-0 text-[#0F4C69]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
