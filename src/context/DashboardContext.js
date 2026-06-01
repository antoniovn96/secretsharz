import React, { createContext, useContext, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Realistic seed data for frontend prototype
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STUDENTS = [
  {
    id: 'student-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.com',
    age: 17,
    gender: 'Female',
    schoolName: 'Delhi Public School, R.K. Puram',
    gradeLevel: 'Class 12',
    stream1112: 'Science (PCB)',
    marks10th: 91,
    marks12th: 88,
    riasecCode: 'ISA',
    riasecSummary: 'Investigative-Social-Artistic: Strong analytical mind with a deep desire to help others. Best suited for healthcare, research, or counselling roles.',
    counsellingStatus: 'In Progress',
    counsellingStage: 'Exploration',
    assignedCounsellorId: 'counsellor-001',
    priority: 'high',
    sessions: [
      {
        id: 1,
        date: '2026-05-10',
        duration: '45',
        outcome: 'Discussed stream confusion. Student is torn between MBBS and Psychology. Assigned research task on both career paths.'
      }
    ],
    counsellorNotes: [
      {
        id: 1,
        date: '2026-05-10T10:30:00.000Z',
        type: 'Exploration',
        note: 'Priya is highly motivated but anxious about NEET preparation. Discussed coping strategies and realistic goal-setting.',
        nextActionDate: '2026-05-24',
        homeworkTask: 'Research 3 psychology colleges and their admission criteria.',
        counsellorEmail: 'dr.meera@secretsharz.com'
      }
    ],
    bestCareer: { title: 'Clinical Psychologist', subtitle: 'Health & Social Sciences', matchPercent: 92, pros: ['High impact on lives', 'Growing demand in India'], cons: ['Long study path (6+ years)', 'Emotionally demanding'], parentMetrics: { stability: 'High', demand: 'High', safety: 'High' } },
    recommendedCareer: { title: 'Medical Doctor (MBBS)', subtitle: 'Healthcare', matchPercent: 85, pros: ['Prestigious career', 'High earning potential'], cons: ['Extremely competitive entrance', 'Long internship period'], parentMetrics: { stability: 'Very High', demand: 'Very High', safety: 'High' } },
    leastCareer: { title: 'Software Engineer', subtitle: 'Tech & Innovation', matchPercent: 38, pros: ['High salary', 'Remote work options'], cons: ['Misaligned with social interests', 'Sedentary work'], parentMetrics: { stability: 'High', demand: 'Very High', safety: 'High' } },
    xp: 120,
    profileComplete: true,
    createdAt: '2026-04-15T08:00:00.000Z'
  },
  {
    id: 'student-002',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@student.com',
    age: 16,
    gender: 'Male',
    schoolName: 'Kendriya Vidyalaya, Sector 8, Chandigarh',
    gradeLevel: 'Class 11',
    stream1112: 'Science (PCM)',
    marks10th: 84,
    riasecCode: 'RIE',
    riasecSummary: 'Realistic-Investigative-Enterprising: Hands-on problem solver with strong logical reasoning. Thrives in engineering, technology, and entrepreneurship.',
    counsellingStatus: 'Not Started',
    counsellingStage: 'Assessment',
    assignedCounsellorId: null,
    priority: 'medium',
    sessions: [],
    counsellorNotes: [],
    bestCareer: { title: 'Mechanical Engineer', subtitle: 'Engineering & Design', matchPercent: 89, pros: ['Strong job market', 'Diverse industries'], cons: ['Requires strong math foundation', 'Can be physically demanding'], parentMetrics: { stability: 'High', demand: 'High', safety: 'High' } },
    recommendedCareer: { title: 'Data Scientist', subtitle: 'Tech & Analytics', matchPercent: 82, pros: ['Top-paying field', 'Future-proof career'], cons: ['Requires continuous upskilling', 'Competitive market'], parentMetrics: { stability: 'High', demand: 'Very High', safety: 'High' } },
    leastCareer: { title: 'Graphic Designer', subtitle: 'Arts & Media', matchPercent: 31, pros: ['Creative freedom', 'Flexible work'], cons: ['Inconsistent income', 'Misaligned with technical strengths'], parentMetrics: { stability: 'Low', demand: 'Medium', safety: 'Moderate' } },
    xp: 45,
    profileComplete: true,
    createdAt: '2026-05-01T09:30:00.000Z'
  },
  {
    id: 'student-003',
    name: 'Ananya Krishnan',
    email: 'ananya.k@student.com',
    age: 18,
    gender: 'Female',
    schoolName: 'Bishop Cotton Girls School, Bangalore',
    gradeLevel: 'Class 12',
    stream1112: 'Commerce',
    marks10th: 95,
    marks12th: 91,
    riasecCode: 'ESC',
    riasecSummary: 'Enterprising-Social-Conventional: Natural leader with strong communication skills and a structured approach to problem-solving. Ideal for business, law, and management.',
    counsellingStatus: 'Completed',
    counsellingStage: 'Finalisation',
    assignedCounsellorId: 'counsellor-001',
    priority: 'low',
    sessions: [
      { id: 1, date: '2026-04-05', duration: '60', outcome: 'Initial assessment. Identified strong interest in corporate law and finance.' },
      { id: 2, date: '2026-04-20', duration: '45', outcome: 'Finalized college shortlist: NLSIU Bangalore, NLU Delhi, Symbiosis Law School.' },
      { id: 3, date: '2026-05-08', duration: '30', outcome: 'Reviewed CLAT preparation strategy. Student is well-prepared. Case closed.' }
    ],
    counsellorNotes: [
      { id: 1, date: '2026-04-05T11:00:00.000Z', type: 'Exploration', note: 'Ananya has exceptional clarity about her goals. Wants to pursue corporate law.', nextActionDate: '2026-04-20', homeworkTask: 'Research top NLUs and their CLAT cutoffs.', counsellorEmail: 'dr.meera@secretsharz.com' },
      { id: 2, date: '2026-04-20T11:00:00.000Z', type: 'Decision', note: 'Finalized college list. CLAT prep is on track. Recommended mock test series.', nextActionDate: '2026-05-08', homeworkTask: 'Complete 5 CLAT mock tests.', counsellorEmail: 'dr.meera@secretsharz.com' },
      { id: 3, date: '2026-05-08T11:00:00.000Z', type: 'Report Review', note: 'Final review session. Student is confident and prepared. Closing case.', nextActionDate: '', homeworkTask: '', counsellorEmail: 'dr.meera@secretsharz.com' }
    ],
    bestCareer: { title: 'Corporate Lawyer', subtitle: 'Law & Business', matchPercent: 96, pros: ['High earning potential', 'Prestigious career'], cons: ['High-pressure environment', 'Long working hours'], parentMetrics: { stability: 'Very High', demand: 'High', safety: 'High' } },
    recommendedCareer: { title: 'Chartered Accountant', subtitle: 'Finance & Accounting', matchPercent: 88, pros: ['Stable career', 'High demand'], cons: ['Difficult exams (CA Foundation/Inter/Final)', 'Repetitive work'], parentMetrics: { stability: 'Very High', demand: 'High', safety: 'Very High' } },
    leastCareer: { title: 'Research Scientist', subtitle: 'Science & Research', matchPercent: 29, pros: ['Intellectual stimulation', 'Contribution to knowledge'], cons: ['Low pay in early career', 'Misaligned with enterprising personality'], parentMetrics: { stability: 'Medium', demand: 'Medium', safety: 'High' } },
    xp: 280,
    profileComplete: true,
    createdAt: '2026-03-20T07:00:00.000Z'
  }
];

const INITIAL_COUNSELLORS = [
  {
    id: 'counsellor-001',
    name: 'Dr. Meera Nair',
    email: 'dr.meera@secretsharz.com',
    title: 'Senior Career Counsellor & Clinical Psychologist',
    phone: '+91 98765 43210',
    linkedin: 'https://linkedin.com/in/dr-meera-nair',
    bio: 'Over 12 years of experience in student career counselling and clinical psychology. Specializes in RIASEC-based career mapping and adolescent mental health.',
    specialization: 'Clinical Psychology & Career Guidance',
    experience: [
      { id: 1, company: 'Delhi Public School, R.K. Puram', role: 'Head Counsellor', duration: '2018 – Present' },
      { id: 2, company: 'NIMHANS, Bangalore', role: 'Clinical Intern', duration: '2014 – 2016' }
    ],
    education: [
      { id: 1, degree: 'PhD in Clinical Psychology', institution: 'University of Delhi', year: '2018' },
      { id: 2, degree: 'MSc Psychology', institution: 'Christ University, Bangalore', year: '2014' }
    ],
    hobbies: 'Reading, Yoga, Classical Music',
    availability: 'Mon–Fri, 9 AM – 5 PM',
    rating: 4.9,
    totalSessions: 340,
    photo: null
  },
  {
    id: 'counsellor-002',
    name: 'Prof. Arjun Kapoor',
    email: 'arjun.kapoor@secretsharz.com',
    title: 'Career Coach & IIT Alumni Mentor',
    phone: '+91 87654 32109',
    linkedin: 'https://linkedin.com/in/arjun-kapoor-coach',
    bio: 'IIT Bombay alumnus with 8 years in career coaching. Specializes in engineering and technology career paths, JEE preparation strategy, and entrepreneurship mentoring.',
    specialization: 'Engineering & Technology Careers',
    experience: [
      { id: 1, company: 'Secret Sharz', role: 'Lead Career Coach', duration: '2023 – Present' },
      { id: 2, company: 'Unacademy', role: 'JEE Mentor', duration: '2019 – 2023' }
    ],
    education: [
      { id: 1, degree: 'B.Tech Computer Science', institution: 'IIT Bombay', year: '2016' },
      { id: 2, degree: 'MBA', institution: 'IIM Ahmedabad', year: '2018' }
    ],
    hobbies: 'Chess, Trekking, Startup Podcasts',
    availability: 'Tue, Thu, Sat, 10 AM – 6 PM',
    rating: 4.7,
    totalSessions: 210,
    photo: null
  }
];

// assignments: { [studentId]: counsellorId }
const INITIAL_ASSIGNMENTS = {
  'student-001': 'counsellor-001',
  'student-003': 'counsellor-001'
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

const DashboardContext = createContext(null);

export function DashboardProvider({ children, navigate }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [counsellors, setCounsellors] = useState(INITIAL_COUNSELLORS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  // ── STUDENT HELPERS ──────────────────────────────────────────────────────

  /** Returns the counsellor object assigned to a given student, or null */
  const getCounsellorForStudent = useCallback((studentId) => {
    const counsellorId = assignments[studentId];
    if (!counsellorId) return null;
    return counsellors.find(c => c.id === counsellorId) || null;
  }, [assignments, counsellors]);

  /** Returns all students assigned to a given counsellor */
  const getStudentsForCounsellor = useCallback((counsellorId) => {
    return students.filter(s => assignments[s.id] === counsellorId);
  }, [students, assignments]);

  /** Assign a student to a counsellor (creates new assignment) */
  const assignStudentToCounsellor = useCallback((studentId, counsellorId) => {
    setAssignments(prev => ({ ...prev, [studentId]: counsellorId }));
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, assignedCounsellorId: counsellorId, counsellingStatus: s.counsellingStatus === 'Not Started' ? 'In Progress' : s.counsellingStatus }
          : s
      )
    );
  }, []);

  /** Reassign a student to a different counsellor */
  const reassignStudent = useCallback((studentId, newCounsellorId) => {
    setAssignments(prev => ({ ...prev, [studentId]: newCounsellorId }));
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, assignedCounsellorId: newCounsellorId }
          : s
      )
    );
  }, []);

  /** Unassign a student from their counsellor */
  const unassignStudent = useCallback((studentId) => {
    setAssignments(prev => {
      const next = { ...prev };
      delete next[studentId];
      return next;
    });
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, assignedCounsellorId: null }
          : s
      )
    );
  }, []);

  /** Update any field(s) on a student record */
  const updateStudent = useCallback((studentId, updates) => {
    setStudents(prev =>
      prev.map(s => s.id === studentId ? { ...s, ...updates } : s)
    );
  }, []);

  /**
   * Save a student's completed RIASEC assessment results to their profile.
   * Persists the Holland Code, recommended stream, and top career matches
   * both in the in-memory context state and (if Firebase is available) to
   * the Firestore `users` collection.
   *
   * @param {string} studentId  - The authenticated user's UID / student id.
   * @param {{ hollandCode: string[], riasecScores: object, streams: object[], top5Careers: object[], maturityPct: number, profile: object }} assessmentResults
   */
  const saveAssessmentResults = useCallback(async (studentId, assessmentResults) => {
    const { hollandCode, riasecScores, streams, top5Careers, maturityPct } = assessmentResults;

    // Derive the three-letter code string (e.g. "ISA")
    const riasecCode = Array.isArray(hollandCode) ? hollandCode.join('') : String(hollandCode || '');

    // Recommended stream is the highest-scoring stream
    const recommendedStream = Array.isArray(streams) && streams.length > 0
      ? String(streams[0].id || '')
      : '';

    // Top career matches — store only serialisable primitives (no object blobs in JSX)
    const topCareerMatches = Array.isArray(top5Careers)
      ? top5Careers.map(c => ({
          name: String(c.name || ''),
          matchScore: Number(c.matchScore || 0),
          tags: Array.isArray(c.tags) ? c.tags.map(String) : [],
          stream: String(c.stream || ''),
          riasec: Array.isArray(c.riasec) ? c.riasec.map(String) : [],
        }))
      : [];

    const updates = {
      riasecCode,
      riasecScores: riasecScores || {},
      recommendedStream,
      topCareerMatches,
      maturityPct: Number(maturityPct || 0),
      assessmentCompletedAt: new Date().toISOString(),
    };

    // 1. Update in-memory context state so dashboards reflect results immediately
    setStudents(prev => {
      const exists = prev.some(s => s.id === studentId);
      if (exists) {
        return prev.map(s => s.id === studentId ? { ...s, ...updates } : s);
      }
      // If the student isn't in the seed list yet (e.g. a real Firebase user),
      // add a minimal record so counsellor/admin dashboards can see them.
      return [...prev, { id: studentId, ...updates }];
    });

    // 2. Persist to Firebase Firestore (if available at runtime)
    try {
      const { db: firestoreDb } = await import('../firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      if (firestoreDb) {
        await setDoc(
          doc(firestoreDb, 'users', studentId),
          updates,
          { merge: true }
        );
      }
    } catch (err) {
      // Firebase may not be configured in all environments — fail silently
      console.warn('[saveAssessmentResults] Firestore write skipped:', err?.message || err);
    }
  }, []);

  /** Add a session note to a student */
  const addSessionToStudent = useCallback((studentId, sessionPayload) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const updatedSessions = [...(s.sessions || []), { id: Date.now(), ...sessionPayload }];
        const updatedNotes = [...(s.counsellorNotes || []), { id: Date.now(), date: new Date().toISOString(), ...sessionPayload }];
        return {
          ...s,
          sessions: updatedSessions,
          counsellorNotes: updatedNotes,
          counsellingStatus: s.counsellingStatus === 'Not Started' ? 'In Progress' : s.counsellingStatus
        };
      })
    );
  }, []);

  // ── COUNSELLOR HELPERS ───────────────────────────────────────────────────

  /** Update any field(s) on a counsellor record */
  const updateCounsellor = useCallback((counsellorId, updates) => {
    setCounsellors(prev =>
      prev.map(c => c.id === counsellorId ? { ...c, ...updates } : c)
    );
  }, []);

  // ── MOCK LOGIN ───────────────────────────────────────────────────────────

  /**
   * Mock login function.
   * In a real app this would call Firebase Auth.
   * For the prototype it just validates a simple credential and redirects.
   *
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, error?: string, role?: string }}
   */
  const mockLogin = useCallback((email, password) => {
    // Demo credentials
    const DEMO_ACCOUNTS = [
      { email: 'student@demo.com', password: 'demo123', role: 'student', redirectTo: '/student-dashboard' },
      { email: 'counsellor@demo.com', password: 'demo123', role: 'counsellor', redirectTo: '/counsellor-dashboard' },
      { email: 'admin@demo.com', password: 'demo123', role: 'admin', redirectTo: '/admin' },
    ];

    const account = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!account) {
      return { success: false, error: 'Invalid email or password. Try student@demo.com / demo123' };
    }

    // Redirect using the custom SPA navigate function
    if (navigate) {
      navigate(account.redirectTo);
    }

    return { success: true, role: account.role, redirectTo: account.redirectTo };
  }, [navigate]);

  // ── DERIVED STATS ────────────────────────────────────────────────────────

  const stats = {
    totalStudents: students.length,
    totalCounsellors: counsellors.length,
    totalAssessed: students.filter(s => s.riasecCode).length,
    totalAssigned: Object.keys(assignments).length,
    pendingAssignment: students.filter(s => !assignments[s.id]).length,
    inProgress: students.filter(s => s.counsellingStatus === 'In Progress').length,
    completed: students.filter(s => s.counsellingStatus === 'Completed').length,
  };

  // ── CONTEXT VALUE ────────────────────────────────────────────────────────

  const value = {
    // Raw data
    students,
    counsellors,
    assignments,

    // Student operations
    getCounsellorForStudent,
    getStudentsForCounsellor,
    assignStudentToCounsellor,
    reassignStudent,
    unassignStudent,
    updateStudent,
    addSessionToStudent,
    saveAssessmentResults,

    // Counsellor operations
    updateCounsellor,

    // Auth
    mockLogin,

    // Derived
    stats,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Hook to consume the DashboardContext.
 * Usage: const { students, assignStudentToCounsellor } = useDashboard();
 */
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used inside a <DashboardProvider>');
  }
  return ctx;
}

export default DashboardContext;
