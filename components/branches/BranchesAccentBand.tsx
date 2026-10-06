'use client';

import Link from 'next/link';
import { DEFAULT_BRANCHES_PAGE_CONFIG } from '@/lib/branchesPage.defaults';
import type { BranchesAccentBandContent } from '@/lib/branchesPage.types';

type BranchesAccentBandProps = {
  content?: BranchesAccentBandContent;
};

const BranchesAccentBand = ({ content: contentProp }: BranchesAccentBandProps) => {
  const content = contentProp ?? DEFAULT_BRANCHES_PAGE_CONFIG.accentBand;

  return (
    <section className="bg-[#0F4C69] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-white md:flex-row">
          <p className="text-center text-sm text-white/80 md:text-left md:text-base">
            {content.textBeforeHighlight}
            <span className="font-semibold text-white">{content.highlight}</span>
            {content.textAfterHighlight}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={content.phoneHref}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              {content.phoneDisplay}
            </a>
            <Link
              href={content.contactHref}
              className="rounded-xl bg-[#E36630] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#cc5a2a]"
            >
              {content.contactCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchesAccentBand;
