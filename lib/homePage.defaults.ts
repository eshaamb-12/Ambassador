import { PRODUCTS_PATH } from '@/lib/siteRoutes';
import type { HomePageConfig, HomeSectionId } from '@/lib/sitePages.types';

const SECTION_ORDER: HomeSectionId[] = [
  'hero',
  'sale',
  'clientLogos',
  'customKitchen',
  'categories',
  'stats',
  'whyChooseUs',
  'signup',
  'cta',
];

export const DEFAULT_HOME_PAGE_CONFIG: HomePageConfig = {
  sections: SECTION_ORDER.map((id) => ({ id, enabled: true })),
  hero: {
    slides: [
      {
        id: 1,
        image: '/Images/4000-by-1800.png',
        alt: 'Commercial kitchen equipment manufacturing facility in Pakistan – Ambassador',
        badge: 'Industry Leading',
        title: 'Premium Commercial Kitchen Equipment in Pakistan',
        subtitle:
          'Engineered for performance, built for the professional kitchen — trusted by restaurants, hotels, and food businesses across Pakistan as a leading commercial kitchen equipment manufacturer.',
        cta: 'Explore Products',
        ctaHref: PRODUCTS_PATH,
        align: 'left',
        titleTag: 'h1',
      },
      {
        id: 2,
        image: '/Images/40000-by-4-Simple.png',
        alt: 'Professional restaurant kitchen solutions — food preparation and grilling equipment Pakistan',
        badge: 'Complete Kitchen Solutions',
        title: 'Professional Restaurant Kitchen Equipment Solutions',
        subtitle:
          'Everything your kitchen needs — from concept to completion. Ambassador delivers custom commercial kitchen design and industrial kitchen equipment for restaurants, hotels, and institutions, backed by 25+ years of expertise.',
        cta: 'View Catalogue',
        ctaHref: PRODUCTS_PATH,
        align: 'center',
        titleTag: 'h2',
      },
      {
        id: 3,
        image: '/Images/banner-3.png',
        alt: 'Commercial ovens and cooking range equipment – rotary rack oven, deck oven, griddle Pakistan',
        badge: 'Full Product Range',
        title: 'Complete Range of Commercial-Grade Kitchen Machinery',
        subtitle:
          'From griddles to rotary rack ovens — explore our complete commercial oven and cooking range lineup, including bakery ovens, deck ovens, and industrial kitchen machinery for every scale of operation.',
        cta: 'Shop Now',
        ctaHref: PRODUCTS_PATH,
        align: 'left',
        titleTag: 'h2',
      },
    ],
  },
  categoriesIntro: {
    eyebrow: 'What We Offer',
    title: 'Equipment Built for',
    titleHighlight: 'Every Kitchen',
    description:
      'From fast food counters to hospital canteens — explore our full range of commercial kitchen equipment in Pakistan, tailored to every industry.',
  },
  sale: {
    badge: 'Limited Time Offers',
    titleBefore: 'Hot Deals on',
    titleHighlight: 'Premium Commercial Kitchen Equipment',
    description:
      'Grab exclusive discounts on commercial kitchen essentials in Pakistan — from fryers and ovens to cooking ranges — while stocks last.',
    ctaText: 'View All Sales',
  },
  clientLogos: {
    eyebrow: 'Trusted By',
    title: 'Businesses That',
    titleHighlight: 'Rely on Us',
    description:
      'From five-star hotels to fast-food chains — over 1,200 businesses across Pakistan trust Ambassador for their commercial kitchen needs.',
  },
  customKitchen: {
    eyebrow: 'Flagship Service',
    titleBefore: 'Turnkey',
    titleHighlight: 'Custom Kitchens',
    titleAfter: '— From First Call to Completion',
    description:
      'Restaurants and food businesses across Pakistan partner with Ambassador for custom commercial kitchen design — measured on-site, visualised in 2D & 3D, approved by you, then installed by our own specialists with customised commercial kitchen equipment.',
    imageUrl: '/Images/installed.webp',
    imageAlt: 'Custom commercial kitchen design and installation for restaurants – Ambassador Pakistan',
    imageBadge: 'Design · Fabricate · Install',
    highlights: [
      {
        title: 'Site Survey & Measurements',
        text: 'We visit your venue, assess workflow, and take accurate measurements for a commercial kitchen layout that fits your space.',
      },
      {
        title: '2D & 3D Kitchen Design',
        text: 'Our engineers translate your requirements into precise plans and visual models using professional kitchen design tools.',
      },
      {
        title: 'Approval Before Fabrication',
        text: 'Nothing is manufactured until you sign off — so the final build matches exactly what you agreed to.',
      },
      {
        title: 'Installation by Our Team',
        text: 'Trained installers fit your kitchen with Ambassador equipment and supervise quality through handover.',
      },
    ],
    primaryCta: 'See How Custom Kitchen Works',
    primaryCtaHref: '/custom-kitchen',
    secondaryCta: 'Request a Consultation',
    secondaryCtaHref: '/contact-us',
    footerLinkText: 'Custom Kitchen Services',
  },
  stats: {
    eyebrow: 'Our Track Record',
    heading: 'Our Track Record',
    stats: [
      {
        value: 25,
        suffix: '+',
        label: 'Years Experience',
        description: 'Serving commercial kitchens across Pakistan since 1999',
      },
      {
        value: 1500,
        suffix: '+',
        label: 'Products',
        description: 'Comprehensive range of commercial kitchen equipment for every need',
      },
      {
        value: 3000,
        suffix: '+',
        label: 'Happy Clients',
        description: 'Hotels, restaurants & institutions across Pakistan',
      },
      {
        value: 13,
        suffix: '',
        label: 'Industry Sectors',
        description: 'From fast food chains to hospital kitchens',
      },
    ],
    trustBadges: [
      'ISO Certified Manufacturing',
      'Nationwide Delivery & Installation',
      '1-Year Warranty on All Products',
    ],
  },
  whyChooseUs: {
    eyebrowBefore: 'Why',
    eyebrowHighlight: 'Ambassador',
    title: "Why Pakistan's Top Kitchens Choose Us",
    description:
      'Over 25 years of expertise designing, manufacturing, and supplying commercial kitchen equipment for every industry in Pakistan.',
    reasons: [
      {
        title: 'Premium Quality',
        description:
          'Food-grade stainless steel manufacturing meeting international standards for commercial kitchen equipment.',
      },
      {
        title: 'Nationwide Delivery',
        description:
          'Professional delivery and installation across all major cities in Pakistan — Karachi, Lahore, Islamabad & beyond.',
      },
      {
        title: 'Custom Solutions',
        description:
          'Fully tailored commercial kitchen layouts designed and fabricated to your exact space, capacity, and menu requirements.',
      },
      {
        title: 'Expert After-Sales Support',
        description:
          'Dedicated in-house service team for maintenance, repairs, and spare parts — keeping your commercial kitchen equipment running.',
      },
      {
        title: '1-Year Warranty',
        description:
          'Every product carries a full 1-year warranty backed by our engineering and fabrication team on-site.',
      },
    ],
  },
  signup: {
    eyebrow: 'Member Benefits',
    titleBefore: 'Join Ambassador',
    titleHighlight: 'Kitchen Equipment',
    description:
      'Create a free account and unlock exclusive access to B2B pricing, bulk ordering, and a dedicated support team for commercial kitchen equipment — trusted by 1,000+ commercial kitchens across Pakistan.',
    benefits: [
      {
        title: 'Exclusive B2B Pricing',
        description:
          'Get factory-direct commercial kitchen equipment prices not available to the general public.',
      },
      {
        title: 'Bulk Order Management',
        description:
          'Place and track large commercial kitchen equipment orders for hotels, restaurants & institutions.',
      },
      {
        title: 'Custom Quotes & Consultations',
        description: 'Request tailored quotes for custom commercial kitchen setups and projects.',
      },
      {
        title: 'Priority After-Sales Support',
        description: 'Dedicated support team for maintenance, repairs & spare parts.',
      },
    ],
    socialProof:
      '1,000+ businesses already using Ambassador for their commercial kitchen needs.',
    panelTitle: 'Get Started Free',
    panelDescription:
      'No subscription fees. No hidden charges. Just a better way to equip your commercial kitchen.',
    panelPerks: [
      'Free account — always',
      'Instant access to all products',
      'Bulk quote requests in one click',
      'Order history & tracking',
    ],
    primaryCta: 'Create Free Account',
    secondaryCta: 'Sign In to My Account',
  },
  cta: {
    badge: 'Get Started Today',
    titleBefore: 'Ready to Equip Your',
    titleHighlight: 'Commercial Kitchen?',
    description:
      "Whether you're opening a new restaurant, upgrading a hotel kitchen, or setting up a large-scale institutional kitchen — Ambassador's team is ready to help you build the perfect commercial kitchen equipment setup across Pakistan.",
    primaryCta: 'Browse All Products',
    primaryCtaHref: PRODUCTS_PATH,
    secondaryCta: 'Request a Quote',
    secondaryCtaHref: '/contact-us',
    trustItems: [
      { label: '500+ Products', sub: 'In Stock & Ready' },
      { label: 'Fast Delivery', sub: 'Nationwide Coverage' },
      { label: 'Expert Support', sub: 'Mon–Sat 9am–6pm' },
      { label: '1-Year Warranty', sub: 'On All Products' },
    ],
  },
};
