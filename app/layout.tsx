import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import { UserProvider } from "@/contexts/UserContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { getSiteUrl } from "@/lib/siteUrl";
import { getPublicSiteSettings } from "@/backend/lib/loadSiteSettings";
import SiteTracking from "@/components/site/SiteTracking";
import SiteHeadInjection from "@/components/site/SiteHeadInjection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tracking = await getPublicSiteSettings();
  const verification = tracking.googleSiteVerification.trim();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: 'Ambassador Commercial Kitchen',
      template: '%s | Ambassador Commercial Kitchen',
    },
    description:
      'Commercial kitchen equipment and professional food service solutions in Pakistan.',
    ...(verification
      ? { verification: { google: verification } }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tracking = await getPublicSiteSettings();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeadInjection html={tracking.headExtraHtml} />
        <SiteTracking settings={tracking} />
        <CartProvider>
          <UserProvider>
            <WishlistProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </WishlistProvider>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
