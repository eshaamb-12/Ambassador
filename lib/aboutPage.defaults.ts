import { TESTIMONIAL_PORTRAIT_PATHS } from '@/lib/testimonialPortraits';
import type { AboutPageConfig, AboutSectionId } from '@/lib/aboutPage.types';

const SECTION_ORDER: AboutSectionId[] = [
  'banner',
  'company',
  'ceoAward',
  'certificates',
  'missionValues',
  'clientLogos',
  'testimonials',
  'faq',
  'signup',
];

export const DEFAULT_ABOUT_PAGE_CONFIG: AboutPageConfig = {
  sections: SECTION_ORDER.map((id) => ({ id, enabled: true })),
  banner: {
    imageUrl: '/Images/ABOUT-US-WEB-BANNER-K.png',
    imageAlt: 'About Ambassador Banner',
    title: 'About Ambassador',
    subtitle: 'Your trusted partner for commercial kitchen equipment and food service solutions',
  },
  company: {
    eyebrow: 'Who We Are',
    titleBefore: "Pakistan's Trusted Partner in",
    titleHighlight: 'Commercial Kitchen Equipment',
    paragraphs: [
      'Ambassador is a trusted provider of commercial kitchen equipment and professional food service solutions in Pakistan. With more than 15 years of industry experience, we specialize in supplying high-quality equipment sourced from leading international brands.',
      'Our company supports restaurants, hotels, bakeries, cafés, supermarkets, and institutional kitchens with reliable, efficient equipment designed to meet modern culinary and operational demands — from cooking ranges and refrigeration systems to stainless steel workstations.',
      'At Ambassador, our goal is to help businesses build fully functional, durable kitchen environments, backed by dependable service and practical solutions that keep operations running at the highest standard.',
    ],
    imageUrl: '/Images/about/chef.jpg',
    imageAlt: 'Ambassador commercial kitchen',
    floatBadgeValue: '15+',
    floatBadgeLabel: 'Years Trusted',
    highlights: [
      { value: '20+', label: 'Years of Experience' },
      { value: '500+', label: 'Products Supplied' },
      { value: '1200+', label: 'Happy Clients' },
      { value: '50+', label: 'Cities Covered' },
    ],
  },
  ceoAward: {
    eyebrow: 'Leadership & Recognition',
    titleBefore: 'A Message from',
    titleHighlight: 'Our CEO',
    paragraphs: [
      "At Ambassador Commercial Kitchen Equipment, our journey began in 2005 with a simple vision — to build Pakistan's most trusted name in commercial kitchen equipment manufacturing. Today, as the leading manufacturer of premium, Made-in-Pakistan cooking ranges, chillers, bakery display units, and complete kitchen solutions, we take pride in serving restaurants, cafés, bakeries, and hotels across Pakistan and beyond.",
      'Our commitment to quality, innovation, and craftsmanship has earned the trust of chefs and hospitality professionals worldwide. Every product we design reflects our dedication to durability, performance, and world-class engineering.',
      "As we continue to grow, our mission remains the same: to equip every commercial kitchen with reliable, high-performance solutions that help our clients' businesses thrive. Thank you for trusting Ambassador — your partner in building better kitchens, one solution at a time.",
    ],
    signatureName: 'Ali Mehmood',
    signatureRole: 'Founder & CEO, Ambassador Commercial Kitchen Equipment',
    highlights: [
      { value: 'Brand', label: 'Of The Year' },
      { value: 'Rising', label: 'Brand Award' },
      { value: '20+', label: 'Years Leading' },
      { value: '1000+', label: 'Kitchens Served' },
    ],
    imageUrl: '/Images/Boss-Picture.png',
    imageAlt: 'Ambassador CEO receiving the Brand of the Year Award',
    imageBadgeLine1: 'Brand of the',
    imageBadgeLine2: 'Year Awards',
  },
  certificates: {
    eyebrow: 'Accreditations',
    title: 'Standards That Back',
    titleHighlight: 'Our Quality',
    description:
      'Recognized international certifications that confirm our commitment to quality, safety, and compliance at every level.',
  },
  missionValues: {
    intro: {
      eyebrow: 'What Drives Us',
      title: 'Our Mission, Vision &',
      titleHighlight: 'Core Values',
      description:
        "Everything we do is guided by a clear purpose — to empower Pakistan's food service industry with world-class kitchen solutions.",
    },
    missionLabel: 'Our Mission',
    missionTitle: "Equipping Pakistan's Kitchens for Excellence",
    missionBody:
      'To provide every restaurant, hotel, bakery, and food business in Pakistan with premium commercial kitchen equipment — delivered with expert guidance, honest pricing, and reliable after-sales support — so they can focus on what matters most: great food and great service.',
    visionLabel: 'Our Vision',
    visionTitle: "Pakistan's #1 Commercial Kitchen Partner",
    visionBody:
      'To become the most trusted name in commercial kitchen equipment across South Asia — recognised not only for the products we supply but for the expertise, integrity, and lifelong partnerships we build with every client we serve.',
    valuesTitle: 'The Values Behind Every Decision',
    valuesSubtitle: 'Six principles that shape how we work, how we talk to our customers, and how we grow.',
    valuesImageUrl: '/Images/value2.png',
  },
  clientLogos: {
    eyebrow: 'Trusted By',
    title: 'Businesses That',
    titleHighlight: 'Rely on Us',
    description:
      'From five-star hotels to fast-food chains — over 1,200 businesses across Pakistan trust Ambassador for their commercial kitchen needs.',
  },
  testimonials: {
    intro: {
      eyebrow: 'Client Reviews',
      title: 'What Our',
      titleHighlight: 'Clients Say',
      description:
        "Trusted by hundreds of food service businesses across Pakistan — here's what they have to say.",
    },
    items: [
      {
        name: 'Restaurant Owner — Lahore',
        image: TESTIMONIAL_PORTRAIT_PATHS[0],
        title: 'Excellent Service',
        text: 'Ambassador provided us with top-quality kitchen equipment that transformed our restaurant operations. Their after-sales support is outstanding!',
        rating: 5,
      },
      {
        name: 'Bakery Manager — Karachi',
        image: TESTIMONIAL_PORTRAIT_PATHS[1],
        title: 'Reliable Partner',
        text: "We've been working with Ambassador for 5 years. They always deliver on time and provide the best equipment at competitive prices.",
        rating: 5,
      },
      {
        name: 'Hotel Chef — Islamabad',
        image: TESTIMONIAL_PORTRAIT_PATHS[2],
        title: 'Professional Quality',
        text: 'The commercial kitchen equipment from Ambassador meets international standards. Highly recommended for any food service establishment.',
        rating: 4,
      },
      {
        name: 'Catering Service — Faisalabad',
        image: TESTIMONIAL_PORTRAIT_PATHS[3],
        title: 'Great Value',
        text: 'Outstanding quality equipment at reasonable prices. Their team helped us choose the right products for our catering business.',
        rating: 5,
      },
      {
        name: 'Fast Food Chain Owner',
        image: TESTIMONIAL_PORTRAIT_PATHS[4],
        title: 'Exceptional Support',
        text: 'Quick delivery and excellent customer service. The equipment is durable and has improved our efficiency significantly.',
        rating: 4,
      },
      {
        name: 'Hotel Manager — Rawalpindi',
        image: TESTIMONIAL_PORTRAIT_PATHS[5],
        title: 'Outstanding Quality',
        text: 'The equipment from Ambassador has exceeded our expectations. Their professional team and quality products make them our preferred supplier.',
        rating: 5,
      },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    description: 'Common questions about our products and services',
    items: [
      {
        question: 'What types of kitchen equipment do you supply?',
        answer:
          'We supply a comprehensive range of commercial kitchen equipment including cooking ranges, ovens, fryers, refrigerators, freezers, food preparation tables, dishwashers, and storage solutions and many more.',
      },
      {
        question: 'Do you offer installation and maintenance services?',
        answer:
          'Yes, we provide professional installation services and ongoing maintenance support for all our equipment. Our team of trained technicians ensures proper setup and optimal performance.',
      },
      {
        question: 'What is your delivery coverage area?',
        answer: 'We deliver across all over Pakistan.',
      },
      {
        question: 'Do you provide warranty on your products?',
        answer: 'Local products (Ambassador manufactured Products) come with manufacturer 1 year warranty .',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept multiple payment methods including bank transfers, credit/debit cards, and online payment platforms. ',
      },
      {
        question: 'Can I get technical support after purchase?',
        answer:
          'Absolutely! Our technical support team is available 6 days a week to assist with any product-related questions, troubleshooting, or support needs.',
      },
      {
        question: 'Do you provide training for equipment usage?',
        answer:
          'Yes, we offer comprehensive training sessions for your staff on proper equipment operation, maintenance procedures, and safety protocols.',
      },
    ],
  },
  signup: {
    title: 'Join Ambassador Commercial Kitchen Equipment',
    description:
      'Create an account or sign in to access exclusive pricing, bulk orders, and professional support',
    signupCta: 'Sign Up',
    loginCta: 'Login',
    footerNote: 'Join thousands of restaurants and hotels using Ambassador equipment',
  },
};
