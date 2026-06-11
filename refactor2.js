const fs = require('fs');
let c = fs.readFileSync('src/AdminDashboard.js', 'utf8');

const returnRegex = /  return \(\r?\n    <div className="social-dark-theme">[\s\S]*?<div className="admin-root" style=\{\{ height: 'auto', minHeight: 'unset' \}\}>/;
if (returnRegex.test(c)) {
  c = c.replace(returnRegex, '  return (\n    <div className="admin-root">');
  console.log('Fixed wrapper top via regex');
} else {
  console.log('Regex did not match');
}

fs.writeFileSync('src/AdminDashboard.js', c);
