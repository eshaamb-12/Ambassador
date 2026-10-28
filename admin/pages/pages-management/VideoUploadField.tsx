'use client';

import { useState, type ChangeEvent } from 'react';
import { getYouTubeEmbedUrl, isYoutubeVideoUrl } from '@/lib/galleryVideo.util';
import { uploadMedia } from '@/utils/uploadMedia';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

type InputMode = 'upload' | 'link';

export function VideoUploadField({
  label,
  hint,
  videoUrl,
  onChangeUrl,
}: {
  label: string;
  hint?: string;
  videoUrl: string;
  onChangeUrl: (url: string) => void;
}) {
  const [mode, setMode] = useState<InputMode>(() =>
    videoUrl && !videoUrl.startsWith('blob:') ? 'link' : 'upload',
  );
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const embedUrl = videoUrl && isYoutubeVideoUrl(videoUrl) ? getYouTubeEmbedUrl(videoUrl) : null;
  const showDirectVideo =
    videoUrl &&
    !videoUrl.startsWith('blob:') &&
    !embedUrl &&
    /^https?:\/\//i.test(videoUrl);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');
    if (!file.type.startsWith('video/')) {
      setUploadError('Please choose an MP4, WebM, or MOV video.');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setUploadError('Video must be 100 MB or smaller.');
      return;
    }

    setUploading(true);
    setUploadPct(0);
    try {
      const { url } = await uploadMedia(file, setUploadPct, { preferServer: true });
      onChangeUrl(url);
      setMode('link');
    } catch (err) {
      setUploadError((err as Error).message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium text-gray-600">
        {label}
        {hint ? <span className="font-normal text-gray-400"> · {hint}</span> : null}
      </span>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            mode === 'upload' ? 'bg-[#0F4C69] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upload from PC
        </button>
        <button
          type="button"
          onClick={() => setMode('link')}
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            mode === 'link' ? 'bg-[#0F4C69] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          YouTube / link
        </button>
      </div>

      {videoUrl && !videoUrl.startsWith('blob:') ? (
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-black">
          <button
            type="button"
            onClick={() => {
              onChangeUrl('');
              setUploadError('');
              setMode('upload');
            }}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition-colors hover:bg-red-600"
            title="Remove video"
            aria-label="Remove video"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Video preview"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : showDirectVideo ? (
            <video src={videoUrl} className="aspect-video w-full object-contain" controls preload="metadata" />
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-gray-500">No video yet — upload a file or paste a link.</p>
      )}

      {mode === 'upload' ? (
        <>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            disabled={uploading}
            onChange={(e) => void handleFile(e)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#0F4C69] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#0d3d55] disabled:opacity-60"
          />
          <p className="text-xs text-gray-500">MP4, WebM, MOV — up to 100 MB (stored on Cloudinary).</p>
        </>
      ) : (
        <input
          type="url"
          value={videoUrl.startsWith('blob:') ? '' : videoUrl}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="https://youtube.com/... or uploaded video URL"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      )}

      {uploading && (
        <p className="text-xs text-[#0F4C69]">Uploading… {uploadPct > 0 ? `${uploadPct}%` : ''}</p>
      )}
      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
