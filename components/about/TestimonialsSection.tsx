'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutTestimonialsContent } from '@/lib/aboutPage.types';

interface TestimonialsSectionProps {
  content?: AboutTestimonialsContent;
}

const TestimonialsSection = ({ content: contentProp }: TestimonialsSectionProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.testimonials;
  const testimonials = content.items;
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((p) => (p + 1) % testimonials.length);

  return (
    <section className="border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#0F4C69]">
            <span className="h-px w-8 bg-[#0F4C69]" />
            {content.intro.eyebrow}
            <span className="h-px w-8 bg-[#0F4C69]" />
          </span>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {content.intro.title}{' '}
            <span className="text-[#E36630]">{content.intro.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            {content.intro.description}
          </p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#E36630]" />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors duration-200 hover:border-[#E36630] hover:text-[#E36630]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors duration-200 hover:border-[#E36630] hover:text-[#E36630]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="mx-12 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-4">
                  <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#E36630]/40 hover:shadow-md">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E36630]/10">
                        <svg className="h-6 w-6 text-[#E36630]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                    </div>

                    <p className="mb-8 text-center text-lg italic leading-relaxed text-gray-600">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    <div className="mx-auto mb-6 h-px w-12 bg-[#E36630]/30" />

                    <div className="flex items-center justify-center gap-4">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#E36630]/30">
                        <Image
                          src={t.image}
                          alt={t.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">{t.name}</p>
                        <p className="mt-0.5 text-xs font-medium text-[#E36630]">{t.title}</p>
                        <div className="mt-1.5 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <svg
                              key={s}
                              className={`h-3.5 w-3.5 fill-current ${s < t.rating ? 'text-amber-400' : 'text-gray-200'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  current === i ? 'h-2.5 w-6 bg-[#E36630]' : 'h-2.5 w-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
