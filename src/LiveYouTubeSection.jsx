import React, { useEffect, useState } from 'react';

export default function LiveYouTubeSection({ navigate }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let active = true;

    // The API key was added after an older cached 200/configured:false response
    // had already reached the CDN. Version the request so the homepage gets a
    // fresh production response immediately after configuration changes.
    fetch('/api/youtube-videos?limit=3&feedVersion=2', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Unable to load videos.');

        if (active) {
          setConfigured(data.configured !== false);
          setVideos(data.items || []);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load videos.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const go = (path) => navigate?.(path);

  return (
    <section className="ss-live-youtube" aria-labelledby="ss-live-youtube-title">
      <div className="ss-live-youtube__heading">
        <div className="ss-live-youtube__heading-copy">
          <p>Insights. Conversations. Guidance.</p>
          <h2 id="ss-live-youtube-title">Watch from Secret Sharz</h2>
          <span className="ss-live-youtube__pill">Insights, conversations, guidance.</span>
        </div>
        <a className="ss-live-youtube__channel" href="https://www.youtube.com/@secretsharz8427" target="_blank" rel="noreferrer"><span aria-hidden="true">▶</span> Visit our YouTube channel <span aria-hidden="true">→</span></a>
      </div>
      <p className="ss-live-youtube__intro">Explore videos on emotional wellbeing, learning, career guidance and more.</p>

      {loading && (
        <div className="ss-live-youtube__state" role="status" aria-live="polite">
          Loading the latest Secret Sharz videos…
        </div>
      )}

      {!loading && error && (
        <div className="ss-live-youtube__state" role="alert">
          <strong>We could not load the video library right now.</strong>
          <span>{error}</span>
          <button type="button" onClick={() => go('/videos')}>Open video library</button>
        </div>
      )}

      {!loading && !error && !configured && (
        <div className="ss-live-youtube__state">
          <strong>Our YouTube library is being connected.</strong>
          <span>In the meantime, you can visit the official Secret Sharz channel.</span>
          <a href="https://www.youtube.com/@secretsharz8427" target="_blank" rel="noreferrer">
            Visit Secret Sharz on YouTube
          </a>
        </div>
      )}

      {!loading && !error && configured && videos.length === 0 && (
        <div className="ss-live-youtube__state">There are no public videos available on the channel right now.</div>
      )}

      {!loading && !error && configured && videos.length > 0 && (
        <>
          <div className="ss-live-youtube__grid">
            {videos.map((video) => (
              <article className="ss-live-youtube__card" key={video.videoId}>
                <a className="ss-live-youtube__thumb" href={video.watchUrl} target="_blank" rel="noreferrer" aria-label={`Watch ${video.title} on YouTube`}>
                  <img src={video.thumbnail} alt="" loading="lazy" />
                  <span aria-hidden="true">▶</span>
                </a>
                <div className="ss-live-youtube__body">
                  <h3>{video.title}</h3>
                  {video.publishedAt && <time dateTime={video.publishedAt}>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(video.publishedAt))}</time>}
                </div>
              </article>
            ))}
          </div>
          <div className="ss-live-youtube__actions">
            <button type="button" onClick={() => go('/videos')}>View all Secret Sharz videos <span aria-hidden="true">→</span></button>
          </div>
        </>
      )}

      <style suppressHydrationWarning>{`
        .ss-live-youtube{background:#fffefa;padding:24px clamp(22px,4.2vw,64px) 28px;border-top:1px solid #edeee5}.ss-live-youtube__heading{max-width:1320px;margin:0 auto 7px;display:flex;align-items:center;justify-content:space-between;gap:18px}.ss-live-youtube__heading-copy{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.ss-live-youtube__heading p{flex-basis:100%;margin:0 0 0;color:#4e7b70;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.1em}.ss-live-youtube__heading h2{margin:0;color:#173f40;font-family:Georgia,serif;font-weight:500;font-size:clamp(25px,2.7vw,36px);letter-spacing:-.035em;line-height:1.1}.ss-live-youtube__pill{border-radius:999px;background:#edf2e9;padding:7px 12px;color:#53746c;font-size:8px!important;text-transform:uppercase;letter-spacing:.04em}.ss-live-youtube__channel{flex-shrink:0;border:1px solid #75a19a;border-radius:999px;padding:9px 13px;color:#164b4b;background:transparent;text-decoration:none;font-size:9px;font-weight:800;display:inline-flex;align-items:center;gap:9px}.ss-live-youtube__channel:hover{background:#edf4ee}.ss-live-youtube__intro{max-width:1320px;margin:0 auto 15px;color:#566964;font-size:10px;line-height:1.5}.ss-live-youtube__grid{width:min(1320px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.ss-live-youtube__card{overflow:hidden;border:1px solid #e3e6dd;border-radius:12px;background:#fff;box-shadow:0 3px 12px rgba(25,50,35,.04)}.ss-live-youtube__thumb{display:block;position:relative;aspect-ratio:16/9;background:#edf2ee;overflow:hidden}.ss-live-youtube__thumb img{width:100%;height:100%;object-fit:cover;display:block}.ss-live-youtube__thumb span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;display:grid;place-items:center;padding-left:3px;background:#2e6b4a;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.2)}.ss-live-youtube__body{padding:11px 12px 12px}.ss-live-youtube__body h3{margin:0 0 6px;color:#243f3c;font-size:11px;line-height:1.4}.ss-live-youtube__body time{color:#68766d;font-size:9px}.ss-live-youtube__actions{text-align:center;margin-top:15px}.ss-live-youtube__actions button,.ss-live-youtube__state button,.ss-live-youtube__state a{min-height:48px;border:0;border-radius:12px;background:#2e6b4a;color:#fff;padding:12px 18px;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}.ss-live-youtube__state{width:min(900px,100%);margin:auto;padding:28px;border:1px solid #dce4de;border-radius:16px;background:#f7f8f6;color:#33443a;text-align:center;display:grid;gap:10px}.ss-live-youtube__state span{color:#68766d}.ss-live-youtube a:focus-visible,.ss-live-youtube button:focus-visible{outline:3px solid #1f6b46;outline-offset:4px}@media(max-width:800px){.ss-live-youtube{padding:24px 18px}.ss-live-youtube__heading{align-items:flex-start;flex-direction:column;gap:10px}.ss-live-youtube__grid{grid-template-columns:1fr}.ss-live-youtube__card{max-width:650px;width:100%;margin:auto}.ss-live-youtube__intro{margin-bottom:14px}}@media(prefers-reduced-motion:reduce){.ss-live-youtube *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
      `}</style>
    </section>
  );
}
