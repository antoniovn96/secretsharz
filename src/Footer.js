import React from 'react';

export default function Footer({ navigate }) {
  const go = (path) => navigate?.(path);
  const social = [
    { name: 'YouTube', url: 'https://www.youtube.com/@secretsharz8427', mark: '▶' },
    { name: 'Instagram', url: 'https://www.instagram.com/secret.sharz/', mark: '◎' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/secret-sharz', mark: 'in' },
    { name: 'Facebook', url: 'https://www.facebook.com/secret.sharz', mark: 'f' },
    { name: 'X', url: 'https://x.com/', mark: '𝕏' },
  ];
  const link = (label, path) => <button type="button" className="ss-footer-link" onClick={() => go(path)}>{label}</button>;

  return (
    <footer className="ss-site-footer">
      <div className="ssf-inner">
        <div className="ssf-brand">
          <button type="button" className="ssf-logo-button" onClick={() => go('/')} aria-label="Secret Sharz home">
            <img src="/secret-sharz-logo.png" alt="Secret Sharz" />
          </button>
          <p>A global platform for emotional wellbeing, learning support and career guidance.</p>
          <div className="ssf-socials" aria-label="Secret Sharz social media">
            {social.map((item) => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={\`Secret Sharz on \${item.name}\`}>{item.mark}</a>)}
          </div>
        </div>
        <div className="ssf-column">
          <h2>Our Programmes</h2>
          {link('Sharz Spark', '/sharz-spark')}
          <span>Learning &amp; Inclusion</span>
          {link('Sharz Balance', '/sharz-balance')}
          <span>Mental Health &amp; Wellbeing</span>
          {link('Sharz Compass', '/sharz-compass')}
          <span>Career Guidance &amp; Discovery</span>
        </div>
        <div className="ssf-column">
          <h2>Quick Links</h2>
          {link('About Us', '/about')}
          {link('How It Works', '/about')}
          {link('Resources', '/support')}
          {link('For Schools', '/support')}
          {link('For Professionals', '/support')}
          {link('Contact', '/support')}
        </div>
        <div className="ssf-column">
          <h2>Help &amp; Legal</h2>
          {link('Privacy Policy', '/privacy')}
          {link('Safeguarding', '/support')}
          {link('Accessibility', '/accessibility')}
          {link('Terms of Use', '/terms')}
          {link('Cookie Policy', '/privacy')}
          {link('Site Map', '/')}
        </div>
        <div className="ssf-motto">
          <span className="ssf-motto-leaf" aria-hidden="true">❧</span>
          <p>A brighter tomorrow<br />for every journey.</p>
          <span className="ssf-motto-line" aria-hidden="true" />
        </div>
      </div>
      <div className="ssf-bottom">
        <span>© {new Date().getFullYear()} Secret Sharz. All rights reserved.</span>
        <span>People • Potential • Brighter Tomorrows</span>
      </div>
      <style>{\`
        .ss-site-footer{background:#fffefa;color:#244541;border-top:1px solid #e8ebe2;padding:28px clamp(20px,4.2vw,64px) 14px;font-family:Arial,Helvetica,sans-serif}
        .ss-site-footer *{box-sizing:border-box}.ssf-inner{max-width:1420px;margin:0 auto;display:grid;grid-template-columns:1.55fr 1fr .88fr .98fr 1.05fr;gap:clamp(18px,2.6vw,38px);align-items:start}
        .ssf-brand{min-width:0}.ssf-logo-button{display:inline-flex;padding:0;border:0;background:none;cursor:pointer}.ssf-logo-button img{display:block;max-width:180px;width:100%;height:auto;max-height:44px;object-fit:contain;object-position:left center}
        .ssf-brand>p{max-width:260px;color:#566763;font-size:11px;line-height:1.6;margin:11px 0 15px}
        .ssf-socials{display:flex;gap:9px;align-items:center}.ssf-socials a{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;text-decoration:none;background:#f0f4ee;color:#14514a;font-size:13px;font-weight:800}.ssf-socials a:first-child{background:#fae8e4;color:#c7362e}
        .ssf-column{display:flex;flex-direction:column;align-items:flex-start;gap:6px;min-width:0}.ssf-column h2{font-size:11px;font-weight:800;margin:5px 0 7px;color:#204843}.ss-footer-link{border:0;background:none;padding:0;text-align:left;color:#526662;font-size:10px;line-height:1.35;cursor:pointer}.ss-footer-link:hover{color:#0b6156;text-decoration:underline}.ssf-column>span{font-size:9px;color:#6b7a74;line-height:1.2;margin-top:-5px;margin-bottom:2px}
        .ssf-motto{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:118px;border-left:1px solid #dbe3db;padding-left:12px}.ssf-motto-leaf{font-size:30px;color:#3b806d;line-height:1}.ssf-motto p{font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;line-height:1.35;color:#386b61;margin:5px 0}.ssf-motto-line{width:85px;height:2px;border-radius:100%;background:#386b61;transform:rotate(-7deg);margin-top:4px}
        .ssf-bottom{max-width:1420px;margin:22px auto 0;padding-top:11px;border-top:1px solid #edf0e8;display:flex;justify-content:space-between;gap:12px;color:#8a9790;font-size:9px}
        @media(max-width:980px){.ssf-inner{grid-template-columns:repeat(3,minmax(0,1fr))}.ssf-brand{grid-column:span 2}.ssf-motto{border-left:0;border-top:1px solid #dbe3db;padding:18px 0 0;min-height:0}}
        @media(max-width:560px){.ss-site-footer{padding:26px 20px 14px}.ssf-inner{grid-template-columns:repeat(2,minmax(0,1fr));gap:23px 18px}.ssf-brand{grid-column:1 / -1}.ssf-motto{grid-column:1 / -1;border-top:1px solid #dbe3db}.ssf-bottom{flex-direction:column}.ssf-logo-button img{max-width:165px}}
      \`}</style>
    </footer>
  );
}
