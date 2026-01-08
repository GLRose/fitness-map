export function getYouTubeVideoId(url: string) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/, // youtube.com/watch?v=ID
    /youtube\.com\/embed\/([^?]+)/, // youtube.com/embed/ID
    /youtu\.be\/([^?]+)/, // youtu.be/ID
    /youtube\.com\/v\/([^?]+)/, // youtube.com/v/ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
}
