import { permanentRedirect } from 'next/navigation';

/** Legacy URL — use /contact */
export default async function ContactUsRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value == null) continue;
    if (Array.isArray(value)) value.forEach((v) => q.append(key, v));
    else q.set(key, value);
  }
  const qs = q.toString();
  permanentRedirect(qs ? `/contact?${qs}` : '/contact');
}
