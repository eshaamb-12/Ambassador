'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';
import type { HomeSignupContent } from '@/lib/sitePages.types';
import {
  homeButtonCta,
  homeCardBody,
  homeCardBodyLight,
  homeCardTitleLight,
  homeSectionDescriptionLight,
  homeSectionEyebrowLight,
  homeSectionDescriptionOnDark,
  homeSectionTitleLight,
  homeSectionTitleOnDark,
} from '@/lib/homeSectionTypography';

interface SignupSectionProps {
  content?: HomeSignupContent;
}

const SignupSection = ({ content: contentProp }: SignupSectionProps) => {
  const content = contentProp ?? DEFAULT_HOME_PAGE_CONFIG.signup;
  const { user } = useUser();

  if (user) return null;

  return (
    <section className=" bg-[#EBF0F4] py-8 sm:py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col overflow-hidden rounded-2xl shadow-[0_-4px_24px_0_rgba(0,0,0,0.08),0_8px_24px_0_rgba(0,0,0,0.10)] lg:flex-row">
          <div className="flex-1 bg-white p-6 sm:p-10 lg:p-14">
            <div className="max-w-lg">
              <span className={`mb-3 inline-flex items-center gap-1.5 sm:mb-4 sm:gap-2 ${homeSectionEyebrowLight}`}>
                <span className="h-px w-6 bg-[#0F4C69]" />
                {content.eyebrow}
              </span>

              <h2 className={`mb-3 sm:mb-4 ${homeSectionTitleLight}`}>
                {content.titleBefore}{' '}
                <span className="text-[#E36630]">{content.titleHighlight}</span>
              </h2>

              <p className={`mb-6 sm:mb-8 ${homeSectionDescriptionLight}`}>{content.description}</p>

              <ul className="mb-10 space-y-5">
                {content.benefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#E36630]/10">
                      <svg className="h-3.5 w-3.5 text-[#E36630]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <h3 className={homeCardTitleLight}>{benefit.title}</h3>
                      <p className={`leading-snug ${homeCardBodyLight}`}>{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-start gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
                <div className="flex -space-x-2">
                  {['H', 'R', 'B', 'F'].map((initial) => (
                    <div
                      key={initial}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-bold text-gray-600"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className={`min-w-0 ${homeCardBodyLight}`}>{content.socialProof}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-[#E36630] p-6 sm:p-10 lg:w-[420px] lg:p-14">
            <h3 className={`mb-2 ${homeSectionTitleOnDark}`}>{content.panelTitle}</h3>
            <p className={`mb-6 sm:mb-8 text-white/80 ${homeSectionDescriptionOnDark}`}>
              {content.panelDescription}
            </p>

            <ul className="mb-10 space-y-3">
              {content.panelPerks.map((perk) => (
                <li key={perk} className={`flex items-center gap-3 text-white ${homeCardBody}`}>
                  <svg className="h-4 w-4 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Link
                href="/signup"
                className={`block w-full rounded-xl bg-white py-3.5 text-center text-[#E36630] shadow-md transition-colors hover:bg-gray-50 sm:py-4 ${homeButtonCta}`}
              >
                {content.primaryCta}
              </Link>
              <Link
                href="/login"
                className={`block w-full rounded-xl border-2 border-white bg-transparent py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10 sm:py-4 ${homeButtonCta}`}
              >
                {content.secondaryCta}
              </Link>
            </div>

            <p className="mt-5 text-center text-xs text-white/60">
              By signing up, you agree to our{' '}
              <Link href="/terms-of-service" className="underline transition-colors hover:text-white">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="underline transition-colors hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupSection;
