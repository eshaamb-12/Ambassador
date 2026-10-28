'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import NavigationHeader from './NavigationHeader';
import Footer from './footer';
import WhatsAppChatWidget from './WhatsAppChat';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const DASHBOARD_PATH_PREFIXES = [
  '/admin',
  '/product-management',
  '/used-equipment-management',
  '/category-management',
  '/users',
  '/orders-management',
  '/gallery-management',
  '/reviews-management',
  '/admin-settings',
  '/seo-tracking',
  '/payments-management',
  '/spare-parts-management',
  '/careers-management',
  '/blog-management',
  '/pages-management',
  '/home-testimonials-management',
] as const;

function matchesPathPrefix(pathname: string | null, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname?.startsWith(prefix));
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  if (matchesPathPrefix(pathname, DASHBOARD_PATH_PREFIXES)) {
    return <>{children}</>;
  }
  
  // Render full layout for non-admin routes
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white shadow-md" aria-hidden />}>
        <Header />
      </Suspense>
      <NavigationHeader />
      {children}
      <Footer />
      <WhatsAppChatWidget />
    </>
  );
};

export default LayoutWrapper;
