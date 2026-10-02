'use client';

import { sanitizeBlogHtml } from '@/lib/blogHtml';

type BlogArticleHtmlBodyProps = {
  html: string;
};

export default function BlogArticleHtmlBody({ html }: BlogArticleHtmlBodyProps) {
  const safe = sanitizeBlogHtml(html);

  return (
    <div
      className="blog-article-html space-y-4 text-sm leading-relaxed text-gray-700 md:text-base md:leading-8 [&_a]:font-medium [&_a]:text-[#0F4C69] [&_a]:underline hover:[&_a]:text-[#E36630] [&_blockquote]:border-l-4 [&_blockquote]:border-[#0F4C69]/30 [&_blockquote]:bg-[#0F4C69]/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h2]:scroll-mt-28 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0F4C69] [&_h3]:scroll-mt-28 [&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
