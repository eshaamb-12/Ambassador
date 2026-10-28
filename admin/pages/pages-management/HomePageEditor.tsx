'use client';

import { memo, useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { uploadMedia } from '@/utils/uploadMedia';
import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';
import { mergeHomePageConfig } from '@/lib/homePageConfig.util';
import {
  HOME_SECTION_LABELS,
  type HomeHeroSlide,
  type HomePageConfig,
  type HomeSectionId,
} from '@/lib/sitePages.types';
import { Field, SectionContentEditor } from '@/admin/pages/pages-management/homeSectionEditors';

interface HomePageEditorProps {
  initialConfig: HomePageConfig;
}

export default function HomePageEditor({ initialConfig }: HomePageEditorProps) {
  const [config, setConfig] = useState<HomePageConfig>(() => mergeHomePageConfig(initialConfig));
  const [activeSection, setActiveSection] = useState<HomeSectionId>('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const dirtyRef = useRef(false);

  useEffect(() => {
    setConfig(mergeHomePageConfig(initialConfig));
  }, [initialConfig]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const payload = mergeHomePageConfig(config);
      const res = await fetch('/api/admin/pages/home', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get('content-type') ?? '';
      const raw = await res.text();
      if (!contentType.includes('application/json')) {
        throw new Error('Save failed — unexpected server response. Try again.');
      }
      const json = JSON.parse(raw) as { success?: boolean; message?: string; data?: HomePageConfig };
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save.');
      if (json.data) setConfig(mergeHomePageConfig(json.data));
      dirtyRef.current = false;
      setMessage('Home page saved. Changes are live on the storefront.');
      setTimeout(() => setMessage(''), 5000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const patchConfig = useCallback((updater: (c: HomePageConfig) => HomePageConfig) => {
    dirtyRef.current = true;
    setConfig(updater);
  }, []);

  const selectSection = useCallback((id: HomeSectionId) => {
    setActiveSection(id);
  }, []);

  const toggleSection = useCallback((id: HomeSectionId) => {
    patchConfig((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  }, [patchConfig]);

  const moveSection = useCallback((id: HomeSectionId, dir: -1 | 1) => {
    patchConfig((c) => {
      const idx = c.sections.findIndex((s) => s.id === id);
      if (idx < 0) return c;
      const next = idx + dir;
      if (next < 0 || next >= c.sections.length) return c;
      const sections = [...c.sections];
      [sections[idx], sections[next]] = [sections[next], sections[idx]];
      return { ...c, sections };
    });
  }, [patchConfig]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/pages-management" className="text-sm font-medium text-[#0F4C69] hover:underline">
          ← All pages
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-[#E36630]"
          >
            Preview live site
          </a>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="rounded-lg bg-[#0F4C69] px-5 py-2 text-sm font-medium text-white hover:bg-[#0d3f59] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save home page'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="rounded-lg border border-[#0F4C69]/20 bg-[#0F4C69]/5 px-4 py-3 text-sm text-gray-700">
        Edit each section on the right, then click <strong>Save home page</strong>. Hero slides and{' '}
        <strong>Testimonials</strong>: upload videos from your device (or paste a YouTube link). Use{' '}
        <strong>Show</strong> and <strong>Up/Down</strong> to hide or reorder blocks.
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="shrink-0 space-y-2 lg:w-72">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Page sections</p>
          <SectionSidebar
            sections={config.sections}
            activeSection={activeSection}
            onSelect={selectSection}
            onToggle={toggleSection}
            onMove={moveSection}
          />
        </aside>

        <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-6">
          <ActiveSectionPanel activeSection={activeSection} config={config} patchConfig={patchConfig} />
        </div>
      </div>
    </div>
  );
}

const SectionSidebar = memo(function SectionSidebar({
  sections,
  activeSection,
  onSelect,
  onToggle,
  onMove,
}: {
  sections: HomePageConfig['sections'];
  activeSection: HomeSectionId;
  onSelect: (id: HomeSectionId) => void;
  onToggle: (id: HomeSectionId) => void;
  onMove: (id: HomeSectionId, dir: -1 | 1) => void;
}) {
  return (
    <>
      {sections.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          index={index}
          total={sections.length}
          active={activeSection === section.id}
          onSelect={() => onSelect(section.id)}
          onToggle={() => onToggle(section.id)}
          onMoveUp={() => onMove(section.id, -1)}
          onMoveDown={() => onMove(section.id, 1)}
        />
      ))}
    </>
  );
});

const SectionCard = memo(function SectionCard({
  section,
  index,
  total,
  active,
  onSelect,
  onToggle,
  onMoveUp,
  onMoveDown,
}: {
  section: { id: HomeSectionId; enabled: boolean };
  index: number;
  total: number;
  active: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
        active ? 'border-[#0F4C69] bg-[#0F4C69]/5' : 'border-gray-200 bg-white hover:border-[#0F4C69]/40'
      }`}
    >
      <span className="block w-full text-left text-sm font-medium text-gray-900">
        {HOME_SECTION_LABELS[section.id]}
      </span>
      <div
        className="mt-2 flex flex-wrap items-center gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={onToggle}
            className="rounded border-gray-300 text-[#0F4C69]"
          />
          Show
        </label>
        <button
          type="button"
          disabled={index === 0}
          onClick={onMoveUp}
          className="text-xs text-gray-500 hover:text-[#0F4C69] disabled:opacity-30"
        >
          Up
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={onMoveDown}
          className="text-xs text-gray-500 hover:text-[#0F4C69] disabled:opacity-30"
        >
          Down
        </button>
      </div>
    </div>
  );
});

const ActiveSectionPanel = memo(function ActiveSectionPanel({
  activeSection,
  config,
  patchConfig,
}: {
  activeSection: HomeSectionId;
  config: HomePageConfig;
  patchConfig: (fn: (c: HomePageConfig) => HomePageConfig) => void;
}) {
  return (
    <div key={activeSection}>
      <h2 className="text-lg font-semibold text-gray-900">{HOME_SECTION_LABELS[activeSection]}</h2>
      {activeSection === 'hero' ? (
        <HeroSlidesEditor
          slides={config.hero.slides}
          onChange={(slides) => patchConfig((c) => ({ ...c, hero: { slides } }))}
        />
      ) : (
        <SectionContentEditor sectionId={activeSection} config={config} patchConfig={patchConfig} />
      )}
    </div>
  );
});

const HeroSlidesEditor = memo(function HeroSlidesEditor({
  slides,
  onChange,
}: {
  slides: HomeHeroSlide[];
  onChange: (slides: HomeHeroSlide[]) => void;
}) {
  const updateSlide = (index: number, patch: Partial<HomeHeroSlide>) => {
    onChange(slides.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addSlide = () => {
    const nextId = Math.max(0, ...slides.map((s) => s.id)) + 1;
    onChange([
      ...slides,
      {
        id: nextId,
        image: '/Images/4000-by-1800.png',
        alt: 'New slide',
        badge: 'New',
        title: 'Slide title',
        subtitle: 'Slide description',
        cta: 'Shop now',
        ctaHref: '/products',
        align: 'left',
        titleTag: slides.length === 0 ? 'h1' : 'h2',
      },
    ]);
  };

  const removeSlide = (index: number) => {
    onChange(slides.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 space-y-6">
      {slides.map((slide, index) => (
        <HeroSlideFields
          key={slide.id}
          slide={slide}
          index={index}
          canRemove={slides.length > 1}
          onRemove={() => removeSlide(index)}
          onPatch={(patch) => updateSlide(index, patch)}
        />
      ))}
      <button type="button" onClick={addSlide} className="text-sm font-medium text-[#0F4C69] hover:underline">
        + Add slide
      </button>
    </div>
  );
});

const HERO_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const HeroSlideFields = memo(function HeroSlideFields({
  slide,
  index,
  canRemove,
  onRemove,
  onPatch,
}: {
  slide: HomeHeroSlide;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onPatch: (patch: Partial<HomeHeroSlide>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > HERO_IMAGE_MAX_BYTES) {
      setUploadError('Image must be 5 MB or smaller.');
      return;
    }

    setUploading(true);
    setUploadPct(0);
    try {
      const { url } = await uploadMedia(file, setUploadPct, { preferServer: true });
      onPatch({ image: url });
    } catch (err) {
      setUploadError((err as Error).message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Slide {index + 1}</span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-xs text-red-600 hover:underline">
            Remove
          </button>
        )}
      </div>

      <div>
        <span className="block text-xs font-medium text-gray-600">
          Banner image <span className="font-normal text-gray-400">· JPEG/PNG/WebP, max 5 MB</span>
        </span>
        {slide.image ? (
          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.image} alt={slide.alt || 'Slide preview'} className="max-h-40 w-full object-cover" />
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-500">No image yet — upload one from your device.</p>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => void handleImageFile(e)}
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#0F4C69] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#0d3d55] disabled:opacity-60"
        />
        {uploading && (
          <p className="mt-1 text-xs text-[#0F4C69]">Uploading… {uploadPct > 0 ? `${uploadPct}%` : ''}</p>
        )}
        {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
      </div>

      <Field label="Alt text" value={slide.alt} onChange={(v) => onPatch({ alt: v })} />
      <Field label="Badge" value={slide.badge} onChange={(v) => onPatch({ badge: v })} />
      <Field label="Title" value={slide.title} onChange={(v) => onPatch({ title: v })} />
      <Field label="Subtitle" value={slide.subtitle} onChange={(v) => onPatch({ subtitle: v })} multiline />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Button text" value={slide.cta} onChange={(v) => onPatch({ cta: v })} />
        <Field label="Button link" value={slide.ctaHref} onChange={(v) => onPatch({ ctaHref: v })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-gray-600">
          Text alignment
          <select
            value={slide.align}
            onChange={(e) => onPatch({ align: e.target.value as 'left' | 'center' })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-gray-600">
          Title tag (SEO)
          <select
            value={slide.titleTag}
            onChange={(e) => onPatch({ titleTag: e.target.value as 'h1' | 'h2' })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="h1">H1 (main heading)</option>
            <option value="h2">H2</option>
          </select>
        </label>
      </div>
    </div>
  );
});

