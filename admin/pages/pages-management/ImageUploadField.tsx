'use client';

import { useState, type ChangeEvent } from 'react';
import { uploadMedia } from '@/utils/uploadMedia';

const MAX_BYTES = 5 * 1024 * 1024;

export function ImageUploadField({
  label,
  hint,
  imageUrl,
  onChangeUrl,
  previewAlt = 'Preview',
}: {
  label: string;
  hint?: string;
  imageUrl: string;
  onChangeUrl: (url: string) => void;
  previewAlt?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Image must be 5 MB or smaller.');
      return;
    }

    setUploading(true);
    setUploadPct(0);
    try {
      const { url } = await uploadMedia(file, setUploadPct, { preferServer: true });
      onChangeUrl(url);
    } catch (err) {
      setUploadError((err as Error).message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  return (
    <div>
      <span className="block text-xs font-medium text-gray-600">
        {label}
        {hint ? <span className="font-normal text-gray-400"> · {hint}</span> : null}
      </span>
      {imageUrl ? (
        <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={previewAlt} className="max-h-40 w-full object-cover" />
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-500">No image yet — upload from your device.</p>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        onChange={(e) => void handleFile(e)}
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#0F4C69] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#0d3d55] disabled:opacity-60"
      />
      {uploading && (
        <p className="mt-1 text-xs text-[#0F4C69]">Uploading… {uploadPct > 0 ? `${uploadPct}%` : ''}</p>
      )}
      {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
