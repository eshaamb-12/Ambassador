import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/siteUrl';

/** Paths that should not be indexed (admin, auth, checkout, account, legacy duplicate URLs). */
const DISALLOW_PREFIXES = [
  '/admin',
  '/product-management',
  '/category-management',
  '/orders-management',
  '/gallery-management',
  '/home-testimonials-management',
  '/careers-management',
  '/blog-management',
  '/reviews-management',
  '/admin-settings',
  '/seo-tracking',
  '/pages-management',
  '/payments-management',
  '/payments',
  '/users',
  '/login',
  '/signup',
  '/forgot-password',
  '/forgot-password-otp',
  '/otp-verification',
  '/change-password',
  '/checkout',
  '/payment',
  '/order-success',
  '/profile',
  '/orders',
  '/wishlist',
  '/my-reviews',
  '/network-error',
  '/not-found',
  '/api',
  /** Legacy singular URL prefix only — do not use /products (that blocks the whole catalog) */
  '/product/',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/products', '/api/products/', '/api/categories'],
      disallow: DISALLOW_PREFIXES,
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
