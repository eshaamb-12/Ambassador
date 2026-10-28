'use client';

import { useState, useEffect } from 'react';
import ImageSlider from '../../../components/home page/ImageSlider';
import SaleSection from '../../../components/home page/SaleSection';
import CategoryCard from '../../../components/home page/CategoryCard';
import StatsSection from '../../../components/home page/StatsSection';
import WhyChooseUs from '../../../components/home page/WhyChooseUs';
import HomeTestimonialsSection from '../../../components/home page/HomeTestimonialsSection';
import SignupSection from '../../../components/home page/SignupSection';
import CTASection from '../../../components/home page/CTASection';
import ClientLogosSlider from '../../../components/about/ClientLogosSlider';
import CustomKitchenHighlight from '../../../components/home page/CustomKitchenHighlight';
import { useStorefrontCategories } from '@/hooks/useStorefrontCategories';
import type { HomeCategoriesIntro, HomePageConfig, HomeSectionId } from '@/lib/sitePages.types';
import {
  CLIENT_LOGOS_SLIDER_VISIBLE,
  DEFAULT_HOME_PAGE_CONFIG,
  HOME_STATS_SECTION_VISIBLE,
  HOME_WHY_CHOOSE_US_SECTION_VISIBLE,
} from '@/lib/homePage.defaults';
import {
  homeSectionDescriptionLight,
  homeSectionEyebrowLight,
  homeSectionTitleLight,
  homeButtonCompact,
} from '@/lib/homeSectionTypography';

const INITIAL_ROWS = 4;
const ROWS_PER_STEP = 4;

function useCategoryGridColumns() {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setColumns(4);
      else if (w >= 1024) setColumns(3);
      else if (w >= 640) setColumns(2);
      else setColumns(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return columns;
}

function HomeCategoriesSection({ intro }: { intro: HomeCategoriesIntro }) {
  const { categories, loading: categoriesLoading } = useStorefrontCategories();
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
  const columns = useCategoryGridColumns();

  const visibleCount = Math.min(visibleRows * columns, categories.length);
  const visibleCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = visibleCount < categories.length;
  const canShowLess = visibleRows > INITIAL_ROWS;

  return (
    <section className="border-t border-[#EBF0F4] bg-[#EBF0F4]">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-16">
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <span className={`mb-3 inline-flex items-center gap-1.5 sm:mb-4 sm:gap-2 ${homeSectionEyebrowLight}`}>
            <span className="h-px w-6 bg-[#0F4C69] sm:w-8" />
            {intro.eyebrow}
            <span className="h-px w-6 bg-[#0F4C69] sm:w-8" />
          </span>
          <h2 className={`mb-3 sm:mb-4 md:mb-5 ${homeSectionTitleLight}`}>
            {intro.title}{' '}
            <span className="text-[#E36630]">{intro.titleHighlight}</span>
          </h2>
          <p className={`mx-auto max-w-2xl px-1 ${homeSectionDescriptionLight}`}>
            {intro.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {categoriesLoading ? (
            Array.from({ length: INITIAL_ROWS * columns }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 animate-pulse sm:rounded-xl"
              >
                <div className="aspect-square w-full bg-gray-200" />
                <div className="space-y-2 p-3 sm:p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200 sm:h-5" />
                  <div className="h-3 w-1/3 rounded bg-gray-200 sm:h-4" />
                </div>
              </div>
            ))
          ) : categories.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-gray-500">
              No categories to show yet.
            </p>
          ) : (
            visibleCategories.map((category) => (
              <CategoryCard
                key={category._id}
                title={category.title}
                image={category.image || undefined}
                category={category.title}
                categorySlug={category.slug}
              />
            ))
          )}
        </div>

        {!categoriesLoading && categories.length > INITIAL_ROWS * columns && (
          <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {hasMoreCategories && (
              <button
                type="button"
                onClick={() => {
                  const totalRows = Math.ceil(categories.length / columns);
                  setVisibleRows((rows) => Math.min(rows + ROWS_PER_STEP, totalRows));
                }}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F4C69] px-6 py-2.5 text-white shadow-md transition-colors hover:bg-[#0d3d55] sm:w-auto sm:px-8 sm:py-3 ${homeButtonCompact}`}
              >
                Show More
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            {canShowLess && (
              <button
                type="button"
                onClick={() => setVisibleRows(INITIAL_ROWS)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#E36630] bg-white px-6 py-2.5 text-[#E36630] transition-colors hover:bg-[#E36630] hover:text-white sm:w-auto sm:px-8 sm:py-3 ${homeButtonCompact}`}
              >
                Show Less
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface HomePageProps {
  config?: HomePageConfig;
}

const HomePage = ({ config: configProp }: HomePageProps) => {
  const config = configProp ?? DEFAULT_HOME_PAGE_CONFIG;

  const renderSection = (id: HomeSectionId) => {
    switch (id) {
      case 'hero':
        return <ImageSlider key="hero" slides={config.hero.slides} />;
      case 'clientLogos':
        return (
          <ClientLogosSlider key="clientLogos" intro={config.clientLogos} variant="strip" />
        );
      case 'sale':
        return <SaleSection key="sale" content={config.sale} />;
      case 'customKitchen':
        return <CustomKitchenHighlight key="customKitchen" content={config.customKitchen} />;
      case 'categories':
        return <HomeCategoriesSection key="categories" intro={config.categoriesIntro} />;
      case 'stats':
        return <StatsSection key="stats" content={config.stats} />;
      case 'whyChooseUs':
        return <WhyChooseUs key="whyChooseUs" content={config.whyChooseUs} />;
      case 'testimonials':
        return <HomeTestimonialsSection key="testimonials" content={config.testimonials} />;
      case 'signup':
        return <SignupSection key="signup" content={config.signup} />;
      case 'cta':
        return <CTASection key="cta" content={config.cta} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {config.sections
        .filter(
          (s) =>
            s.enabled &&
            (CLIENT_LOGOS_SLIDER_VISIBLE || s.id !== 'clientLogos') &&
            (HOME_STATS_SECTION_VISIBLE || s.id !== 'stats') &&
            (HOME_WHY_CHOOSE_US_SECTION_VISIBLE || s.id !== 'whyChooseUs'),
        )
        .map((s) => renderSection(s.id))}
    </div>
  );
};

export default HomePage;
