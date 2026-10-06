'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_BRANCHES_PAGE_CONFIG } from '@/lib/branchesPage.defaults';
import type { BranchesStatItem, BranchesStatsContent } from '@/lib/branchesPage.types';

const STAT_ICONS: ReactNode[] = [
  (
    <path
      key="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  ),
  (
    <path
      key="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  (
    <path
      key="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  (
    <path
      key="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  ),
];

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

const StatCard = ({ stat, active, icon }: { stat: BranchesStatItem; active: boolean; icon: ReactNode }) => {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-[#E36630]/30 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] md:p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E36630]/10 text-[#E36630] transition-colors duration-300 group-hover:bg-[#E36630] group-hover:text-white">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <p className="mb-2 text-3xl font-black tabular-nums leading-none text-[#E36630] md:text-4xl">
        {active ? count : 0}
        {stat.suffix}
      </p>
      <p className="text-sm font-bold leading-snug text-[#0F4C69] md:text-base">{stat.label}</p>
    </div>
  );
};

interface StatsSectionProps {
  content?: BranchesStatsContent;
  className?: string;
}

const StatsSection = ({ content: contentProp, className = '' }: StatsSectionProps) => {
  const content = contentProp ?? DEFAULT_BRANCHES_PAGE_CONFIG.stats;
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
    <section ref={ref} className={`border-t border-gray-100 bg-white py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#0F4C69]">
            <span className="h-px w-6 bg-[#0F4C69]" />
            {content.eyebrow}
            <span className="h-px w-6 bg-[#0F4C69]" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {content.titleBefore} <span className="text-[#E36630]">{content.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {content.stats.map((stat, index) => (
            <StatCard key={`${stat.label}-${index}`} stat={stat} active={active} icon={STAT_ICONS[index] ?? STAT_ICONS[0]} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
