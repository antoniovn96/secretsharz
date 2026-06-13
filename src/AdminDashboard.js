import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, Search, Bell, Home, Users, Briefcase, Shield, Settings, Moon, Sun, ChevronDown, CheckCircle, Clock, AlertCircle, X, Check, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { useDashboard } from './context/DashboardContext';

const COLLECTIONS = {
  USERS: 'users',
  INSTITUTIONS: 'institutions',
  SETTINGS: 'system_settings',
  STAFF: 'staff'
};



// ─────────────────────────────────────────────────────────────────────────────
// INSTITUTIONS TAB — Self-contained component to avoid closure issues
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_INST_FORM = {
  schoolName: '', officialEmail: '', phone: '', address: '',
  maxEducationLevel: '', totalStaff: '', totalStudents: '',
  contact1Name: '', contact1Phone: '',
  contact2Name: '', contact2Phone: '',
  contact3Name: '', contact3Phone: '',
  counsellorName: '', counsellorPhone: '', counsellorEmail: '',
};

function InstitutionsTab({ ctxInstitutions, registerInstitution, setToast }) {
  const [form, setForm] = useState(EMPTY_INST_FORM);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.schoolName.trim()) {
      setToast({ type: 'error', message: 'School Name is required.' });
      return;
    }
    if (!form.totalStudents || isNaN(Number(form.totalStudents))) {
      setToast({ type: 'error', message: 'Total Students must be a valid number.' });
      return;
    }
    setSubmitting(true);
    try {
      registerInstitution(form);
      setForm(EMPTY_INST_FORM);
      setToast({ type: 'success', message: '🏫 Institution registered successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to register institution.' });
    } finally {
      setSubmitting(false);
    }
  };

  const allInstitutions = Array.isArray(ctxInstitutions) ? ctxInstitutions : [];

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1>Institution Control</h1>
          <p>Register B2B partner schools and manage their billing accounts.</p>
        </div>
        <span className="admin-badge badge-primary" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
          {allInstitutions.length} Registered
        </span>
      </div>

      {/* ── REGISTRATION FORM ── */}
      <div className="admin-card" style={{ borderTop: '3px solid var(--primary)' }}>
        <h3>🏫 Register New Institution</h3>
        <form onSubmit={handleSubmit}>
          {/* Row 1: School Name + Email */}
          <div className="grid-2col">
            <div className="form-group">
              <label className="form-label">School Name *</label>
              <input className="form-input" type="text" placeholder="e.g. Delhi Public School, R.K. Puram" value={form.schoolName} onChange={e => set('schoolName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Official Email *</label>
              <input className="form-input" type="email" placeholder="principal@school.edu.in" value={form.officialEmail} onChange={e => set('officialEmail', e.target.value)} />
            </div>
          </div>

          {/* Row 2: Phone + Max Education Level */}
          <div className="grid-2col">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="text" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Education Level</label>
              <select className="form-select" value={form.maxEducationLevel} onChange={e => set('maxEducationLevel', e.target.value)}>
                <option value="">— Select Level —</option>
                <option value="4th">Up to 4th Grade</option>
                <option value="5th">Up to 5th Grade</option>
                <option value="10th">Up to 10th Grade</option>
                <option value="12th">Up to 12th Grade</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Full Address</label>
            <textarea className="form-textarea" rows="2" placeholder="Street, City, State, PIN" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>

          {/* Row 3: Staff + Students */}
          <div className="grid-2col">
            <div className="form-group">
              <label className="form-label">Total Staff</label>
              <input className="form-input" type="number" min="0" placeholder="e.g. 80" value={form.totalStaff} onChange={e => set('totalStaff', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Students *</label>
              <input className="form-input" type="number" min="0" placeholder="e.g. 1200" value={form.totalStudents} onChange={e => set('totalStudents', e.target.value)} />
            </div>
          </div>

          {/* Billing Preview */}
          {form.totalStudents && !isNaN(Number(form.totalStudents)) && Number(form.totalStudents) > 0 && (
            <div style={{ background: 'rgba(91,110,245,0.06)', border: '1px solid rgba(91,110,245,0.2)', borderRadius: 'var(--r-sm)', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Estimated Total Bill (₹200 × {Number(form.totalStudents)} students)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>₹{(Number(form.totalStudents) * 200).toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Contact Persons */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Contact Persons (up to 3)</div>
            {[1, 2, 3].map(n => (
              <div key={n} className="grid-2col" style={{ marginBottom: '8px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact {n} Name</label>
                  <input className="form-input" type="text" placeholder={`Contact Person ${n}`} value={form[`contact${n}Name`]} onChange={e => set(`contact${n}Name`, e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact {n} Phone</label>
                  <input className="form-input" type="text" placeholder="+91..." value={form[`contact${n}Phone`]} onChange={e => set(`contact${n}Phone`, e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* School Counsellor */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>School Counsellor Details</div>
            <div className="grid-2col">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Counsellor Name</label>
                <input className="form-input" type="text" placeholder="Full Name" value={form.counsellorName} onChange={e => set('counsellorName', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Counsellor Phone</label>
                <input className="form-input" type="text" placeholder="+91..." value={form.counsellorPhone} onChange={e => set('counsellorPhone', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
              <label className="form-label">Counsellor Email</label>
              <input className="form-input" type="email" placeholder="counsellor@school.edu.in" value={form.counsellorEmail} onChange={e => set('counsellorEmail', e.target.value)} />
            </div>
          </div>

          <button type="submit" className="admin-btn" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? '⏳ Registering...' : '🏫 Register Institution'}
          </button>
        </form>
      </div>

      {/* ── REGISTERED INSTITUTIONS TABLE ── */}
      <div className="admin-card" style={{ borderTop: '3px solid var(--success)' }}>
        <h3>
          📋 Registered Institutions
          <span className="admin-badge badge-success">{allInstitutions.length} Total</span>
        </h3>
        {allInstitutions.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px' }}>
            <div className="empty-icon">🏫</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>No institutions registered yet. Use the form above to add your first partner school.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Account No.</th>
                  <th>🔑 Password</th>
                  <th>Level</th>
                  <th>Students</th>
                  <th>Total Bill</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {allInstitutions.map((inst) => {
                  const billStr = typeof inst.totalBill === 'number'
                    ? '₹' + inst.totalBill.toLocaleString('en-IN')
                    : '—';
                  const regDate = inst.registeredAt
                    ? new Date(inst.registeredAt).toLocaleDateString('en-GB')
                    : '—';
                  return (
                    <tr key={String(inst.id)}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>{String(inst.schoolName || '—')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{String(inst.officialEmail || '—')}</div>
                        {inst.phone ? <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{String(inst.phone)}</div> : null}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)', fontSize: '0.85rem', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: '6px' }}>
                          {String(inst.accountNumber || '—')}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(239,68,68,0.08)', padding: '3px 8px', borderRadius: '6px', letterSpacing: '1px' }}>
                          {String(inst.password || '—')}
                        </span>
                      </td>
                      <td>
                        <span className="admin-badge badge-neutral">{String(inst.maxEducationLevel || '—')}</span>
                      </td>
                      <td style={{ fontWeight: '700', color: 'var(--text-main)', textAlign: 'center' }}>
                        {String(inst.totalStudents || 0)}
                      </td>
                      <td>
                        <span style={{ fontWeight: '800', color: 'var(--success)', fontSize: '1rem' }}>{billStr}</span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>₹200 × {String(inst.totalStudents || 0)}</div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{regDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const SkillRadarChart = ({ skills }) => {
  if (!skills) return null;
  const max = 100; const size = 240; const center = size / 2; const radius = size / 2 - 30;
  const categories = ['communication', 'resilience', 'criticalThinking', 'empathy', 'leadership'];
  const labels = ['Communication', 'Resilience', 'Critical Thinking', 'Empathy', 'Leadership'];
  const angleStep = (Math.PI * 2) / categories.length;
  const getPoint = (value, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (value / max) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };
  const points = categories.map((cat, i) => getPoint(skills[cat] || 0, i)).join(' ');
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {[20, 40, 60, 80, 100].map(level => (
        <polygon key={level} points={categories.map((_, i) => getPoint(level, i)).join(' ')} fill="none" stroke="rgba(255,255,255,0.05)" />
      ))}
      {categories.map((cat, i) => {
        const end = getPoint(100, i);
        const labelPoint = getPoint(120, i);
        return (
          <g key={cat}>
            <line x1={center} y1={center} x2={end.split(',')[0]} y2={end.split(',')[1]} stroke="rgba(255,255,255,0.1)" />
            <text x={labelPoint.split(',')[0]} y={labelPoint.split(',')[1]} fill="var(--text-muted)" fontSize="10" textAnchor="middle" alignmentBaseline="middle">{labels[i]}</text>
          </g>
        );
      })}
      <polygon points={points} fill="rgba(91,110,245,0.3)" stroke="var(--primary)" strokeWidth="2" />
      {categories.map((cat, i) => {
        const pt = getPoint(skills[cat] || 0, i);
        return <circle key={`c-${cat}`} cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="4" fill="var(--primary)" />;
      })}
    </svg>
  );
};

const ALL_NAV_TABS = [
  { id: 'profile', icon: '👤', label: 'My Profile', roles: ['super_admin', 'counsellor'] },
  { id: 'overview', icon: '🏠', label: 'Overview', roles: ['super_admin', 'counsellor'] },
  { id: 'students', icon: '🎓', label: 'Student Master', roles: ['super_admin', 'counsellor'] },
  { id: 'counselling', icon: '🧠', label: 'Counselling Workflow', roles: ['super_admin', 'counsellor'] },
  { id: 'analytics', icon: '📊', label: 'Analytics & Funnel', roles: ['super_admin'] },
  { id: 'institutions', icon: '🏫', label: 'Institution Control', roles: ['super_admin'] },
  { id: 'settings', icon: '⚙️', label: 'System Settings', roles: ['super_admin'] },
];

export default function AdminDashboard({ user, onBackToApp, navigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // ── Pull from DashboardContext ──────────────────────────────────────────────
  const {
    students: ctxStudents,
    counsellors: ctxCounsellors,
    assignments,
    assignStudentToCounsellor,
    reassignStudent,
    unassignStudent,
    getCounsellorForStudent,
    getStudentsForCounsellor,
    stats: ctxStats,
    institutions: ctxInstitutions,
    registerInstitution,
  } = useDashboard();

  // --- STATE ---
  const [institutionsCount, setInstitutionsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  const [activeTab, setActiveTab] = useState('overview');
  const [activeAdminTab, setActiveAdminTab] = useState('command-center');
  const [toast, setToast] = useState(null);

  // Firestore live data (supplements context for real users)
  const [institutions, setInstitutions] = useState([]);
  const [firestoreStudents, setFirestoreStudents] = useState([]);
  const [firestoreStaff, setFirestoreStaff] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile & RBAC
  const [profile, setProfile] = useState({ name: user?.displayName || 'Admin', role: 'super_admin' });
  const isCounsellor = profile.role === 'counsellor';
  const allowedTabs = ALL_NAV_TABS.filter(t => t.roles.includes(profile.role));

  // My Profile State
  const [personalProfile, setPersonalProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    title: '',
    phone: '',
    linkedin: '',
    bio: '',
    experience: [],
    education: [],
    hobbies: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Search & Filter
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [trackFilter, setTrackFilter] = useState('All');
  const [eduFilter, setEduFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modals & Forms
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalTab, setModalTab] = useState('overview');
  const [newSession, setNewSession] = useState({ date: '', duration: '30', outcome: '' });

  // Inline assignment state: { [studentId]: counsellorId }
  const [pendingAssignments, setPendingAssignments] = useState({});

  // Counsellor Creation State
  const [newCounsellorEmail, setNewCounsellorEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedEmpId, setGeneratedEmpId] = useState('');

  // Helper function to generate mock credentials
  const handleGenerateCredentials = () => {
    const randomString = Math.random().toString(36).slice(-8);
    setGeneratedPassword(randomString);
    // Mock generation logic: SJU20000 + random 2 digits (assuming admin is 01)
    const randomId = Math.floor(Math.random() * 90) + 10;
    setGeneratedEmpId(`SJU20000${randomId}`);
  };

  // Dropdowns
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);

  // ── Merge context students with firestore students ──────────────────────────
  // Context students are the mock/prototype data; firestoreStudents are real.
  // We show firestoreStudents if available, else fall back to context students.
  const students = firestoreStudents.length > 0 ? firestoreStudents : ctxStudents;
  const counsellorsList = firestoreStaff.length > 0 ? firestoreStaff : ctxCounsellors;

  // --- FETCH REAL METRICS (Requested by Task) ---
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoadingMetrics(true);
      try {
        const instSnap = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS));
        setInstitutionsCount(instSnap.size);

        const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
        const usersDocs = usersSnap.docs.map(d => d.data());
        
        const assessed = usersDocs.filter(u => u.riasecCode);
        setStudentsCount(assessed.length);
        
        const pending = usersDocs.filter(u => !u.assignedCounsellorId && u.riasecCode);
        setPendingCount(pending.length);
        
        const completed = usersDocs.filter(u => u.counsellingStatus === 'Completed');
        if (usersDocs.length > 0) {
          setCompletionRate(Math.round((completed.length / usersDocs.length) * 100));
        }
      } catch (err) {
        console.error('Error fetching metrics', err);
      } finally {
        setIsLoadingMetrics(false);
      }
    };
    fetchCounts();
  }, []);

  // --- INITIALIZATION ---
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Keyboard shortcut: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- FETCH FIRESTORE DATA ---
  useEffect(() => {
    let isMounted = true;
    let unsubscribeStudents = null;

    const fetchPlatformData = async () => {
      if (!db || !auth?.currentUser) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'superadmin_profile'));
        if (isMounted && docSnap.exists()) setProfile(prev => ({ ...prev, ...docSnap.data() }));

        if (user?.uid) {
          const profileSnap = await getDoc(doc(db, COLLECTIONS.STAFF, user.uid));
          if (profileSnap.exists() && isMounted) {
            setPersonalProfile(prev => ({ ...prev, ...profileSnap.data() }));
          }
        }

        const staffSnap = await getDocs(collection(db, COLLECTIONS.STAFF));
        if (isMounted) {
          setFirestoreStaff(staffSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        const instSnap = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS));
        if (isMounted) setInstitutions(instSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        unsubscribeStudents = onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
          let allStudents = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

          if (isCounsellor) {
            allStudents = allStudents.filter(s => s.assignedCounsellorId === user?.uid);
          }

          const formatted = allStudents.map(s => ({
            ...s,
            counsellingStatus: s.counsellingStatus || 'Not Started',
            sessions: s.sessions || [],
            assignedCounsellorId: s.assignedCounsellorId || ''
          }));

          if (isMounted) setFirestoreStudents(formatted);

          setSelectedStudent(prevSelected => {
            if (!prevSelected) return null;
            const updated = formatted.find(stu => stu.id === prevSelected.id);
            return updated || prevSelected;
          });
        }, (error) => {
          console.error('Real-time listen error:', error);
          if (isMounted) setToast({ type: 'error', message: 'Live connection lost.' });
        });

      } catch (e) {
        console.error('Data fetch error', e);
        if (isMounted) setToast({ type: 'error', message: 'Failed to load platform data.' });
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    fetchPlatformData();
    return () => {
      isMounted = false;
      if (unsubscribeStudents) unsubscribeStudents();
    };
  }, [isCounsellor, user?.uid]);

  // --- ACTIONS ---
  const downloadStudentData = () => {
    if (!students || students.length === 0) return;
    const headers = ["Name,Email,Phone,Track,Mother Name,Mother Phone,Father Name,Father Phone,10th Marks,12th Marks\n"];
    const csvRows = students.map(s => {
      return `"${s.name || ''}","${s.email || ''}","${s.phone || ''}","${s.studentTrack || 'Unassigned'}","${s.motherName || ''}","${s.motherPhone || ''}","${s.fatherName || ''}","${s.fatherPhone || ''}","${s?.education?.tenth?.marksValue || ''}","${s?.education?.twelfth?.marksValue || ''}"`;
    });
    const csvString = headers + csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'SecretSharz_Students.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleUpdateStudent = async (studentId, updates) => {
    try {
      // Update Firestore if real data exists
      if (firestoreStudents.length > 0) {
        await updateDoc(doc(db, COLLECTIONS.USERS, studentId), updates);
      }
      setToast({ type: 'success', message: 'Student record updated.' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update record.' });
    }
  };

  /**
   * Handle counsellor assignment from the Student Roster card.
   * Uses DashboardContext for prototype data, Firestore for real data.
   */
  const handleAssignCounsellor = async (studentId, counsellorId) => {
    const student = students.find(s => s.id === studentId);
    const wasAssigned = student?.assignedCounsellorId;

    try {
      if (firestoreStudents.length > 0) {
        // Real Firestore path
        await updateDoc(doc(db, COLLECTIONS.USERS, studentId), {
          assignedCounsellorId: counsellorId || null,
          counsellingStatus: !counsellorId
            ? (student?.counsellingStatus || 'Not Started')
            : (student?.counsellingStatus === 'Not Started' ? 'In Progress' : student?.counsellingStatus)
        });
      } else {
        // Context (prototype) path
        if (!counsellorId) {
          unassignStudent(studentId);
        } else if (wasAssigned) {
          reassignStudent(studentId, counsellorId);
        } else {
          assignStudentToCounsellor(studentId, counsellorId);
        }
      }

      const counsellorName = counsellorsList.find(c => c.id === counsellorId)?.name || 'counsellor';
      setToast({
        type: 'success',
        message: counsellorId
          ? `${student?.name || 'Student'} assigned to ${counsellorName}.`
          : `${student?.name || 'Student'} unassigned.`
      });
    } catch (err) {
      console.error('Assignment error:', err);
      setToast({ type: 'error', message: 'Failed to update assignment.' });
    }
  };

  const handleAddSession = async () => {
    if (!newSession.date || !newSession.outcome) return setToast({ type: 'error', message: 'Fill date & outcome.' });
    const updatedSessions = [...(selectedStudent.sessions || []), { id: Date.now(), ...newSession }];
    await handleUpdateStudent(selectedStudent.id, {
      sessions: updatedSessions,
      counsellingStatus: selectedStudent.counsellingStatus === 'Not Started' ? 'In Progress' : selectedStudent.counsellingStatus
    });
    setNewSession({ date: '', duration: '30', outcome: '' });
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (error) { console.error('Logout failed', error); }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      if (user?.uid) {
        await setDoc(doc(db, COLLECTIONS.STAFF, user.uid), personalProfile, { merge: true });
        setToast({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setToast({ type: 'error', message: 'No user ID found. Cannot save.' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setToast({ type: 'error', message: 'Failed to save profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const addExperience = () => setPersonalProfile(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', duration: '' }] }));
  const removeExperience = (id) => setPersonalProfile(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  const updateExperience = (id, field, value) => setPersonalProfile(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));

  const addEducation = () => setPersonalProfile(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), degree: '', institution: '', year: '' }] }));
  const removeEducation = (id) => setPersonalProfile(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  const updateEducation = (id, field, value) => setPersonalProfile(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));

  // --- DERIVED METRICS ---
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch =
        (s.name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.counsellingStatus === statusFilter;
      const sTrack = typeof s.studentTrack === 'string' ? s.studentTrack : '';
      const matchesTrack =
        trackFilter === 'All' ||
        sTrack === trackFilter ||
        (trackFilter === 'Both' && sTrack === 'Both');
      
      // New Education Filter Logic
      const studentEdu = s?.education?.highestLevel || s?.gradeLevel || '';
      const matchesEdu = eduFilter === 'All' || studentEdu.includes(eduFilter);

      return matchesSearch && matchesStatus && matchesTrack && matchesEdu && s.riasecCode;
    });
  }, [students, debouncedSearch, statusFilter, trackFilter, eduFilter]);

  const pendingInterventions = students.filter(s => !s.assignedCounsellorId && s.riasecCode).length;
  const totalRegistered = students.length;
  const totalAssessed = students.filter(s => s.riasecCode).length;
  const totalCounselled = students.filter(s => s.counsellingStatus !== 'Not Started').length;
  const totalCompleted = students.filter(s => s.counsellingStatus === 'Completed').length;

  // Notifications
  const notifications = [
    pendingInterventions > 0 ? { id: 1, text: `${pendingInterventions} students need counsellor assignment.`, type: 'warning' } : null,
  ].filter(Boolean);

  // Helper: get assigned counsellor for a student (context-aware)
  const getAssignedCounsellor = (student) => {
    const id = student.assignedCounsellorId;
    if (!id) return null;
    return counsellorsList.find(c => c.id === id) || null;
  };

  // --- RENDERERS ---

  /** Premium Student Roster Card */
  const StudentRosterCard = ({ student }) => {
    const assignedCounsellor = getAssignedCounsellor(student);
    const [localValue, setLocalValue] = useState(student.assignedCounsellorId || '');

    // Sync if parent data changes
    useEffect(() => {
      setLocalValue(student.assignedCounsellorId || '');
    }, [student.assignedCounsellorId]);

    const handleChange = async (e) => {
      const newVal = e.target.value;
      setLocalValue(newVal);
      await handleAssignCounsellor(student.id, newVal);
    };

    const statusBadgeClass =
      student.counsellingStatus === 'Completed' ? 'badge-success' :
      student.counsellingStatus === 'In Progress' ? 'badge-warn' :
      'badge-danger';

    return (
      <div 
        className="student-roster-card"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          // Prevent opening modal if clicking the dropdown or buttons inside the card
          if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'OPTION') {
            setSelectedStudent(student); 
            setModalTab('overview');
          }
        }}
      >
        {/* Top: Avatar + Name + Email */}
        <div className="src-top">
          <div className="src-avatar" style={{ overflow: 'hidden', padding: student.profilePicture ? '0' : undefined }}>
            {student.profilePicture ? (
              <img src={student.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (student.name || '?').charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="src-info">
            <div className="src-name">{student.name || 'Unknown Student'}</div>
            <div className="src-email">{student.email || '—'}</div>
          </div>
          <button
            className="admin-btn-sm-outline"
            onClick={(e) => { 
              e.stopPropagation(); // Stops the double-click effect
              setSelectedStudent(student); 
              setModalTab('overview'); 
            }}
            title="View full profile"
          >
            View
          </button>
        </div>

        {/* Meta badges */}
        <div className="src-meta">
          <span className="admin-badge badge-primary">{student.riasecCode}</span>
          <span className={`admin-badge ${statusBadgeClass}`}>{student.counsellingStatus}</span>
          {student.gradeLevel && (
            <span className="admin-badge badge-neutral">{student.gradeLevel}</span>
          )}
        </div>

        <div className="src-divider" />

        {/* Assignment row */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="src-assign-label">Assigned Counsellor</span>
            {assignedCounsellor ? (
              <span className="counsellor-chip">
                <span className="counsellor-chip-dot" />
                {assignedCounsellor.name}
              </span>
            ) : (
              <span className="unassigned-chip">
                ⚠ Unassigned
              </span>
            )}
          </div>

          {counsellorsList.length === 0 ? (
            <div style={{
              padding: '9px 12px',
              background: 'var(--bg)',
              border: '1.5px dashed var(--border)',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic'
            }}>
              No counsellors registered yet.
            </div>
          ) : (
            <div className="src-assign-row">
              <select
                className={`src-assign-select ${localValue ? 'assigned' : ''}`}
                value={localValue}
                onChange={handleChange}
              >
                <option value="">— Select Counsellor —</option>
                {counsellorsList.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.email}
                    {c.specialization ? ` · ${c.specialization}` : ''}
                  </option>
                ))}
              </select>
              {localValue && (
                <button
                  className="admin-btn-sm-outline"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', padding: '6px 10px' }}
                  onClick={() => handleChange({ target: { value: '' } })}
                  title="Remove assignment"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sessions count */}
        {student.sessions && student.sessions.length > 0 && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            background: 'var(--bg)',
            borderRadius: 'var(--r-sm)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📋 <strong style={{ color: 'var(--text-main)' }}>{student.sessions.length}</strong> session{student.sessions.length !== 1 ? 's' : ''} logged
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (loadingData) return (
      <div className="empty-state">
        <div className="empty-icon">⏳</div>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Loading Platform Data...</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Connecting to live database</p>
      </div>
    );

    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div className="header-bar">
              <div>
                <h1>My Profile</h1>
                <p>Manage your professional details, experience, and credentials.</p>
              </div>
              <button className="admin-btn" onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? '⏳ Saving...' : '💾 Save Profile'}
              </button>
            </div>

            <div className="admin-card" style={{ borderTop: '3px solid var(--primary)' }}>
              <h3>Personal Information</h3>
              <div className="grid-2col">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={personalProfile.name} onChange={(e) => setPersonalProfile({ ...personalProfile, name: e.target.value })} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Registered Email</label>
                  <input type="text" className="form-input" value={personalProfile.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  <input type="text" className="form-input" placeholder="e.g. Senior Career Counsellor" value={personalProfile.title} onChange={(e) => setPersonalProfile({ ...personalProfile, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" placeholder="+91..." value={personalProfile.phone} onChange={(e) => setPersonalProfile({ ...personalProfile, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea className="form-textarea" rows="3" placeholder="A brief overview of your counselling philosophy..." value={personalProfile.bio} onChange={(e) => setPersonalProfile({ ...personalProfile, bio: e.target.value })}></textarea>
              </div>
            </div>

            <div className="admin-card" style={{ borderTop: '3px solid var(--secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>Work Experience</h3>
                <button className="admin-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={addExperience}>+ Add Role</button>
              </div>
              {personalProfile.experience.length === 0 && (
                <div className="empty-state" style={{ padding: '24px' }}>
                  <div className="empty-icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>💼</div>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>No experience added yet. Click "+ Add Role" to begin.</p>
                </div>
              )}
              {personalProfile.experience.map((exp) => (
                <div key={exp.id} className="array-item-card">
                  <button className="remove-item-btn" onClick={() => removeExperience(exp.id)}>✕</button>
                  <div className="grid-3col">
                    <div className="form-group">
                      <label className="form-label">Institution / Company</label>
                      <input type="text" className="form-input" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="e.g. St Joseph's School" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role / Position</label>
                      <input type="text" className="form-input" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="School Counsellor" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input type="text" className="form-input" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} placeholder="2022 – Present" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-card" style={{ borderTop: '3px solid var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>Education & Certifications</h3>
                <button className="admin-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={addEducation}>+ Add Degree</button>
              </div>
              {personalProfile.education.length === 0 && (
                <div className="empty-state" style={{ padding: '24px' }}>
                  <div className="empty-icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>🎓</div>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>No education added yet. Click "+ Add Degree" to begin.</p>
                </div>
              )}
              {personalProfile.education.map((edu) => (
                <div key={edu.id} className="array-item-card">
                  <button className="remove-item-btn" onClick={() => removeEducation(edu.id)}>✕</button>
                  <div className="grid-3col">
                    <div className="form-group">
                      <label className="form-label">Degree / Certification</label>
                      <input type="text" className="form-input" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="e.g. MSW (Psychiatric Social Work)" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Institution</label>
                      <input type="text" className="form-input" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University Name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <input type="text" className="form-input" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} placeholder="2020" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-card" style={{ borderTop: '3px solid var(--warning)' }}>
              <h3>Links & Interests</h3>
              <div className="grid-2col">
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input type="text" className="form-input" placeholder="https://linkedin.com/in/..." value={personalProfile.linkedin} onChange={(e) => setPersonalProfile({ ...personalProfile, linkedin: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hobbies & Interests</label>
                  <input type="text" className="form-input" placeholder="e.g. Reading, Trekking, Cooking" value={personalProfile.hobbies} onChange={(e) => setPersonalProfile({ ...personalProfile, hobbies: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    case 'students':
        return (
          <div>
            <div className="header-bar">
              <div>
                <h1>Student Master Directory</h1>
                <p>
                  {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} shown
                  {statusFilter !== 'All' ? ` · Filtered: ${statusFilter}` : ''}
                  {debouncedSearch ? ` · Search: "${debouncedSearch}"` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* View toggle */}
                <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setViewMode('cards')}
                    style={{
                      padding: '8px 14px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem', fontWeight: '600', transition: '0.15s',
                      background: viewMode === 'cards' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'cards' ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    ⊞ Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    style={{
                      padding: '8px 14px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem', fontWeight: '600', transition: '0.15s',
                      background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'table' ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    ☰ Table
                  </button>
                </div>
              </div>
            </div>

            {/* Track Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px' }}>Track:</span>
              {['All Students', 'Counselling', 'Career Guidance', 'Both'].map((label) => {
                const value = label === 'All Students' ? 'All' : label;
                const isActive = trackFilter === value;
                return (
                  <button
                    key={label}
                    onClick={() => setTrackFilter(value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                      background: isActive ? 'var(--primary)' : 'var(--card-bg)',
                      color: isActive ? 'white' : 'var(--text-muted)',
                      fontWeight: '600',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              {trackFilter !== 'All' && (
                <button
                  onClick={() => setTrackFilter('All')}
                  style={{ padding: '6px 10px', borderRadius: '20px', border: '1.5px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  ✕ Reset
                </button>
              )}
            </div>

            {/* Search & Filter Bar */}
            <div className="search-bar" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                ref={searchRef}
                className="form-input"
                placeholder="🔍 Search by name or email... (Press '/' to focus)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ flex: 2 }}
              />
              <select className="form-select" value={eduFilter} onChange={(e) => setEduFilter(e.target.value)} style={{ flex: 1 }}>
                <option value="All">All Education Levels</option>
                <option value="10th">10th Grade</option>
                <option value="12th">12th Grade / PUC</option>
                <option value="Graduate">Graduate (UG)</option>
                <option value="Post Graduate">Post Graduate (PG)</option>
              </select>
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: 1 }}>
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {(searchInput || statusFilter !== 'All' || eduFilter !== 'All') && (
                <button
                  className="admin-btn-outline"
                  onClick={() => { setSearchInput(''); setStatusFilter('All'); setEduFilter('All'); }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {filteredStudents.length === 0 ? (
              <div className="admin-card">
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No students found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              </div>
            ) : viewMode === 'cards' ? (
              /* ── PREMIUM CARD VIEW ── */
              <div>
                {/* Summary strip */}
                <div style={{
                  display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap'
                }}>
                  {[
                    { label: 'Unassigned', count: filteredStudents.filter(s => !s.assignedCounsellorId).length, color: 'var(--danger)', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)' },
                    { label: 'Assigned', count: filteredStudents.filter(s => s.assignedCounsellorId).length, color: 'var(--success)', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
                    { label: 'In Progress', count: filteredStudents.filter(s => s.counsellingStatus === 'In Progress').length, color: 'var(--warning)', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' },
                    { label: 'Completed', count: filteredStudents.filter(s => s.counsellingStatus === 'Completed').length, color: 'var(--success)', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '10px 18px',
                      background: item.bg,
                      border: `1px solid ${item.border}`,
                      borderRadius: 'var(--r-sm)',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: item.color }}>{item.count}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="student-roster-grid">
                  {filteredStudents.map(student => (
                    <StudentRosterCard key={student.id} student={student} />
                  ))}
                </div>
              </div>
            ) : (
              /* ── TABLE VIEW ── */
              <div className="admin-card" style={{ borderTop: '3px solid var(--success)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>RIASEC</th>
                        <th>Status</th>
                        <th>Assigned Counsellor</th>
                        <th>Reassign</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => {
                        const assignedCounsellor = getAssignedCounsellor(student);
                        return (
                          <tr key={student.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', overflow: 'hidden', flexShrink: 0 }}>
                                  {student.profilePicture ? (
                                    <img src={student.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    (student.name || '?').charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{student.name || 'Unknown'}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{student.email}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="admin-badge badge-primary">{student.riasecCode}</span></td>
                            <td>
                              <span className={`admin-badge ${student.counsellingStatus === 'Not Started' ? 'badge-danger' : student.counsellingStatus === 'In Progress' ? 'badge-warn' : 'badge-success'}`}>
                                {student.counsellingStatus}
                              </span>
                            </td>
                            <td>
                              {assignedCounsellor ? (
                                <span className="counsellor-chip">
                                  <span className="counsellor-chip-dot" />
                                  {assignedCounsellor.name}
                                </span>
                              ) : (
                                <span className="unassigned-chip">⚠ Unassigned</span>
                              )}
                            </td>
                            <td style={{ minWidth: '180px' }}>
                              {counsellorsList.length > 0 ? (
                                <select
                                  className="form-select"
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                  value={student.assignedCounsellorId || ''}
                                  onChange={(e) => handleAssignCounsellor(student.id, e.target.value)}
                                >
                                  <option value="">— Unassigned —</option>
                                  {counsellorsList.map(c => (
                                    <option key={c.id} value={c.id}>{c.name || c.email}</option>
                                  ))}
                                </select>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No counsellors</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="admin-btn-sm-outline"
                                onClick={() => { setSelectedStudent(student); setModalTab('overview'); }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'counselling':
        return (
          <div>
            <div className="header-bar">
              <div>
                <h1>Counselling Workflow</h1>
                <p>Track and manage active counselling relationships.</p>
              </div>
            </div>

            {counsellorsList.length === 0 ? (
              <div className="admin-card">
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No Counsellors Registered</h3>
                  <p>Add counsellors to the Staff collection to begin managing assignments.</p>
                </div>
              </div>
            ) : (
              counsellorsList.map(counsellor => {
                const assignedStudents = students.filter(s => s.assignedCounsellorId === counsellor.id);
                return (
                  <div key={counsellor.id} className="admin-card" style={{ borderTop: '3px solid var(--primary)' }}>
                    <h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary), #7C6EF5)',
                          color: 'white', fontWeight: '800', fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {(counsellor.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{counsellor.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>{counsellor.title || counsellor.specialization || 'Counsellor'}</div>
                        </div>
                      </div>
                      <span className="admin-badge badge-primary">{assignedStudents.length} Students</span>
                    </h3>

                    {assignedStudents.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        No students assigned yet.
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Student</th>
                              <th>RIASEC</th>
                              <th>Status</th>
                              <th>Sessions</th>
                              <th>Reassign To</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedStudents.map(student => (
                              <tr key={student.id}>
                                <td>
                                  <div style={{ fontWeight: '600' }}>{student.name || 'Unknown'}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{student.email}</div>
                                </td>
                                <td><span className="admin-badge badge-primary">{student.riasecCode}</span></td>
                                <td>
                                  <span className={`admin-badge ${student.counsellingStatus === 'Not Started' ? 'badge-danger' : student.counsellingStatus === 'In Progress' ? 'badge-warn' : 'badge-success'}`}>
                                    {student.counsellingStatus}
                                  </span>
                                </td>
                                <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                  {(student.sessions || []).length}
                                </td>
                                <td style={{ minWidth: '180px' }}>
                                  <select
                                    className="form-select"
                                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                    value={student.assignedCounsellorId || ''}
                                    onChange={(e) => handleAssignCounsellor(student.id, e.target.value)}
                                  >
                                    <option value="">— Unassign —</option>
                                    {counsellorsList.map(c => (
                                      <option key={c.id} value={c.id}>{c.name || c.email}</option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <button
                                    className="admin-btn-sm-outline"
                                    onClick={() => { setSelectedStudent(student); setModalTab('counselling'); }}
                                  >
                                    Log Session
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        );

      case 'institutions':
        return <InstitutionsTab
          ctxInstitutions={ctxInstitutions}
          registerInstitution={registerInstitution}
          setToast={setToast}
        />;

      case 'analytics':
        return (
          <div>
            <div className="header-bar">
              <div>
                <h1>Analytics & Conversion</h1>
                <p>Platform-wide pipeline and completion metrics.</p>
              </div>
            </div>
            <div className="admin-card" style={{ borderTop: '3px solid var(--secondary)' }}>
              <h3>Conversion Funnel</h3>
              <div className="funnel-container">
                <div className="funnel-step">
                  <div className="funnel-val">{totalRegistered}</div>
                  <div className="funnel-label">Registered</div>
                </div>
                <div className="funnel-step">
                  <div className="funnel-val" style={{ color: 'var(--primary)' }}>{totalAssessed}</div>
                  <div className="funnel-label">Assessed</div>
                </div>
                <div className="funnel-step">
                  <div className="funnel-val" style={{ color: 'var(--warning)' }}>{totalCounselled}</div>
                  <div className="funnel-label">In Counselling</div>
                </div>
                <div className="funnel-step">
                  <div className="funnel-val" style={{ color: 'var(--success)' }}>{totalCompleted}</div>
                  <div className="funnel-label">Completed</div>
                </div>
              </div>
            </div>

            {/* Assignment breakdown */}
            <div className="admin-card" style={{ borderTop: '3px solid var(--primary)' }}>
              <h3>Assignment Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {counsellorsList.map(c => {
                  const count = students.filter(s => s.assignedCounsellorId === c.id).length;
                  const pct = totalAssessed > 0 ? Math.round((count / totalAssessed) * 100) : 0;
                  return (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '160px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', flexShrink: 0 }}>{c.name}</div>
                      <div style={{ flex: 1, background: 'var(--bg)', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: '20px', transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ width: '60px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>{count} ({pct}%)</div>
                    </div>
                  );
                })}
                {counsellorsList.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '16px' }}>
                    No counsellors registered yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <div className="header-bar">
              <h1>{allowedTabs.find(t => t.id === activeTab)?.label}</h1>
              <p>Module configuration.</p>
            </div>
            <div className="empty-state">
              <div className="empty-icon">🚧</div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Under Construction</h3>
              <p>This module is being built. Check back soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="social-dark-theme">
      <nav className="top-global-nav">
        <h2>VidyaVantage (Admin Server)</h2>
        <ul className="top-global-nav-links">
          <li>🎛️ Dashboard</li>
          <li>⚙️ System Health</li>
          <li>🚪 Sign Out</li>
          <li style={{ cursor: 'pointer', color: '#2D88FF' }} onClick={() => window.location.href = '/'}>🌐 Main Website</li>
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
            <div className={`about-nav-item ${activeAdminTab === 'command-center' ? 'active' : ''}`} onClick={() => setActiveAdminTab('command-center')}>Command Center</div>
            <div className={`about-nav-item ${activeAdminTab === 'user-db' ? 'active' : ''}`} onClick={() => setActiveAdminTab('user-db')}>User Database</div>
          </div>

          <div className="about-content">
            {activeAdminTab === 'command-center' && (
              <div>
                <div className="about-content-header">System Overview</div>

                {/* ── EXISTING ADMIN DASHBOARD (admin-root wrapper) ── */}
                <div className="admin-root" style={{ height: 'auto', minHeight: 'unset' }}>

                  {/* ── SIDEBAR ── */}
                  <div className="admin-sidebar">
                    <div className="admin-brand" onClick={() => setActiveTab('overview')}>
                      <h2>Secret Sharz</h2>
                      <div className="admin-brand-sub">Admin Portal</div>
                    </div>

                    <div className="nav-section-label">Navigation</div>
                    {allowedTabs.map(tab => (
                      <button
                        key={tab.id}
                        className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="nav-btn-icon">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}

                    {/* Portal Switcher */}
                    <div style={{ flex: 1 }} />
                    <div className="portal-switcher">
                      <div className="portal-switcher-label">Switch Portal</div>
                      <button className="portal-btn current">
                        <span className="portal-btn-dot" style={{ background: '#5B6EF5' }} />
                        Admin Portal
                      </button>
                      {navigate && (
                        <button className="portal-btn" onClick={() => navigate('/counsellor')}>
                          <span className="portal-btn-dot" style={{ background: '#10B981' }} />
                          Counsellor Portal
                        </button>
                      )}
                      {navigate && (
                        <button className="portal-btn" onClick={() => navigate('/dashboard')}>
                          <span className="portal-btn-dot" style={{ background: '#F59E0B' }} />
                          Student Portal
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── MAIN ── */}
                  <div className="admin-main">
                    {/* Top Header */}
                    <div className="top-header">
                      <div className="top-header-left">
                        <span className={`admin-badge ${isCounsellor ? 'badge-primary' : 'badge-success'}`}>
                          {profile.role?.replace('_', ' ').toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                          {profile.name || user?.email}
                        </span>
                      </div>

                      <div className="header-actions">
                        {/* Download Button */}
                        <button
                          onClick={downloadStudentData}
                          className="admin-btn-outline"
                          style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                        >
                          📥 Export CSV
                        </button>

                        {/* Notifications */}
                        <div style={{ position: 'relative' }}>
                          <button className="notify-bell" onClick={() => setNotifyOpen(!notifyOpen)}>
                            🔔
                            {notifications.length > 0 && <div className="notify-badge">{notifications.length}</div>}
                          </button>
                          {notifyOpen && (
                            <div className="dropdown-content" style={{ width: '300px' }}>
                              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                Notifications
                              </div>
                              {notifications.length === 0 ? (
                                <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No new alerts</div>
                              ) : (
                                notifications.map(n => (
                                  <button key={n.id} className="notify-item" style={{ color: n.type === 'warning' ? 'var(--warning)' : 'var(--success)' }}>
                                    {n.type === 'warning' ? '⚠️' : '✅'} {n.text}
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>

                        <button onClick={onBackToApp} className="site-link">🌐 Live Site</button>

                        <div style={{ position: 'relative' }}>
                          <div className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                            {(profile.name || 'A').charAt(0).toUpperCase()}
                          </div>
                          {profileOpen && (
                            <div className="dropdown-content">
                              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>{profile.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</div>
                              </div>
                              <button onClick={() => { setProfileOpen(false); setActiveTab('profile'); }}>👤 My Profile</button>
                              <button style={{ color: 'var(--danger)' }} onClick={handleLogout}>🚪 Sign Out</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="main-content">
                      {renderTabContent()}
                    </div>
                  </div>

                </div>{/* end admin-root */}
              </div>
            )}

            {activeAdminTab === 'user-db' && (
              <div>
                <div className="about-content-header">Manage Users &amp; Roles</div>

                {/* ── USER MANAGEMENT TABLES ── */}
                <div className="admin-root" style={{ height: 'auto', minHeight: 'unset' }}>

                  {/* Sidebar for user-db tab */}
                  <div className="admin-sidebar">
                    <div className="admin-brand">
                      <h2>User DB</h2>
                      <div className="admin-brand-sub">Management</div>
                    </div>
                    <div className="nav-section-label">Filters</div>
                    {['All', 'Not Started', 'In Progress', 'Completed'].map(status => (
                      <button
                        key={status}
                        className={`nav-btn ${statusFilter === status ? 'active' : ''}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Main content for user-db */}
                  <div className="admin-main">
                    <div className="main-content">
                      {/* Onboard New Counsellor Card */}
                      <div className="inline-form" style={{ marginBottom: '30px' }}>
                        <div className="about-content-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>Onboard New Counsellor</div>
                        <p style={{ color: '#B0B3B8', fontSize: '14px', marginBottom: '20px' }}>Auto-generate secure credentials and unique employee IDs (Format: SJU20000X).</p>
                        
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                          <input 
                            className="form-input" 
                            style={{ margin: 0, flex: 2 }} 
                            type="email" 
                            placeholder="Counsellor Email Address" 
                            value={newCounsellorEmail}
                            onChange={(e) => setNewCounsellorEmail(e.target.value)}
                          />
                          <button className="btn-secondary-social" onClick={handleGenerateCredentials}>Generate Credentials</button>
                        </div>

                        {(generatedPassword || generatedEmpId) && (
                          <div style={{ backgroundColor: '#18191A', padding: '15px', borderRadius: '6px', border: '1px dashed #3A3B3C', display: 'flex', gap: '20px' }}>
                            <div><span style={{ color: '#B0B3B8', fontSize: '12px' }}>Employee ID:</span><br/><strong style={{ color: '#2D88FF' }}>{generatedEmpId}</strong></div>
                            <div><span style={{ color: '#B0B3B8', fontSize: '12px' }}>Temporary Password:</span><br/><strong style={{ color: '#E4E6EB' }}>{generatedPassword}</strong></div>
                            <button className="btn-primary-social" style={{ marginLeft: 'auto' }}>Create Account</button>
                          </div>
                        )}
                      </div>

                      {/* Search Bar */}
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                        <input
                          type="text"
                          ref={searchRef}
                          className="form-input"
                          placeholder="🔍 Search by name or email..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          style={{ flex: 2 }}
                        />
                        <select className="form-select" value={eduFilter} onChange={(e) => setEduFilter(e.target.value)} style={{ flex: 1 }}>
                          <option value="All">All Education Levels</option>
                          <option value="10th">10th Grade</option>
                          <option value="12th">12th Grade / PUC</option>
                          <option value="Graduate">Graduate (UG)</option>
                          <option value="Post Graduate">Post Graduate (PG)</option>
                        </select>
                        {(searchInput || statusFilter !== 'All' || eduFilter !== 'All') && (
                          <button
                            className="admin-btn-outline"
                            onClick={() => { setSearchInput(''); setStatusFilter('All'); setEduFilter('All'); }}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            ✕ Clear
                          </button>
                        )}
                      </div>

                      {/* Students Table */}
                      <div className="admin-card" style={{ borderTop: '3px solid var(--primary)' }}>
                        <h3>
                          🎓 Students
                          <span className="admin-badge badge-primary">{filteredStudents.length} Shown</span>
                        </h3>
                        {filteredStudents.length === 0 ? (
                          <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <p>No students found. Try adjusting your filters.</p>
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                              <thead>
                                <tr>
                                  <th>Student</th>
                                  <th>RIASEC</th>
                                  <th>Status</th>
                                  <th>Assigned Counsellor</th>
                                  <th>Reassign</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredStudents.map(student => {
                                  const assignedCounsellor = getAssignedCounsellor(student);
                                  return (
                                    <tr key={student.id}>
                                      <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', overflow: 'hidden', flexShrink: 0 }}>
                                            {student.profilePicture ? (
                                              <img src={student.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                              (student.name || '?').charAt(0).toUpperCase()
                                            )}
                                          </div>
                                          <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{student.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{student.email}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td><span className="admin-badge badge-primary">{student.riasecCode}</span></td>
                                      <td>
                                        <span className={`admin-badge ${student.counsellingStatus === 'Not Started' ? 'badge-danger' : student.counsellingStatus === 'In Progress' ? 'badge-warn' : 'badge-success'}`}>
                                          {student.counsellingStatus}
                                        </span>
                                      </td>
                                      <td>
                                        {assignedCounsellor ? (
                                          <span className="counsellor-chip">
                                            <span className="counsellor-chip-dot" />
                                            {assignedCounsellor.name}
                                          </span>
                                        ) : (
                                          <span className="unassigned-chip">⚠ Unassigned</span>
                                        )}
                                      </td>
                                      <td style={{ minWidth: '180px' }}>
                                        {counsellorsList.length > 0 ? (
                                          <select
                                            className="form-select"
                                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                            value={student.assignedCounsellorId || ''}
                                            onChange={(e) => handleAssignCounsellor(student.id, e.target.value)}
                                          >
                                            <option value="">— Unassigned —</option>
                                            {counsellorsList.map(c => (
                                              <option key={c.id} value={c.id}>{c.name || c.email}</option>
                                            ))}
                                          </select>
                                        ) : (
                                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No counsellors</span>
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          className="admin-btn-sm-outline"
                                          onClick={() => { setSelectedStudent(student); setModalTab('overview'); }}
                                        >
                                          View
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Counsellors / Experts Table */}
                      <div className="admin-card" style={{ borderTop: '3px solid var(--success)' }}>
                        <h3>
                          👥 Counsellors / Experts
                          <span className="admin-badge badge-success">{counsellorsList.length} Registered</span>
                        </h3>
                        {counsellorsList.length === 0 ? (
                          <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <p>No counsellors registered yet. Add them to the Staff collection in Firestore.</p>
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Title / Specialization</th>
                                  <th>Email</th>
                                  <th>Assigned Students</th>
                                  <th>Availability</th>
                                </tr>
                              </thead>
                              <tbody>
                                {counsellorsList.map(c => {
                                  const assignedCount = students.filter(s => s.assignedCounsellorId === c.id).length;
                                  return (
                                    <tr key={c.id}>
                                      <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #7C6EF5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
                                            {(c.name || 'C').charAt(0).toUpperCase()}
                                          </div>
                                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{c.name || '—'}</div>
                                        </div>
                                      </td>
                                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.title || c.specialization || '—'}</td>
                                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.email || '—'}</td>
                                      <td>
                                        <span className="admin-badge badge-primary">{assignedCount} Students</span>
                                      </td>
                                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.availability || '—'}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>{/* end admin-root for user-db */}
              </div>
            )}
          </div>
        </div>

        {/* ── TOAST NOTIFICATIONS ── */}
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}

        {/* ── STUDENT DETAIL MODAL ── */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '40px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {selectedStudent.name || 'Unknown Student'}
                      {selectedStudent.hasAcceptedTerms ? (
                        <span style={{ background: '#4CAF50', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>✓ Consent Granted</span>
                      ) : (
                        <span style={{ background: '#f44336', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Pending Consent</span>
                      )}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{selectedStudent.email}</p>
                  </div>
                  <span className="admin-badge badge-primary" style={{ fontSize: '1.2rem', padding: '6px 12px' }}>{selectedStudent.riasecCode || 'N/A'}</span>
                </div>
                <div className="modal-tabs">
                  <button className={`modal-tab ${modalTab === 'overview' ? 'active' : ''}`} onClick={() => setModalTab('overview')}>Overview</button>
                  <button className={`modal-tab ${modalTab === 'counselling' ? 'active' : ''}`} onClick={() => setModalTab('counselling')}>Counselling</button>
                </div>
              </div>
              
              <div className="modal-body">
                {modalTab === 'overview' && (
                  <div>
                    <div className="admin-card" style={{ marginBottom: '20px', borderTop: '3px solid var(--primary)' }}>
                      <h3>Personal Information</h3>
                      <p style={{ marginBottom: '15px' }}><strong>Bio:</strong> {selectedStudent.bio || 'No bio provided'}</p>
                      <div className="grid-2col" style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                        <div><strong>Father:</strong> {selectedStudent.fatherName || '—'} <br/><span style={{ color: 'var(--text-muted)' }}>{selectedStudent.fatherPhone || '—'}</span></div>
                        <div><strong>Mother:</strong> {selectedStudent.motherName || '—'} <br/><span style={{ color: 'var(--text-muted)' }}>{selectedStudent.motherPhone || '—'}</span></div>
                        <div><strong>Location:</strong> {selectedStudent.location || '—'}</div>
                        <div><strong>Hometown:</strong> {selectedStudent.hometown || '—'}</div>
                      </div>
                    </div>
                    
                    <div className="admin-card" style={{ borderTop: '3px solid var(--warning)' }}>
                      <h3>Hobbies & Interests</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                          { label: '🎨 Hobbies', data: selectedStudent.hobbies },
                          { label: '🎵 Music', data: selectedStudent.music },
                          { label: '📺 TV Shows', data: selectedStudent.tvShows },
                          { label: '🎬 Movies', data: selectedStudent.movies },
                          { label: '🎮 Games', data: selectedStudent.games },
                          { label: '⚽ Sports', data: selectedStudent.sports },
                          { label: '🏅 Athletes', data: selectedStudent.athletes }
                        ].map((cat, idx) => (
                          <div key={idx}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '5px' }}>{cat.label}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {Array.isArray(cat.data) && cat.data.length > 0 ? (
                                cat.data.map((item, i) => (
                                  <span key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{item}</span>
                                ))
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>None listed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="admin-card" style={{ borderTop: '3px solid var(--secondary)', marginTop: '20px' }}>
                      <h3>🕸️ Life Skills Matrix</h3>
                      {selectedStudent.lifeSkills ? (
                        <div className="grid-2col" style={{ alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['communication', 'resilience', 'criticalThinking', 'empathy', 'leadership'].map(skill => (
                              <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                <span style={{ textTransform: 'capitalize' }}>{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span style={{ color: 'var(--primary)' }}>{selectedStudent.lifeSkills[skill] || 0} / 100</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <SkillRadarChart skills={selectedStudent.lifeSkills} />
                          </div>
                        </div>
                      ) : (
                        <div className="empty-state" style={{ padding: '20px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>Student has not completed the Life Skills Matrix yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {modalTab === 'counselling' && (
                  <>
                    <div className="admin-card" style={{ borderTop: '3px solid var(--success)' }}>
                      <h3>Counselling Notes</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Session logging interface goes here.</p>
                    </div>

                    <div className="admin-card" style={{ borderTop: '3px solid var(--primary)', marginTop: '20px' }}>
                      <h3>📓 Student's Clarity Journal</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Private entries logged by the student for counselor review.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {selectedStudent.journalEntries && selectedStudent.journalEntries.length > 0 ? (
                          selectedStudent.journalEntries.map((entry, idx) => (
                            <div key={idx} style={{ background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '8px' }}>
                                {new Date(entry.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{entry.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state" style={{ padding: '20px' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>No journal entries logged yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="admin-card" style={{ borderTop: '3px solid var(--secondary)', marginTop: '20px' }}>
                      <h3>🗺️ Student's Career Roadmap</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Read-only view of the student's execution plan and progress.</p>
                      
                      {selectedStudent.roadmapTasks && selectedStudent.roadmapTasks.length > 0 ? (
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                          {['todo', 'doing', 'done'].map(column => (
                            <div key={column} style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
                              <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                                {column === 'todo' ? '📝 To Do' : column === 'doing' ? '⏳ Doing' : '✅ Done'}
                                <span style={{ float: 'right', background: 'var(--bg)', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' }}>
                                  {selectedStudent.roadmapTasks.filter(t => t.status === column).length}
                                </span>
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedStudent.roadmapTasks.filter(t => t.status === column).map(task => (
                                  <div key={task.id} style={{ background: 'var(--bg)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    {task.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state" style={{ padding: '20px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>Student has not added any tasks to their roadmap yet.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

// ── STUDENT DETAIL MODAL + TOAST are inside the return above ──
// (moved inside the social-dark-theme wrapper)

