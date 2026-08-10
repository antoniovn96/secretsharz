import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/Header';
import Footer from '../src/Footer';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

function formatDuration(iso) {
  if (!iso) return '';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return '';
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const parts = [];
  if (hours) parts.push(String(hours));
  parts.push(String(minutes).padStart(hours ? 2 : 1, '0'));
  parts.push(String(seconds).padStart(2, '0'));
  return parts.join(':');
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function VideosPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [items, setItems] = useState([]);
  const [channel, setChannel] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      if (!user) {
        setUserData(null);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        setUserData(snapshot.exists() ? snapshot.data() : null);
      } catch (_) {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  const loadVideos = async (pageToken = '', append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError('');
    try {
      const query = pageToken ? `?limit=24&pageToken=${encodeURIComponent(pageToken)}` : '?limit=24';
      const response = await fetch(`/api/youtube-videos${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load videos');
      setChannel(data.channel || null);
      setItems((previous) => append ? [...previous, ...(data.items || [])] : (data.items || []));
      setNextPageToken(data.nextPageToken || null);
    } catch (loadError) {
      setError(loadError.message || 'We could not load the video library.');
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  const navigate = (path) => router.push(path);
  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
    router.push('/');
  };
  const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';

  const channelUrl = useMemo(() => channel?.url || 'https://www.youtube.com/@secretsharz8427', [channel]);

  return (
    <>
      <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
      <main id="main-content" className="ss-video-page">
        <section className="ss-video-hero" aria-labelledby="video-page-title">
          <div className="ss-video-container">
            <p className="ss-video-eyebrow">Secret Sharz on YouTube</p>
            <h1 id="video-page-title">Real conversations. Real learning. <em>All in one place.</em></h1>
            <p className="ss-video-lead">Explore videos published on the official Secret Sharz channel. New public uploads can appear here automatically.</p>
            <a className="ss-video-channel-link" href={channelUrl} target="_blank" rel="noopener noreferrer">Visit the Secret Sharz YouTube channel ↗</a>
          </div>
        </section>

        <section className="ss-video-library" aria-labelledby="video-library-title">
          <div className="ss-video-container">
            <div className="ss-video-heading-row">
              <div>
                <p className="ss-video-eyebrow">Video library</p>
                <h2 id="video-library-title">Secret Sharz videos</h2>
              </div>
              {channel?.title ? <span className="ss-video-source">Source: {channel.title}</span> : null}
            </div>

            {loading ? (
              <div className="ss-video-state" role="status" aria-live="polite">Loading the latest Secret Sharz videos…</div>
            ) : error ? (
              <div className="ss-video-state ss-video-error" role="alert">
                <strong>We couldn't load the videos right now.</strong>
                <p>{error}</p>
                <button type="button" onClick={() => loadVideos()}>Try again</button>
              </div>
            ) : items.length === 0 ? (
              <div className="ss-video-state">No public videos are available on the channel yet.</div>
            ) : (
              <>
                <div className="ss-video-grid">
                  {items.map((video) => (
                    <article className="ss-video-card" key={video.videoId}>
                      <button
                        type="button"
                        className="ss-video-thumbnail"
                        onClick={() => setSelected(video)}
                        aria-label={`Play video: ${video.title}`}
                      >
                        {video.thumbnail ? <img src={video.thumbnail} alt="" loading="lazy" /> : <span aria-hidden="true">Secret Sharz video</span>}
                        <span className="ss-video-play" aria-hidden="true">▶</span>
                      </button>
                      <div className="ss-video-card-body">
                        <h3>{video.title}</h3>
                        <p className="ss-video-meta">
                          {formatDate(video.publishedAt)}{video.duration ? ` · ${formatDuration(video.duration)}` : ''}
                        </p>
                        <p className="ss-video-description">{video.description || 'Watch this Secret Sharz video on YouTube.'}</p>
                        <a href={video.watchUrl} target="_blank" rel="noopener noreferrer" className="ss-video-watch-link">Watch on YouTube ↗</a>
                      </div>
                    </article>
                  ))}
                </div>

                {nextPageToken ? (
                  <div className="ss-video-load-more">
                    <button type="button" onClick={() => loadVideos(nextPageToken, true)} disabled={loadingMore}>
                      {loadingMore ? 'Loading more videos…' : 'Load more videos'}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>

      {selected ? (
        <div className="ss-video-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="ss-video-dialog" role="dialog" aria-modal="true" aria-labelledby="selected-video-title" tabIndex="-1">
            <div className="ss-video-dialog-heading">
              <h2 id="selected-video-title">{selected.title}</h2>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close video">×</button>
            </div>
            <div className="ss-video-player">
              <iframe
                src={`${selected.embedUrl}?rel=0&cc_load_policy=1`}
                title={`YouTube video: ${selected.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="ss-video-dialog-note">Captions are available through the YouTube player when provided for the video. A transcript will be provided by Secret Sharz where we have published one.</p>
            <a href={selected.watchUrl} target="_blank" rel="noopener noreferrer" className="ss-video-watch-link">Open this video on YouTube ↗</a>
          </section>
        </div>
      ) : null}

      <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />

      <style jsx>{`
        .ss-video-page{min-height:100vh;background:#FDFCFA;color:#1E2820}
        .ss-video-container{width:min(1180px,calc(100% - 40px));margin:0 auto}
        .ss-video-hero{padding:92px 0 76px;background:linear-gradient(135deg,#F7F3ED 0%,#FDFCFA 62%,#EBF4EE 100%)}
        .ss-video-eyebrow{margin:0 0 12px;color:#4A7C59;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
        .ss-video-hero h1{max-width:820px;margin:0;font-family:Fraunces,serif;font-size:clamp(40px,6vw,68px);line-height:1.05;letter-spacing:-1.5px}.ss-video-hero h1 em{color:#4A7C59;font-weight:600}
        .ss-video-lead{max-width:720px;margin:24px 0;color:#3D4A40;font-size:18px;line-height:1.7}.ss-video-channel-link,.ss-video-watch-link{color:#24583a;font-weight:800;text-decoration:underline;text-underline-offset:3px}
        .ss-video-library{padding:72px 0}.ss-video-heading-row{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:28px}.ss-video-heading-row h2{margin:0;font-family:Fraunces,serif;font-size:40px}.ss-video-source{color:#66736b;font-size:13px}
        .ss-video-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.ss-video-card{background:#fff;border:1px solid #DCE3DE;border-radius:18px;overflow:hidden;box-shadow:0 4px 16px rgba(30,40,32,.05)}
        .ss-video-thumbnail{display:block;position:relative;width:100%;aspect-ratio:16/9;border:0;padding:0;background:#EAF0EB;cursor:pointer;overflow:hidden}.ss-video-thumbnail img{width:100%;height:100%;display:block;object-fit:cover}.ss-video-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:#2E6B4A;color:#fff;display:grid;place-items:center;font-size:20px;padding-left:3px;box-shadow:0 10px 30px rgba(0,0,0,.2)}
        .ss-video-card-body{padding:18px}.ss-video-card h3{margin:0 0 8px;font-size:17px;line-height:1.35}.ss-video-meta{margin:0 0 10px;color:#66736b;font-size:12px;font-weight:700}.ss-video-description{margin:0 0 14px;color:#56635b;font-size:13px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .ss-video-load-more{text-align:center;margin-top:34px}.ss-video-load-more button,.ss-video-state button{min-height:48px;border:0;border-radius:12px;padding:12px 20px;background:#2E6B4A;color:#fff;font-weight:800;cursor:pointer}.ss-video-load-more button:disabled{opacity:.6;cursor:wait}
        .ss-video-state{padding:40px;background:#F7F3ED;border:1px solid #DCE3DE;border-radius:18px;color:#3D4A40}.ss-video-state strong{display:block;margin-bottom:6px}.ss-video-error p{margin:0 0 16px}
        .ss-video-dialog-backdrop{position:fixed;inset:0;z-index:5000;background:rgba(10,20,15,.72);display:grid;place-items:center;padding:24px}.ss-video-dialog{width:min(980px,100%);max-height:92vh;overflow:auto;background:#FDFCFA;border-radius:20px;padding:18px;box-shadow:0 30px 100px rgba(0,0,0,.35)}.ss-video-dialog-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.ss-video-dialog-heading h2{margin:0;font-family:Fraunces,serif;font-size:24px}.ss-video-dialog-heading button{width:44px;height:44px;border:1px solid #CBD5CE;border-radius:10px;background:#fff;font-size:24px;cursor:pointer}.ss-video-player{aspect-ratio:16/9;background:#111;border-radius:12px;overflow:hidden}.ss-video-player iframe{width:100%;height:100%;border:0;display:block}.ss-video-dialog-note{margin:14px 0;color:#56635b;font-size:13px;line-height:1.55}
        :where(.ss-video-thumbnail,.ss-video-load-more button,.ss-video-state button,.ss-video-dialog-heading button,.ss-video-watch-link,.ss-video-channel-link):focus-visible{outline:3px solid #1F6B46;outline-offset:3px}
        @media(max-width:900px){.ss-video-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ss-video-hero{padding:72px 0 56px}}
        @media(max-width:620px){.ss-video-container{width:min(100% - 28px,1180px)}.ss-video-grid{grid-template-columns:1fr}.ss-video-heading-row{align-items:start;flex-direction:column}.ss-video-heading-row h2{font-size:32px}.ss-video-dialog-backdrop{padding:10px}.ss-video-dialog{padding:12px}}
        @media(prefers-reduced-motion:reduce){.ss-video-play{transform:translate(-50%,-50%)}}
      `}</style>
    </>
  );
}
