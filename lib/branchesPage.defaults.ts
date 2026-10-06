import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { BranchesPageConfig, BranchesSectionId, ShowroomBranch } from '@/lib/branchesPage.types';

const SECTION_ORDER: BranchesSectionId[] = ['hero', 'accentBand', 'grid', 'stats', 'bookVisit', 'signup'];

export const DEFAULT_SHOWROOM_BRANCHES: ShowroomBranch[] = [
  {
    id: '4',
    name: 'Head Office',
    address: '5-A Fazal ELahi Road, Rehman Pura Link Ferozpur Road, Lahore, Pakistan',
    city: 'Lahore',
    state: 'Punjab',
    pincode: '54600',
    phone: '03324313104',
    email: 'info@ambassador.pk',
    manager: 'Mr Faheem Ashraf',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    services: ['Catering Equipment', 'Industrial Kitchen', 'Consulting', 'Training'],
    image: '/Images/Thumbnail-Head-office.png',
    coordinates: { lat: 31.524732, lng: 74.322147 },
    isHeadOffice: true,
  },
  {
    id: '1',
    name: 'Fazaia Showroom',
    address: 'CA 77, Fazaia Downtown, Lahore, Pakistan',
    city: 'Lahore',
    state: 'Punjab',
    pincode: '54000',
    phone: '03370127566',
    email: 'info@ambassador.pk',
    manager: 'Mr Syed Naeem-ul-Hassan',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    services: ['Commercial Kitchen Setup', 'Equipment Sales', 'After-Sales Service', 'Spare Parts'],
    image: '/Images/Fazaia-Show-Room.png',
    coordinates: { lat: 31.367931, lng: 74.235808 },
  },
  {
    id: '2',
    name: 'Raya Showroom',
    address: 'Ambassador Commercial Kitchen 57, Raya Fairways Ph DHA, Lahore',
    city: 'Lahore',
    state: 'Punjab',
    pincode: '54000',
    phone: '03370127561',
    email: 'info@ambassador.pk',
    manager: 'Mr Rashid',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    services: ['Restaurant Equipment', 'Hotel Supplies', 'Installation Service', 'Maintenance'],
    image: '/Images/branch-1.png',
    coordinates: { lat: 31.5204, lng: 74.3587 },
  },
  {
    id: '3',
    name: 'Rawalpindi Showroom',
    address: 'Ambassador House 1, Khursheed Palace 135, Kashmir Road, Sadar, Rawalpindi',
    city: 'Rawalpindi',
    state: 'Punjab',
    pincode: '46000',
    phone: '03324313108',
    email: 'info@ambassador.pk',
    manager: 'Mr Abid Moen',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    services: ['Bakery Equipment', 'Food Processing', 'Custom Solutions', 'Technical Support'],
    image: '/Images/rawalpindi.jpg',
    coordinates: { lat: 33.600344, lng: 73.060206 },
  },
  {
    id: '5',
    name: 'Sundar Factory',
    address: 'Steel World sundar industrial estate',
    city: 'Lahore',
    state: 'Punjab',
    pincode: '54600',
    phone: '03097770978',
    email: 'info@ambassador.pk',
    manager: 'Mr Faizan',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    services: ['Catering Equipment', 'Industrial Kitchen', 'Consulting', 'Training'],
    image: '/Images/Sunder-Factory.png',
    coordinates: { lat: 31.2852, lng: 74.1681 },
  },
];

export const DEFAULT_BRANCHES_PAGE_CONFIG: BranchesPageConfig = {
  sections: SECTION_ORDER.map((id) => ({ id, enabled: true })),
  hero: {
    badge: 'Nationwide Presence',
    titleBefore: 'Our',
    titleHighlight: 'Branches',
    subtitle: 'Visit our 4 showrooms across Pakistan for premium commercial kitchen equipment',
    backgroundImage: '/Images/our branches dark.jpg',
    imageAlt: 'Ambassador branches across Pakistan',
  },
  accentBand: {
    textBeforeHighlight: '',
    highlight: '4 showrooms',
    textAfterHighlight: ' across Lahore & Rawalpindi — walk in or book a visit',
    phoneDisplay: '0333-1166925',
    phoneHref: 'tel:+923314937412',
    contactCta: 'Contact Us',
    contactHref: '/contact-us',
  },
  gridIntro: {
    eyebrow: 'Showrooms',
    titleBefore: 'Our',
    titleHighlight: 'Branches',
    description:
      'Visit any of our locations in Lahore and Rawalpindi for expert advice, live demos, and after-sales support.',
    directionsCta: 'Directions',
    detailsCta: 'Details',
    headOfficeBadge: 'Head Office',
  },
  branches: DEFAULT_SHOWROOM_BRANCHES.map((b) => ({ ...b, services: [...b.services] })),
  stats: {
    eyebrow: 'Our Impact',
    titleBefore: 'Trusted Across',
    titleHighlight: 'Pakistan',
    stats: [
      { value: 4, suffix: '', label: 'Branches' },
      { value: 25, suffix: '+', label: 'Years Experience' },
      { value: 500, suffix: '+', label: 'Projects Completed' },
      { value: 1000, suffix: '+', label: 'Products Installed' },
    ],
  },
  bookVisit: {
    eyebrow: 'Visit Us',
    titleBefore: 'Book a',
    titleHighlight: 'Showroom Visit',
    description: 'See our commercial kitchen equipment in person. Schedule a tour at your nearest branch.',
    sidebarTitle: 'Why visit in person?',
    benefits: [
      {
        title: 'Live Product Demos',
        description: 'See cooking ranges, fryers, refrigeration and more operating before you buy.',
      },
      {
        title: 'Expert Consultation',
        description: 'Our specialists help you choose equipment for your kitchen layout and menu.',
      },
      {
        title: 'Flexible Scheduling',
        description: 'Pick your branch, date, and time slot — we confirm within 24 hours.',
      },
    ],
    preferCallText: 'Prefer to call?',
    preferCallPhoneDisplay: '0333-1166925',
    preferCallPhoneHref: 'tel:+923314937412',
    hoursNote: 'Showroom hours: Mon–Sat, 9:00 AM – 6:00 PM',
    submitCta: 'Book Appointment',
    submitCtaLoading: 'Sending Request...',
    footerLinkText: 'Or',
    footerLinkLabel: 'send us a message',
    footerLinkHref: '/contact-us',
  },
  signup: { ...DEFAULT_ABOUT_PAGE_CONFIG.signup },
};
