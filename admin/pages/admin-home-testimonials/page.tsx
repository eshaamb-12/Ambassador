'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminIconActionBtn, adminIconActionBtnDanger } from '@/admin/lib/adminTableActionStyles';
import { useDashboardPermissions } from '@/hooks/useDashboardPermissions';
import { VideoUploadField } from '@/admin/pages/pages-management/VideoUploadField';
import { getYouTubeEmbedUrl, isYoutubeVideoUrl } from '@/lib/galleryVideo.util';

interface Row {
  id: string;
  name: string;
  profession: string;
  description: string;
  videoUrl: string;
  status: 'active' | 'inactive';
  sortOrder: number;
}

interface Doc {
  _id: string;
  name: string;
  profession: string;
  description?: string;
  videoUrl?: string;
  status?: string;
  sortOrder?: number;
}

function mapDoc(doc: Doc): Row {
  return {
    id: String(doc._id),
    name: doc.name,
    profession: doc.profession,
    description: doc.description ?? '',
    videoUrl: doc.videoUrl ?? '',
    status: doc.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : 0,
  };
}

const modalInputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20';

const emptyForm: Omit<Row, 'id'> = {
  name: '',
  profession: '',
  description: '',
  videoUrl: '',
  status: 'active',
  sortOrder: 0,
};

export default function AdminHomeTestimonialsPage() {
  const { canDelete, canChangeStatus } = useDashboardPermissions();
  const [rows, setRows] = useState<Row[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await fetch('/api/admin/home-testimonials', { credentials: 'include' });
      const json = await res.json();
      if (!json.success) {
        throw new Error(typeof json.message === 'string' ? json.message : 'Failed to load testimonials.');
      }
      const data: Doc[] = Array.isArray(json.data) ? json.data : [];
      setRows(data.map(mapDoc));
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load testimonials.');
      setRows([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.profession.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openAdd = () => {
    setFormError(null);
    setForm(emptyForm);
    setShowAdd(true);
  };

  const openEdit = (row: Row) => {
    setFormError(null);
    setSelected(row);
    setForm({
      name: row.name,
      profession: row.profession,
      description: row.description,
      videoUrl: row.videoUrl,
      status: row.status,
      sortOrder: row.sortOrder,
    });
    setShowEdit(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const name = form.name.trim();
    const profession = form.profession.trim();
    const videoUrl = form.videoUrl.trim();
    if (!name || !profession) {
      setFormError('Name and profession are required.');
      return;
    }
    if (!videoUrl || videoUrl.startsWith('blob:')) {
      setFormError('Upload a video or paste a YouTube / video link, then save.');
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await fetch('/api/admin/home-testimonials', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          profession,
          description: form.description.trim(),
          videoUrl,
          sortOrder: form.sortOrder,
          ...(canChangeStatus ? { status: form.status } : { status: 'active' }),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(typeof json.message === 'string' ? json.message : 'Could not create testimonial.');
      }
      await load();
      setShowAdd(false);
      setForm(emptyForm);
      setToast('Testimonial created and live on the home page.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setFormError(null);
    const name = form.name.trim();
    const profession = form.profession.trim();
    const videoUrl = form.videoUrl.trim();
    if (!name || !profession) {
      setFormError('Name and profession are required.');
      return;
    }
    if (!videoUrl || videoUrl.startsWith('blob:')) {
      setFormError('Video is required (upload or paste a link).');
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/home-testimonials/${selected.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          profession,
          description: form.description.trim(),
          videoUrl,
          sortOrder: form.sortOrder,
          ...(canChangeStatus ? { status: form.status } : {}),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(typeof json.message === 'string' ? json.message : 'Could not save testimonial.');
      }
      await load();
      setShowEdit(false);
      setSelected(null);
      setToast('Testimonial saved.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/home-testimonials/${selected.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(typeof json.message === 'string' ? json.message : 'Could not delete.');
      }
      await load();
      setShowDelete(false);
      setSelected(null);
      setToast('Testimonial deleted.');
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Delete failed.');
      setShowDelete(false);
    } finally {
      setFormSubmitting(false);
    }
  };

  const toggleStatus = async (row: Row) => {
    const next = row.status === 'active' ? 'inactive' : 'active';
    setTogglingId(row.id);
    try {
      const res = await fetch(`/api/admin/home-testimonials/${row.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(typeof json.message === 'string' ? json.message : 'Could not update status.');
      }
      await load();
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Could not update status.');
    } finally {
      setTogglingId(null);
    }
  };

  const renderVideoPreview = (url: string) => {
    if (!url.trim()) return null;
    const embed = isYoutubeVideoUrl(url) ? getYouTubeEmbedUrl(url) : null;
    if (embed) {
      return (
        <iframe
          src={embed}
          title="Preview"
          className="mt-2 aspect-video w-full max-w-md rounded-lg border border-gray-200"
          allowFullScreen
        />
      );
    }
    if (/^https?:\/\//i.test(url)) {
      return (
        <video src={url} controls className="mt-2 max-h-48 w-full max-w-md rounded-lg border border-gray-200" />
      );
    }
    return null;
  };

  const formFields = (
    <>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Name</label>
        <input
          className={modalInputClass}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Profession</label>
        <input
          className={modalInputClass}
          value={form.profession}
          onChange={(e) => setForm((f) => ({ ...f, profession: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Sort order (lower = first)</label>
        <input
          type="number"
          className={modalInputClass}
          value={form.sortOrder}
          onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
        />
      </div>
      <VideoUploadField
        label="Video"
        hint="upload from PC or paste YouTube — required for the card"
        videoUrl={form.videoUrl}
        onChangeUrl={(videoUrl) => setForm((f) => ({ ...f, videoUrl }))}
      />
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Description (optional, not on card)</label>
        <textarea
          className={modalInputClass}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      {canChangeStatus ? (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
          <select
            className={modalInputClass}
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value === 'inactive' ? 'inactive' : 'active' }))
            }
          >
            <option value="active">Active (shown on home page)</option>
            <option value="inactive">Inactive (hidden)</option>
          </select>
        </div>
      ) : null}
    </>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Home Testimonials</h1>
          <p className="text-gray-600">
            Create, edit, and delete video testimonial cards on the home page. Section headline copy is still edited
            under{' '}
            <Link href="/pages-management" className="text-orange-600 underline hover:text-orange-700">
              Pages → Home
            </Link>
            .
          </p>
        </div>

        {toast ? (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {toast}
          </div>
        ) : null}

        {listError ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{listError}</span>
            <button
              type="button"
              onClick={() => load()}
              className="shrink-0 rounded-md bg-white px-3 py-1.5 shadow-sm ring-1 ring-red-200 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or profession…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 py-2 pl-10 pr-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add testimonial
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Profession
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Toggle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {listLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-sm text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-sm text-gray-500">
                      No testimonials yet. Click &quot;Add testimonial&quot; to create one — each save updates the home
                      page immediately.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{row.sortOrder}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.profession}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {row.videoUrl ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {canChangeStatus ? (
                          <button
                            type="button"
                            disabled={togglingId === row.id}
                            onClick={() => toggleStatus(row)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                              row.status === 'active' ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                row.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            className={adminIconActionBtn}
                            title="View"
                            onClick={() => {
                              setSelected(row);
                              setShowView(true);
                            }}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button type="button" className={adminIconActionBtn} title="Edit" onClick={() => openEdit(row)}>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          {canDelete ? (
                            <button
                              type="button"
                              className={adminIconActionBtnDanger}
                              title="Delete"
                              onClick={() => {
                                setSelected(row);
                                setShowDelete(true);
                              }}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {(showAdd || showEdit) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {showAdd ? 'Add testimonial' : 'Edit testimonial'}
              </h2>
              {formError ? (
                <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
              ) : null}
              <form onSubmit={showAdd ? submitCreate : submitEdit} className="space-y-4">
                {formFields}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowAdd(false);
                      setShowEdit(false);
                      setSelected(null);
                    }}
                    disabled={formSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    {formSubmitting ? 'Saving…' : showAdd ? 'Create testimonial' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showView && selected ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">{selected.name}</h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">Profession</dt>
                  <dd className="text-gray-900">{selected.profession}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Sort order</dt>
                  <dd className="text-gray-900">{selected.sortOrder}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="text-gray-900">{selected.status}</dd>
                </div>
                {selected.description ? (
                  <div>
                    <dt className="font-medium text-gray-500">Description</dt>
                    <dd className="whitespace-pre-wrap text-gray-900">{selected.description}</dd>
                  </div>
                ) : null}
              </dl>
              {renderVideoPreview(selected.videoUrl)}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setShowView(false);
                    setSelected(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showDelete && selected ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">Delete testimonial?</h2>
              <p className="mb-6 text-sm text-gray-600">
                Remove <strong>{selected.name}</strong> from the home page. This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  onClick={() => {
                    setShowDelete(false);
                    setSelected(null);
                  }}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  onClick={confirmDelete}
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
