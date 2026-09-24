import Script from 'next/script';

/** Runs before hydration — appends admin head HTML (meta, link, JSON-LD) to document.head. */
export default function SiteHeadInjection({ html }: { html: string }) {
  const trimmed = html.trim();
  if (!trimmed) return null;

  return (
    <Script id="site-head-extra" strategy="beforeInteractive">
      {`(function(){
  try {
    var t = document.createElement('template');
    t.innerHTML = ${JSON.stringify(trimmed)};
    var nodes = t.content.children;
    for (var i = 0; i < nodes.length; i++) {
      document.head.appendChild(nodes[i].cloneNode(true));
    }
  } catch (e) {}
})();`}
    </Script>
  );
}
