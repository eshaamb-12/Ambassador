import type { Metadata } from 'next';
import CheckoutPage from '@/client/pages/checkout/page';
import { isCheckoutEnabled } from '@/lib/checkoutEnabled';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export const dynamic = 'force-dynamic';

export default function Checkout() {
  return <CheckoutPage checkoutEnabled={isCheckoutEnabled()} />;
}
