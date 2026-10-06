'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { mergeBranchesPageConfig } from '@/lib/branchesPageConfig.util';
import {
  BRANCHES_SECTION_LABELS,
  type BranchesPageConfig,
  type BranchesSectionId,
} from '@/lib/branchesPage.types';
import { BranchesSectionContentEditor } from '@/admin/pages/pages-management/branchesSectionEditors';

interface BranchesPageEditorProps {
  initialConfig: BranchesPageConfig;
}

export default function BranchesPageEditor({ initialConfig }: BranchesPageEditorProps) {
  const [config, setConfig] = useState<BranchesPageConfig>(() => mergeBranchesPageConfig(initialConfig));
  const [activeSection, setActiveSection] = useState<BranchesSectionId>('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const dirtyRef = useRef(false);

  useEffect(() => {
    setConfig(mergeBranchesPageConfig(initialConfig));
  }, [initialConfig]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const payload = mergeBranchesPageConfig(config);
      const res = await fetch('/api/admin/pages/branches', {
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
      const json = JSON.parse(raw) as { success?: boolean; message?: string; data?: BranchesPageConfig };
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save.');
      if (json.data) setConfig(mergeBranchesPageConfig(json.data));
      dirtyRef.current = false;
      setMessage('Showrooms page saved. Changes are live on the storefront.');
      setTimeout(() => setMessage(''), 5000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const patchConfig = useCallback((updater: (c: BranchesPageConfig) => BranchesPageConfig) => {
    dirtyRef.current = true;
    setConfig(updater);
  }, []);

  const selectSection = useCallback((id: BranchesSectionId) => setActiveSection(id), []);

  const toggleSection = useCallback(
    (id: BranchesSectionId) => {
      patchConfig((c) => ({
        ...c,
        sections: c.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
      }));
    },
    [patchConfig],
  );

  const moveSection = useCallback(
    (id: BranchesSectionId, dir: -1 | 1) => {
      patchConfig((c) => {
        const idx = c.sections.findIndex((s) => s.id === id);
        if (idx < 0) return c;
        const next = idx + dir;
        if (next < 0 || next >= c.sections.length) return c;
        const sections = [...c.sections];
        [sections[idx], sections[next]] = [sections[next], sections[idx]];
        return { ...c, sections };
      });
    },
    [patchConfig],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/pages-management" className="text-sm font-medium text-[#0F4C69] hover:underline">
          ← All pages
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="/branches"
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
            {saving ? 'Saving…' : 'Save showrooms page'}
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
        Edit hero copy, branch cards, stats, and the book-a-visit form labels. The visit booking form still emails your
        team via the existing contact API.
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
          <h2 className="text-lg font-semibold text-gray-900">{BRANCHES_SECTION_LABELS[activeSection]}</h2>
          <BranchesSectionContentEditor sectionId={activeSection} config={config} patchConfig={patchConfig} />
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
  sections: BranchesPageConfig['sections'];
  activeSection: BranchesSectionId;
  onSelect: (id: BranchesSectionId) => void;
  onToggle: (id: BranchesSectionId) => void;
  onMove: (id: BranchesSectionId, dir: -1 | 1) => void;
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
  section: { id: BranchesSectionId; enabled: boolean };
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
        {BRANCHES_SECTION_LABELS[section.id]}
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
