const fs = require('fs');
let content = fs.readFileSync('src/AdminDashboard.js', 'utf8');

// Remove STYLES string
content = content.replace(/const STYLES = `[\s\S]*?`;/, '');

// Remove style appending useEffect
content = content.replace(/useEffect\(\(\) => \{\s*const styleEl = document\.createElement\('style'\);\s*styleEl\.innerHTML = STYLES;[\s\S]*?\}, \[\]\);/, '');

// Add imports
if (!content.includes('lucide-react')) {
  content = `import { Menu, Search, Bell, Home, Users, Briefcase, Shield, X, Check, Eye } from "lucide-react";\nimport { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";\n` + content;
}

// Master layout shell
// Find the return statement of AdminDashboard
// The component is function AdminDashboard({ user, onBackToApp, navigate })
// We'll replace the main return.
const returnRegex = /return \(\s*<div className="admin-root">([\s\S]*?)<\/div>\s*\);\s*\}/;

const newReturn = `return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans">
      {/* Sidebar */}
      <div className={\`fixed left-0 top-0 bottom-0 bg-[#1A1F36] text-white flex flex-col transition-all duration-300 z-50 \${sidebarOpen ? 'w-64' : 'w-20'}\`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-center cursor-pointer" onClick={() => onBackToApp && onBackToApp()}>
          <Shield className="w-8 h-8 text-blue-500" />
          {sidebarOpen && <h2 className="ml-3 text-xl font-bold tracking-tight">Admin</h2>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {allowedTabs.includes('overview') && (
            <button onClick={() => setActiveTab('overview')} className={\`flex items-center px-4 py-3 rounded-xl transition-all \${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}>
              <Home className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">Overview</span>}
            </button>
          )}
          {allowedTabs.includes('students') && (
            <button onClick={() => setActiveTab('students')} className={\`flex items-center px-4 py-3 rounded-xl transition-all \${activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}>
              <Users className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">Students</span>}
            </button>
          )}
          {allowedTabs.includes('counsellors') && (
            <button onClick={() => setActiveTab('counsellors')} className={\`flex items-center px-4 py-3 rounded-xl transition-all \${activeTab === 'counsellors' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}>
              <Briefcase className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">Counsellors</span>}
            </button>
          )}
          {allowedTabs.includes('institutions') && (
            <button onClick={() => setActiveTab('institutions')} className={\`flex items-center px-4 py-3 rounded-xl transition-all \${activeTab === 'institutions' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}>
              <Shield className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">Institutions</span>}
            </button>
          )}
          {allowedTabs.includes('settings') && (
            <button onClick={() => setActiveTab('settings')} className={\`flex items-center px-4 py-3 rounded-xl transition-all \${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}>
              <Shield className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
            </button>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <X className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3 font-medium">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={\`flex-1 flex flex-col transition-all duration-300 \${sidebarOpen ? 'ml-64' : 'ml-20'}\`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search anything..." className="w-64 h-10 pl-10 pr-4 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-600 font-bold shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderTabContent()}
        </main>
      </div>
      
      {/* Modals... keeping existing renderSelectedStudentModal() etc if they are outside but let's just render what was there */}
      {selectedStudent && renderSelectedStudentModal()}
      {toast && (
        <div className={\`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 \${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'} z-50 animate-slide-up\`}>
          <div className="font-medium">{toast.message}</div>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(returnRegex, newReturn);

// Also need to add sidebarOpen state to AdminDashboard if it doesn't exist
if (!content.includes('const [sidebarOpen, setSidebarOpen] = useState(true);')) {
  content = content.replace(/export default function AdminDashboard\(\{ user, onBackToApp, navigate \}\) \{/, 'export default function AdminDashboard({ user, onBackToApp, navigate }) {\n  const [sidebarOpen, setSidebarOpen] = useState(true);');
}

// Modify renderTabContent 'overview' tab:
const overviewRegex = /case 'overview':\s*return \([\s\S]*?(?=case 'students':)/;
const overviewNew = `case 'overview':
      const pieData = [
        { name: 'Pending', value: funnelCounts.pending, color: '#F59E0B' },
        { name: 'In Progress', value: funnelCounts.inProgress, color: '#3B82F6' },
        { name: 'Completed', value: funnelCounts.completed, color: '#10B981' }
      ];
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening today.</p>
          </div>
          
          {/* Top Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Action Queue</span>
              <div className="text-4xl font-bold text-gray-900 mb-1">{pendingCount}</div>
              <span className="text-sm text-yellow-500 font-medium bg-yellow-50 px-2 py-1 rounded-md self-start mt-auto">Pending Assignments</span>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Counsellor Team</span>
              <div className="text-4xl font-bold text-gray-900 mb-1">{counsellorsList.length}</div>
              <span className="text-sm text-blue-500 font-medium bg-blue-50 px-2 py-1 rounded-md self-start mt-auto">Active Staff</span>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Institutions</span>
              <div className="text-4xl font-bold text-gray-900 mb-1">{institutionsCount}</div>
              <span className="text-sm text-green-500 font-medium bg-green-50 px-2 py-1 rounded-md self-start mt-auto">Partner Schools</span>
            </div>
          </div>
          
          {/* Bottom Row: Donut Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6 h-96">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Counselling Funnel</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    `;

content = content.replace(overviewRegex, overviewNew);

// Modify renderTabContent 'students' tab:
// Update Student Master Directory table to use Tailwind
const studentsRegex = /case 'students':\s*return \([\s\S]*?(?=case 'counsellors':)/;
let studentsStr = content.match(studentsRegex);
if(studentsStr) {
  let newStudents = studentsStr[0]
    .replace(/<div className="admin-card">/, '<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">')
    .replace(/<table className="data-table">/, '<table className="w-full text-left border-collapse min-w-[800px]">')
    .replace(/<thead>\s*<tr>\s*<th>(.*?)<\/th>[\s\S]*?<\/tr>\s*<\/thead>/, `
      <thead className="bg-gray-50/50">
        <tr>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Portal</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assign Counsellor</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
        </tr>
      </thead>`)
    .replace(/<tbody.*?>/, '<tbody className="divide-y divide-gray-100">')
    .replace(/<tr key=\{student\.id\} className="clickable" onClick=\{.*?\}\s*>/g, '<tr key={student.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">')
    .replace(/<td.*?>/g, '<td className="px-6 py-4 whitespace-nowrap">');
    
  content = content.replace(studentsRegex, newStudents);
}

// Modify selectedStudent modal
const modalRegex = /const renderSelectedStudentModal = \(\) => \{[\s\S]*?return \([\s\S]*?(?=;\s*\};)/;
let modalStr = content.match(modalRegex);
if(modalStr) {
  let newModal = modalStr[0]
    .replace(/<div className="modal-overlay" onClick=\{closeSelectedStudentModal\}>/, '<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeSelectedStudentModal}>')
    .replace(/<div className="modal-content" onClick=\{e => e\.stopPropagation\(\)\}>/, '<div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>')
    .replace(/<div className="modal-header">/, '<div className="p-6 border-b border-gray-100 bg-gray-50/50 relative">')
    .replace(/<button className="close-btn" onClick=\{closeSelectedStudentModal\}>.*?<\/button>/, '<button className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" onClick={closeSelectedStudentModal}><X className="w-5 h-5"/></button>')
    .replace(/<div className="modal-body">/, '<div className="p-6 overflow-y-auto flex-1">');
    
  content = content.replace(modalRegex, newModal);
}

fs.writeFileSync('src/AdminDashboard.js', content);
