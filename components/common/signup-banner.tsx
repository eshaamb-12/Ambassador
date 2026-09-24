'use client';

import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';

interface SignupBannerProps {
  content?: AboutSignupBannerContent;
}

const SignupBanner = ({ content: contentProp }: SignupBannerProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.signup;

  return (
    <div className="bg-[#E36630] py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">{content.title}</h2>
          <p className="mb-8 text-lg text-white/80">{content.description}</p>

          <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/signup"
              className="flex-1 rounded-lg bg-[#0F4C69] px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-[#cc5a2a]"
            >
              {content.signupCta}
            </a>
            <a
              href="/login"
              className="flex-1 rounded-lg border-2 border-white/40 bg-transparent px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-[#0F4C69]"
            >
              {content.loginCta}
            </a>
          </div>

          <p className="mt-6 text-sm text-white/60">{content.footerNote}</p>
        </div>
      </div>
    </div>
  );
};

export default SignupBanner;
