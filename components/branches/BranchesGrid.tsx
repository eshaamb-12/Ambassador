'use client';

import { DEFAULT_BRANCHES_PAGE_CONFIG } from '@/lib/branchesPage.defaults';
import type { BranchesGridIntroContent, ShowroomBranch } from '@/lib/branchesPage.types';

interface BranchesGridProps {
  branches: ShowroomBranch[];
  intro?: BranchesGridIntroContent;
  onGetDirections?: (branch: ShowroomBranch) => void;
  onViewDetails?: (branchId: string) => void;
}

const BranchesGrid = ({ branches, intro: introProp, onGetDirections, onViewDetails }: BranchesGridProps) => {
  const intro = introProp ?? DEFAULT_BRANCHES_PAGE_CONFIG.gridIntro;

  return (
    <section className="bg-[#FAFAFA] py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#0F4C69]">
            <span className="h-px w-8 bg-[#0F4C69]" />
            {intro.eyebrow}
            <span className="h-px w-8 bg-[#0F4C69]" />
          </span>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {intro.titleBefore} <span className="text-[#E36630]">{intro.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">{intro.description}</p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#E36630]" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#E36630]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/0F4C69/ffffff?text=${encodeURIComponent(branch.city)}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-[#E36630] px-3 py-1 text-xs font-semibold text-white shadow-md">
                  {branch.city}
                </span>
                {branch.isHeadOffice ? (
                  <span className="absolute left-3 top-3 rounded-full bg-[#0F4C69] px-3 py-1 text-xs font-semibold text-white shadow-md">
                    {intro.headOfficeBadge}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#0F4C69]">
                  {branch.name}
                </h3>

                <ul className="mb-4 flex-1 space-y-2.5">
                  <li className="flex items-start gap-2 text-sm text-gray-500">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#E36630]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-2">{branch.address}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="h-4 w-4 shrink-0 text-[#E36630]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${branch.phone}`} className="transition-colors hover:text-[#E36630]">
                      {branch.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="h-4 w-4 shrink-0 text-[#E36630]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {branch.hours}
                  </li>
                </ul>

                <p className="mb-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                  <span className="font-medium text-gray-600">Manager:</span> {branch.manager}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onGetDirections?.(branch)}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#0F4C69] hover:text-[#0F4C69]"
                  >
                    {intro.directionsCta}
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(branch.id)}
                    className="flex-1 rounded-xl bg-[#E36630] px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#E36630]/20 transition-colors hover:bg-[#cc5a2a]"
                  >
                    {intro.detailsCta}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesGrid;
