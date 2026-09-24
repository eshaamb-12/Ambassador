'use client';

import { useState } from 'react';
import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { AboutFaqContent } from '@/lib/aboutPage.types';

interface FAQSectionProps {
  content?: AboutFaqContent;
}

const FAQSection = ({ content: contentProp }: FAQSectionProps) => {
  const content = contentProp ?? DEFAULT_ABOUT_PAGE_CONFIG.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">{content.heading}</h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">{content.description}</p>
        </div>

        <div className="space-y-4">
          {content.items.map((faq, index) => (
            <div key={index} className="rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left transition-colors focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <h3 className="pr-2 text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <svg
                    className="h-6 w-6 text-black transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {openIndex === index ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    )}
                  </svg>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
