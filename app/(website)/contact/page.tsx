import type { Metadata } from 'next';
import ContactPage from '@/client/pages/contact/ContactPage';
import { canonicalMetadata } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Contact Us | Ambassador Commercial Kitchen Equipment',
  description:
    'Contact Ambassador for product inquiries, showroom visits, custom kitchen projects, and after-sales support in Pakistan.',
  ...canonicalMetadata('/contact'),
};

export default function Contact() {
  return <ContactPage />;
}
