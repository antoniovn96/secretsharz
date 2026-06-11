const fs = require('fs');

function refactor() {
  let fileContent = fs.readFileSync('src/AdminDashboard.js', 'utf8');

  // Step 1: Add user-db to ALL_NAV_TABS
  const searchNav = "{ id: 'settings', icon: '⚙️', label: 'System Settings', roles: ['super_admin'] },";
  const replaceNav = "{ id: 'settings', icon: '⚙️', label: 'System Settings', roles: ['super_admin'] },\n  { id: 'user-db', icon: '🔐', label: 'User Management', roles: ['super_admin'] },";
  fileContent = fileContent.replace(searchNav, replaceNav);

  // Step 2: Extract user-db content
  const startMarker = '{/* Onboard New Counsellor Card */}';
  const endMarker = '</div>{/* end admin-root for user-db */}';
  const startIdx = fileContent.indexOf(startMarker);
  const endIdx = fileContent.indexOf(endMarker);
  
  if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find user-db content');
    return;
  }
  
  let userDbContent = fileContent.substring(startIdx, endIdx);
  
  // Strip the last 3 closing divs from userDbContent
  // which belonged to:
  //                     <div className="main-content">
  //                   <div className="admin-main">
  //                 <div className="admin-root" style={{ height: 'auto', minHeight: 'unset' }}>
  //
  // They usually look like:
  //                       </div>
  //                     </div>
  //                   </div>
  // Let's just find the last index of "</div>" three times and slice there.
  let cleanUserDbContent = userDbContent;
  for (let i = 0; i < 3; i++) {
    const lastDiv = cleanUserDbContent.lastIndexOf('</div>');
    if (lastDiv !== -1) {
      cleanUserDbContent = cleanUserDbContent.substring(0, lastDiv);
    }
  }
  
  // Step 3: Insert into renderTabContent
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
            ${cleanUserDbContent.trim()}
          </div>
        );

      default:`;
  fileContent = fileContent.replace('      default:', caseStr);

  // Step 4: Remove Outer Wrappers
  const topWrapperRegex = /  return \([\s\S]*?<div className="admin-root" style=\{\{ height: 'auto', minHeight: 'unset' \}\}>/;
  fileContent = fileContent.replace(topWrapperRegex, '  return (\n    <div className="admin-root">');

  // Step 5: Remove the remaining layout wrappers
  const bottomWrapperRegex = /                <\/div>\{\/\* end admin-root \*\/\}[\s\S]*?\{\/\* ── TOAST NOTIFICATIONS ── \*\/\}/;
  fileContent = fileContent.replace(bottomWrapperRegex, '        {/* ── TOAST NOTIFICATIONS ── */}');

  // Step 6: Fix final closing tags
  const endRegex = /        \)\}\n        <\/main>\n      <\/div>\n    <\/div>\n  \);\n\}/;
  fileContent = fileContent.replace(endRegex, '        )}\n    </div>\n  );\n}');

  const endRegexCRLF = /        \)\}\r\n        <\/main>\r\n      <\/div>\r\n    <\/div>\r\n  \);\r\n\}/;
  fileContent = fileContent.replace(endRegexCRLF, '        )}\r\n    </div>\r\n  );\r\n}');

  fs.writeFileSync('src/AdminDashboard.js', fileContent);
  console.log('Refactor complete!');
}

refactor();