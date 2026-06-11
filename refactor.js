const fs = require('fs');
let fileContent = fs.readFileSync('src/AdminDashboard.js', 'utf8');

// 1. ALL_NAV_TABS
fileContent = fileContent.replace(
  "{ id: 'settings', icon: '⚙️', label: 'System Settings', roles: ['super_admin'] },",
  "{ id: 'settings', icon: '⚙️', label: 'System Settings', roles: ['super_admin'] },\n  { id: 'user-db', icon: '🔐', label: 'User Management', roles: ['super_admin'] },"
);

// 2. Extract User Management Content
const startMarker = '{/* Onboard New Counsellor Card */}';
const endMarker = '</div>{/* end admin-root for user-db */}';
const startIdx = fileContent.indexOf(startMarker);
const endIdx = fileContent.indexOf(endMarker);
const userDbContent = fileContent.slice(startIdx, endIdx).trim();

// 3. Inject User Management into renderTabContent
const caseStr = `
      case 'user-db':
        return (
          <div>
            <div className="header-bar">
              <div>
                <h1>User Management</h1>
                <p>Manage users, roles, and onboard new staff.</p>
              </div>
            </div>
            ${userDbContent}
          </div>
        );

      default:`;

fileContent = fileContent.replace('      default:', caseStr);

// 4. Clean up outer wrappers in the return statement
const mainReturnStart = `  return (
    <div className="social-dark-theme">
      <nav className="top-global-nav">
        <h2>VidyaVantage (Admin Server)</h2>
        <ul className="top-global-nav-links">
          <li>🎛️ Dashboard</li>
          <li>⚙️ System Health</li>
          <li>🚪 Sign Out</li>
          <li style={{ cursor: 'pointer', color: '#2D88FF' }} onClick={() => window.location.href = '/'})>🌐 Main Website</li>
        </ul>
      </nav>
      <div className="social-dashboard-layout" style={{ paddingTop: '60px' }}>
        <main className="social-main-content">

        {/* ── ADMIN HERO HEADER ── */}
        <div className="profile-hero-container">
          <div className="profile-cover-photo">
            <div className="profile-avatar-wrapper">
              <span className="profile-avatar-fallback">
                A
              </span>
            </div>
          </div>
          <div className="profile-identity-row">
            <div className="profile-name-section">
              <h1>Admin Command Center</h1>
              <div className="profile-bio">
                System management and platform analytics.
              </div>
              <div className="profile-pinned-details">
                <span>📍 Secret Sharz Server</span>
                <span>🔐 Super Admin</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn-primary-social">📊 View Analytics</button>
            </div>
          </div>
        </div>

        {/* ── NESTED ADMIN CONTROLS ── */}
        <div className="about-container">
          <div className="about-sidebar">
            <h3>Admin Controls</h3>
            <div className={\`about-nav-item \${activeAdminTab === 'command-center' ? 'active' : ''}\`} onClick={() => setActiveAdminTab('command-center')}>Command Center</div>
            <div className={\`about-nav-item \${activeAdminTab === 'user-db' ? 'active' : ''}\`} onClick={() => setActiveAdminTab('user-db')}>User Database</div>
          </div>

          <div className="about-content">
            {activeAdminTab === 'command-center' && (
              <div>
                <div className="about-content-header">System Overview</div>

                {/* ── EXISTING ADMIN DASHBOARD (admin-root wrapper) ── */}
                <div className="admin-root" style={{ height: 'auto', minHeight: 'unset' }}>`;

const mainReturnReplacement = `  return (
    <div className="admin-root">`;
// Use a robust regex or indexOf for replacing the start wrapper
const returnIdx1 = fileContent.indexOf('  return (\n    <div className="social-dark-theme">');
const returnIdx2 = fileContent.indexOf('                <div className="admin-root" style={{ height: \'auto\', minHeight: \'unset\' }}>');
if (returnIdx1 !== -1 && returnIdx2 !== -1) {
  const substrToReplace = fileContent.substring(returnIdx1, returnIdx2 + '                <div className="admin-root" style={{ height: \'auto\', minHeight: \'unset\' }}>'.length);
  fileContent = fileContent.replace(substrToReplace, mainReturnReplacement);
}

// 5. Remove the old user-db tab and closing tags
const oldUserDbStartIdx = fileContent.indexOf('                </div>{/* end admin-root */}\n              </div>\n            )}\n\n            {activeAdminTab === \'user-db\' && (');
const toastIdx = fileContent.indexOf('        {/* ── TOAST NOTIFICATIONS ── */}');

if (oldUserDbStartIdx !== -1 && toastIdx !== -1) {
  fileContent = fileContent.substring(0, oldUserDbStartIdx) + fileContent.substring(toastIdx);
}

// 6. At the very end:
const veryEndIdx1 = fileContent.lastIndexOf('        </main>\n      </div>\n    </div>\n  );\n}');
if (veryEndIdx1 !== -1) {
  fileContent = fileContent.substring(0, veryEndIdx1) + '    </div>\n  );\n}';
}

fs.writeFileSync('src/AdminDashboard.js', fileContent);
console.log('Done!');
