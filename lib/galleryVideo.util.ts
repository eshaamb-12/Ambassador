export function isYoutubeVideoUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  return (
    u.includes('youtube.com/') ||
    u.includes('youtu.be/') ||
    u.includes('youtube-nocookie.com/')
  );
}

export function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes('youtube.com/watch?v=')) {
    return trimmed.split('v=')[1]?.split('&')[0] ?? null;
  }
  if (trimmed.includes('youtu.be/')) {
    return trimmed.split('youtu.be/')[1]?.split('?')[0] ?? null;
  }
  if (trimmed.includes('youtube.com/shorts/')) {
    return trimmed.split('/shorts/')[1]?.split('?')[0] ?? null;
  }
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed.split('/embed/')[1]?.split('?')[0] ?? null;
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function youTubeThumbnailUrl(videoId: string, quality: 'hq' | 'mq' = 'hq'): string {
  const file = quality === 'hq' ? 'hqdefault.jpg' : 'mqdefault.jpg';
  return `https://img.youtube.com/vi/${videoId}/${file}`;
}

export function directGalleryVideoUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || getYouTubeEmbedUrl(trimmed) || !/^https?:\/\//i.test(trimmed)) return '';
  if (isYoutubeVideoUrl(trimmed)) return '';
  return trimmed;
}
