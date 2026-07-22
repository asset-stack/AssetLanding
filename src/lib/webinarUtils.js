/**
 * Derive webinar status from the scheduled date.
 * - upcoming: more than 5 minutes before start
 * - live: within 5 min before start to 2 hours after start
 * - completed: more than 2 hours after start
 */
export function getWebinarStatus(webinar, now = new Date()) {
  if (!webinar?.scheduled_date) return 'upcoming';
  const start = new Date(webinar.scheduled_date);
  const liveWindowEnd = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const liveWindowStart = new Date(start.getTime() - 5 * 60 * 1000);

  if (now < liveWindowStart) return 'upcoming';
  if (now >= liveWindowStart && now <= liveWindowEnd) return 'live';
  return 'completed';
}

export function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId, autoplay = false) {
  return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
}

export function formatWebinarDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  });
}

export function getCountdown(dateStr, now = new Date()) {
  const start = new Date(dateStr);
  const diff = start - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
}