const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = '@secretsharz8427';

function jsonError(res, status, message) {
  res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return jsonError(res, 405, 'Method not allowed');
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  // A missing production key must not turn the entire homepage into a 503.
  // The frontend can render the rest of the page and show a neutral video state
  // until the Vercel production environment is configured.
  if (!apiKey) {
    // Never cache the unconfigured state. This prevents a temporary missing-key
    // response from remaining visible after the Vercel environment is fixed.
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
    const channelResponse = await fetch(channelUrl.toString());
    if (!channelResponse.ok) throw new Error(`Channel lookup failed: ${channelResponse.status}`);
    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
    if (!channel?.id || !uploadsPlaylistId) return jsonError(res, 404, 'The Secret Sharz YouTube channel could not be found.');

    const playlistUrl = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
    playlistUrl.searchParams.set('part', 'snippet,contentDetails');
    playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
    playlistUrl.searchParams.set('maxResults', String(maxResults));
    if (pageToken) playlistUrl.searchParams.set('pageToken', pageToken);
    playlistUrl.searchParams.set('key', apiKey);
    const playlistResponse = await fetch(playlistUrl.toString());
    if (!playlistResponse.ok) throw new Error(`Uploads lookup failed: ${playlistResponse.status}`);
    const playlistData = await playlistResponse.json();

    const videoIds = (playlistData.items || []).map((item) => item.contentDetails?.videoId).filter(Boolean);
    let videoDetails = {};
    if (videoIds.length) {
      const videoUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
      videoUrl.searchParams.set('part', 'contentDetails,status');
      videoUrl.searchParams.set('id', videoIds.join(','));
      videoUrl.searchParams.set('key', apiKey);
      const videoResponse = await fetch(videoUrl.toString());
      if (!videoResponse.ok) throw new Error(`Video details lookup failed: ${videoResponse.status}`);
      const videoData = await videoResponse.json();
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
