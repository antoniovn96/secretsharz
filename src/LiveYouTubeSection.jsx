import React, { useEffect, useState } from 'react';

export default function LiveYouTubeSection({ navigate }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/youtube-videos?limit=3')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load videos.');
        if (active) setVideos(data.items || []);
      })
      .catch((err) => { if (active) setError(err.message || 'Unable to load videos.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const go = (path) => navigate?.(path);

  return (
    <section className="ss-live-youtube" aria-labelledby="ss-live-youtube-title">
      <div className="ss-live-youtube__heading">
        <p>From Secret Sharz</p>
        <h2 id="ss-live-youtube-title">Real people. Real conversations.</h2>
        <span>Latest videos from the official Secret Sharz YouTube channel.</span>
      </div>

      {loading && <div className="ss-live-youtube__state" role="status" aria-live="polite">Loading the latest Secret Sharz videos…</div>}
      {!loading && error && (
        <div className="ss-live-youtube__state" role="alert">
          <strong>We could not load the video library right now.</strong>
          <span>{error}</span>
          <button type="button" onClick={() => go('/videos')}>Open video library</button>
        </div>
      )}
      {!loading && !error && videos.length === 0 && (
        <div className="ss-live-youtube__state">There are no public videos available on the channel right now.</div>
      )}
      {!loading && !error && videos.length > 0 && (
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

      <style>{`
        .ss-live-youtube{background:#fff;padding:96px 6vw;border-top:1px solid #e2e8e3}.ss-live-youtube__heading{max-width:760px;margin:0 auto 42px;text-align:center}.ss-live-youtube__heading p{margin:0 0 12px;color:#2e6b4a;font-size:13px;font-weight:850;text-transform:uppercase;letter-spacing:.14em}.ss-live-youtube__heading h2{margin:0 0 14px;color:#17231d;font-family:Fraunces,serif;font-size:clamp(34px,4vw,54px);line-height:1.1}.ss-live-youtube__heading span{color:#68766d;font-size:17px;line-height:1.6}.ss-live-youtube__grid{width:min(1100px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.ss-live-youtube__card{overflow:hidden;border:1px solid #dce4de;border-radius:18px;background:#fff;box-shadow:0 10px 35px rgba(25,50,35,.07)}.ss-live-youtube__thumb{display:block;position:relative;aspect-ratio:16/9;background:#edf2ee;overflow:hidden}.ss-live-youtube__thumb img{width:100%;height:100%;object-fit:cover;display:block}.ss-live-youtube__thumb span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;display:grid;place-items:center;padding-left:3px;background:#2e6b4a;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.2)}.ss-live-youtube__body{padding:18px}.ss-live-youtube__body h3{margin:0 0 8px;color:#24342b;font-size:16px;line-height:1.4}.ss-live-youtube__body time{color:#68766d;font-size:12px}.ss-live-youtube__actions{text-align:center;margin-top:30px}.ss-live-youtube__actions button,.ss-live-youtube__state button{min-height:48px;border:0;border-radius:12px;background:#2e6b4a;color:#fff;padding:12px 18px;font-weight:800;cursor:pointer}.ss-live-youtube__state{width:min(900px,100%);margin:auto;padding:28px;border:1px solid #dce4de;border-radius:16px;background:#f7f8f6;color:#33443a;text-align:center;display:grid;gap:10px}.ss-live-youtube__state span{color:#68766d}.ss-live-youtube a:focus-visible,.ss-live-youtube button:focus-visible{outline:3px solid #1f6b46;outline-offset:4px}@media(max-width:800px){.ss-live-youtube{padding:72px 20px}.ss-live-youtube__grid{grid-template-columns:1fr}.ss-live-youtube__card{max-width:650px;width:100%;margin:auto}}@media(prefers-reduced-motion:reduce){.ss-live-youtube *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
      `}</style>
    </section>
  );
}
