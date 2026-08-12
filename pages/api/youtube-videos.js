const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = '@secretsharz8427';

function jsonError(res, status, message) {
  res.status(status).json({ error: message });
}

async function fetchYouTube(url, label) {
  const response = await fetch(url.toString());
  if (response.ok) return response.json();

  let details = null;
  try {
    details = await response.json();
  } catch (_) {
    // Keep diagnostics useful even when the upstream response is not JSON.
  }

  const reason = details?.error?.errors?.[0]?.reason || details?.error?.status || 'unknown';
  const message = details?.error?.message || `HTTP ${response.status}`;

  // Never log the URL because it contains the private API key.
  console.error(`[YouTube] ${label} failed: status=${response.status} reason=${reason} message=${message}`);

  const error = new Error(`${label} failed: ${response.status}`);
  error.status = response.status;
  error.reason = reason;
  throw error;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return jsonError(res, 405, 'Method not allowed');
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      configured: false,
      channel: {
        title: 'Secret Sharz',
        url: `https://www.youtube.com/${CHANNEL_HANDLE}`,
      },
      items: [],
      nextPageToken: null,
      source: 'YouTube Data API v3',
      message: 'The video feed is temporarily unavailable.',
    });
  }

  const requestedPageSize = Number(req.query.limit || 12);
  const maxResults = Math.min(50, Math.max(1, Number.isFinite(requestedPageSize) ? requestedPageSize : 12));
  const pageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken : '';

  try {
    const channelUrl = new URL(`${YOUTUBE_API_BASE}/channels`);
    channelUrl.searchParams.set('part', 'id,contentDetails,snippet');
    channelUrl.searchParams.set('forHandle', CHANNEL_HANDLE);
    channelUrl.searchParams.set('key', apiKey);
    const channelData = await fetchYouTube(channelUrl, 'Channel lookup');
    const channel = channelData.items?.[0];
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
    if (!channel?.id || !uploadsPlaylistId) return jsonError(res, 404, 'The Secret Sharz YouTube channel could not be found.');

    const playlistUrl = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
    playlistUrl.searchParams.set('part', 'snippet,contentDetails');
    playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
    playlistUrl.searchParams.set('maxResults', String(maxResults));
    if (pageToken) playlistUrl.searchParams.set('pageToken', pageToken);
    playlistUrl.searchParams.set('key', apiKey);
    const playlistData = await fetchYouTube(playlistUrl, 'Uploads lookup');

    const videoIds = (playlistData.items || []).map((item) => item.contentDetails?.videoId).filter(Boolean);
    let videoDetails = {};
    if (videoIds.length) {
      const videoUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
      videoUrl.searchParams.set('part', 'contentDetails,status');
      videoUrl.searchParams.set('id', videoIds.join(','));
      videoUrl.searchParams.set('key', apiKey);
      const videoData = await fetchYouTube(videoUrl, 'Video details lookup');
      videoDetails = Object.fromEntries((videoData.items || []).map((video) => [video.id, video]));
    }

    const items = (playlistData.items || []).map((item) => {
      const videoId = item.contentDetails?.videoId;
      const details = videoDetails[videoId];
      return {
        videoId,
        title: item.snippet?.title || 'Untitled video',
        description: item.snippet?.description || '',
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt || null,
        thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || null,
        duration: details?.contentDetails?.duration || null,
        privacyStatus: details?.status?.privacyStatus || 'unknown',
        watchUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`,
      };
    }).filter((item) => item.videoId && item.privacyStatus !== 'private');

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      configured: true,
      channel: { id: channel.id, title: channel.snippet?.title || 'Secret Sharz', url: `https://www.youtube.com/${CHANNEL_HANDLE}` },
      items,
      nextPageToken: playlistData.nextPageToken || null,
      source: 'YouTube Data API v3',
    });
  } catch (error) {
    console.error('[YouTube] video library error:', error);
    return jsonError(res, 502, 'We could not load the Secret Sharz video library right now. Please try again.');
  }
}
