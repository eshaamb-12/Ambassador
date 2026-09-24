import Script from 'next/script';
import type { PublicSiteSettings } from '@/lib/siteSettings.types';

interface SiteTrackingProps {
  settings: PublicSiteSettings;
}

/** Injected in root layout — GA, GTM, and admin-configured head/body snippets. */
export default function SiteTracking({ settings }: SiteTrackingProps) {
  const gaId = settings.googleAnalyticsId.trim();
  const gtmId = settings.googleTagManagerId.trim();
  const bodyExtra = settings.bodyExtraHtml.trim();

  return (
    <>
      {gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}

      {gtmId ? (
        <noscript>
          <iframe
            title="Google Tag Manager"
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      ) : null}

      {bodyExtra ? (
        <div dangerouslySetInnerHTML={{ __html: bodyExtra }} suppressHydrationWarning />
      ) : null}
    </>
  );
}
