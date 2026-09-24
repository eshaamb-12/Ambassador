'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PublicSiteSettings } from '@/lib/siteSettings.types';

const emptyForm: PublicSiteSettings = {
  googleAnalyticsId: '',
  googleTagManagerId: '',
  googleSiteVerification: '',
  headExtraHtml: '',
  bodyExtraHtml: '',
};

export default function SeoTrackingSection() {
  const [form, setForm] = useState<PublicSiteSettings>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/site-settings', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to load settings.');
      }
      setForm({ ...emptyForm, ...json.data });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to save.');
      }
      setForm({ ...emptyForm, ...json.data });
      setMessage('SEO & tracking saved. Changes appear on the public site immediately.');
      setTimeout(() => setMessage(''), 5000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading SEO & tracking settings…</p>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="rounded-xl border border-[#0F4C69]/15 bg-[#0F4C69]/5 p-4 text-sm text-gray-700">
        <p className="font-medium text-[#0F4C69]">How this works</p>
        <p className="mt-1">
          Update Google Analytics, Tag Manager, and Search Console here — no code deploy needed.
          Use <strong>Site header</strong> for meta tags and JSON-LD; use <strong>Site footer</strong> for
          script snippets (pixels, chat widgets, GTM body code).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Google Analytics measurement ID
          </label>
          <input
            type="text"
            value={form.googleAnalyticsId}
            onChange={(e) => setForm((f) => ({ ...f, googleAnalyticsId: e.target.value }))}
            placeholder="G-XXXXXXXXXX"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0F4C69] focus:ring-2 focus:ring-[#0F4C69]/25"
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty to disable GA on the storefront.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Google Tag Manager container ID
          </label>
          <input
            type="text"
            value={form.googleTagManagerId}
            onChange={(e) => setForm((f) => ({ ...f, googleTagManagerId: e.target.value }))}
            placeholder="GTM-XXXXXXX"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0F4C69] focus:ring-2 focus:ring-[#0F4C69]/25"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Google Search Console verification
          </label>
          <input
            type="text"
            value={form.googleSiteVerification}
            onChange={(e) => setForm((f) => ({ ...f, googleSiteVerification: e.target.value }))}
            placeholder="Verification content value from Google"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0F4C69] focus:ring-2 focus:ring-[#0F4C69]/25"
          />
          <p className="mt-1 text-xs text-gray-500">
            The content value only (not the full meta tag). Used in site metadata for verification.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Site header — extra HTML for &lt;head&gt;
        </label>
        <p className="mb-2 text-xs text-gray-500">
          Meta tags, link tags, or JSON-LD. Script tags are removed here — put scripts in the footer field
          below or use the GA / GTM IDs above.
        </p>
        <textarea
          value={form.headExtraHtml}
          onChange={(e) => setForm((f) => ({ ...f, headExtraHtml: e.target.value }))}
          rows={8}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs text-gray-900 outline-none focus:border-[#0F4C69] focus:ring-2 focus:ring-[#0F4C69]/25"
          placeholder={'<meta name="facebook-domain-verification" content="..." />\n<script type="application/ld+json">...</script>'}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Site footer — scripts before &lt;/body&gt;
        </label>
        <p className="mb-2 text-xs text-gray-500">
          Paste tracking scripts, chat widgets, or other snippets Google gives you for the bottom of the
          page.
        </p>
        <textarea
          value={form.bodyExtraHtml}
          onChange={(e) => setForm((f) => ({ ...f, bodyExtraHtml: e.target.value }))}
          rows={8}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs text-gray-900 outline-none focus:border-[#0F4C69] focus:ring-2 focus:ring-[#0F4C69]/25"
          placeholder="<script>...</script>"
        />
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-lg bg-[#0F4C69] px-6 py-2 text-sm font-medium text-white hover:bg-[#0d3f59] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save SEO & tracking'}
        </button>
      </div>
    </div>
  );
}
