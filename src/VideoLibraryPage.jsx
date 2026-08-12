import React, { useCallback, useEffect, useState } from 'react';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function VideoLibraryPage({ navigate }) {
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVideos = useCallback(async (pageToken = '') => {
    setLoading(true);
    setError('');

    try {
      const query = new URLSearchParams({ limit: '12' });
      if (pageToken) query.set('pageToken', pageToken);

      const response = await fetch(`/api/youtube-videos?${query.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load the video library.');
      }

      setVideos(data.items || []);
      setChannel(data.channel || null);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setVideos([]);
      setChannel(null);
      setNextPageToken(null);
      setError(err.message || 'Unable to load the video library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  return (
    <main className="ss-video-library">
      <section className="ss-video-library__hero">
        <div className="ss-video-library__hero-inner">
          <p className="ss-video-library__eyebrow">From Secret Sharz</p>
          <h1>Real people. Real conversations.</h1>
          <p>
            Explore the latest videos, conversations, and learning resources from the Secret Sharz YouTube channel.
          </p>
          {channel?.url && (
            <a href={channel.url} target="_blank" rel="noreferrer" className="ss-video-library__channel-link">
              Visit the Secret Sharz YouTube channel ↗
            </a>
          )}
        </div>
      </section>

      <section className="ss-video-library__content" aria-labelledby="video-library-heading">
        <div className="ss-video-library__heading">
          <div>
            <p className="ss-video-library__eyebrow">Video library</p>
            <h2 id="video-library-heading">Latest from Secret Sharz</h2>
          </div>
          <button type="button" onClick={() => loadVideos()} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {loading && (
          <div className="ss-video-library__state" role="status" aria-live="polite">
            <span className="ss-video-library__spinner" aria-hidden="true" />
            <strong>Loading the latest videos…</strong>
            <span>Connecting to the Secret Sharz YouTube library.</span>
          </div>
        )}

        {!loading && error && (
          <div className="ss-video-library__state ss-video-library__state--error" role="alert">
            <strong>We could not load the video library.</strong>
            <span>{error}</span>
            <button type="button" onClick={() => loadVideos()}>Try again</button>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="ss-video-library__state">
            <strong>No public videos are available right now.</strong>
            <span>Please check the Secret Sharz YouTube channel again soon.</span>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            <div className="ss-video-library__grid">
              {videos.map((video) => (
                <article className="ss-video-library__card" key={video.videoId}>
                  <a
                    className="ss-video-library__thumb"
                    href={video.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    {video.thumbnail ? <img src={video.thumbnail} alt="" loading="lazy" /> : <span className="ss-video-library__no-thumb">Secret Sharz</span>}
                    <span className="ss-video-library__play" aria-hidden="true">▶</span>
                  </a>
                  <div className="ss-video-library__body">
                    <h3>{video.title}</h3>
                    {video.publishedAt && <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>}
                  </div>
                </article>
              ))}
            </div>

            <div className="ss-video-library__pagination">
              {nextPageToken ? (
                <button type="button" onClick={() => loadVideos(nextPageToken)} disabled={loading}>
                  Load more videos →
                </button>
              ) : (
                <span>You’re viewing the latest public videos.</span>
              )}
            </div>
          </>
        )}
      </section>

      <style>{`
        .ss-video-library{min-height:calc(100vh - 160px);background:#FDFCFA;color:#17231d}
        .ss-video-library__hero{padding:88px 6vw;background:linear-gradient(135deg,#FDFCFA 0%,#EEF5EF 100%);border-bottom:1px solid #DCE4DE}
        .ss-video-library__hero-inner{width:min(1000px,100%);margin:auto;text-align:center}
        .ss-video-library__eyebrow{margin:0 0 12px;color:#2E6B4A;font-size:12px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}
        .ss-video-library h1{margin:0 auto 18px;font-family:Fraunces,serif;font-size:clamp(40px,6vw,68px);line-height:1.05;letter-spacing:-.045em;max-width:850px}
        .ss-video-library__hero-inner>p:not(.ss-video-library__eyebrow){max-width:720px;margin:0 auto;color:#4B5C51;font-size:18px;line-height:1.65}
        .ss-video-library__channel-link{display:inline-flex;margin-top:25px;color:#2E6B4A;font-weight:800;text-decoration:none;border-bottom:1px solid rgba(46,107,74,.35);padding-bottom:3px}
        .ss-video-library__content{width:min(1180px,100%);margin:auto;padding:78px 6vw 110px}
        .ss-video-library__heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:34px}
        .ss-video-library__heading h2{margin:0;font-family:Fraunces,serif;font-size:clamp(30px,4vw,46px);line-height:1.1;letter-spacing:-.035em}
        .ss-video-library__heading button,.ss-video-library__state button,.ss-video-library__pagination button{border:0;border-radius:12px;background:#2E6B4A;color:#fff;padding:12px 18px;font-weight:800;cursor:pointer}
        .ss-video-library button:disabled{opacity:.55;cursor:not-allowed}
        .ss-video-library__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
        .ss-video-library__card{overflow:hidden;border:1px solid #DCE4DE;border-radius:20px;background:#fff;box-shadow:0 12px 35px rgba(25,50,35,.07);transition:transform .2s ease,box-shadow .2s ease}
        .ss-video-library__card:hover{transform:translateY(-4px);box-shadow:0 18px 42px rgba(25,50,35,.11)}
        .ss-video-library__thumb{display:block;position:relative;aspect-ratio:16/9;background:#EAF0EC;overflow:hidden;text-decoration:none}
        .ss-video-library__thumb img{width:100%;height:100%;object-fit:cover;display:block}
        .ss-video-library__no-thumb{display:grid;place-items:center;width:100%;height:100%;color:#2E6B4A;font-weight:800}
        .ss-video-library__play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;display:grid;place-items:center;padding-left:3px;background:#2E6B4A;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.2)}
        .ss-video-library__body{padding:18px 18px 20px}
        .ss-video-library__body h3{margin:0 0 8px;color:#24342b;font-size:16px;line-height:1.45}
        .ss-video-library__body time{color:#68766d;font-size:12px}
        .ss-video-library__state{min-height:180px;display:grid;place-items:center;text-align:center;align-content:center;gap:8px;padding:28px;border:1px solid #DCE4DE;border-radius:18px;background:#fff;color:#33443a}
        .ss-video-library__state>span{color:#68766d}
        .ss-video-library__state--error{border-color:#E7C8C4;background:#FFF9F8}
        .ss-video-library__spinner{width:28px;height:28px;border:3px solid #DCE4DE;border-top-color:#2E6B4A;border-radius:50%;animation:ss-video-spin .8s linear infinite}
        .ss-video-library__pagination{display:flex;justify-content:center;margin-top:34px;min-height:48px;align-items:center;color:#68766d;font-size:13px}
        @keyframes ss-video-spin{to{transform:rotate(360deg)}}
        @media(max-width:900px){.ss-video-library__grid{grid-template-columns:1fr 1fr}.ss-video-library__content{padding-left:20px;padding-right:20px}}
        @media(max-width:620px){.ss-video-library__hero{padding:68px 20px}.ss-video-library__heading{align-items:flex-start;flex-direction:column}.ss-video-library__grid{grid-template-columns:1fr}}
        @media(prefers-reduced-motion:reduce){.ss-video-library__card{transition:none}.ss-video-library__spinner{animation:none}}
      `}</style>
    </main>
  );
}
