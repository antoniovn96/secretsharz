import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Realistic seed data for frontend prototype
// ─────────────────────────────────────────────────────────────────────────────

// ── DEFAULT USER PROFILE STATE ───────────────────────────────────────────────
// Used as the base shape for any logged-in student's gamified profile.
const DEFAULT_USER_PROFILE = {
  // Basic identity
  profilePicture: null,          // URL string or null
  gender: '',                    // e.g. 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'
  motherName: '',                // Mother's full name
  motherPhone: '',               // Mother's phone number
  motherEmail: '',               // Mother's email address
  fatherName: '',                // Father's full name
  fatherPhone: '',               // Father's phone number
  fatherEmail: '',               // Father's email address
  phone: '',                     // Contact phone number
  email: '',                     // Contact email address

  // Student track — determines which services are enabled
  // Values: 'unassigned' | 'counselling' | 'guidance' | 'both'
  studentTrack: 'unassigned',

  // Counselling consent — must be true before counselling features are unlocked
  counsellingConsentAgreed: false,

  interests: [],                 // e.g. ['Technology', 'Music']
  hobbies: [],                   // e.g. ['Reading', 'Sketching']
  tvShows: [],                   // e.g. ['Breaking Bad', 'Dark']
  movies: [],                    // e.g. ['Interstellar', '3 Idiots']
  games: [],                     // e.g. ['Chess', 'Minecraft']
  sports: [],                    // e.g. ['Cricket', 'Badminton']

  // Education details — multi-tiered structure
  education: {
    highestLevel: '',            // 'Graduate' | 'Post Graduate' | other

    // 10th Grade tier
    tenth: {
      schoolName: '',
      marksType: 'percentage',   // 'percentage' | 'cgpa' | 'raw'
      marksValue: '',
      marksMax: '',
      marksObtained: '',
      subjects: [],
    },

    // 12th / PUC tier
    twelfth: {
      schoolName: '',
      marksType: 'percentage',
      marksValue: '',
      marksMax: '',
      marksObtained: '',
      subjects: [],
    },

    // Graduate tier
    graduate: {
      schoolName: '',
      marksType: 'percentage',
      marksValue: '',
      marksMax: '',
      marksObtained: '',
      subjects: [],
    },

    // Post Graduate tier
    postGraduate: {
      schoolName: '',
      marksType: 'percentage',
      marksValue: '',
      marksMax: '',
      marksObtained: '',
      subjects: [],
    },

    // Legacy / general fields (kept for backward-compat with XP calc)
    schoolName: '',              // mirrors tenth.schoolName for XP calc
    address: '',
    yearOfPassing: '',
    isPursuing: true,
    subjects: [],                // mirrors active tier subjects for XP calc
    electives: [],
    marksType: 'percentage',
    marksValue: '',              // mirrors active tier marksValue for XP calc
  },

  // Gamification
  exPoints: 0,                   // Experience Points — updated by calculateExPoints()

  // Booking
  sessionsBooked: 0,             // Number of expert sessions booked
  bookings: [],                  // Array of booked session records
};

// ── MOCK SOCIAL FEED ─────────────────────────────────────────────────────────
const INITIAL_SOCIAL_FEED = [
  {
    id: 'feed-001',
    type: 'platform_update',
    title: '🚀 Secret Sharz 2.0 is Live!',
    body: 'We have rolled out a brand-new gamified dashboard experience. Earn XP, unlock badges, and track your career journey like never before!',
    author: 'Secret Sharz Team',
    authorAvatar: null,
    timestamp: '2026-05-30T09:00:00.000Z',
    likes: 142,
    comments: 18,
    tags: ['platform', 'update', 'gamification'],
  },
  {
    id: 'feed-002',
    type: 'blog_post',
    title: '📚 Top 10 Career Paths After Class 12 Science',
    body: 'Confused about what to do after your boards? Our latest blog breaks down the top 10 career options for PCB and PCM students with real salary data and growth projections.',
    author: 'Dr. Meera Nair',
    authorAvatar: null,
    timestamp: '2026-05-28T11:30:00.000Z',
    likes: 89,
    comments: 34,
    tags: ['blog', 'career', 'science', 'class12'],
    readUrl: '/blog/top-10-careers-after-class-12-science',
  },
  {
    id: 'feed-003',
    type: 'blog_post',
    title: '🎓 How to Choose the Right College: A Step-by-Step Guide',
    body: 'Choosing a college is one of the most important decisions of your life. In this post, Prof. Arjun Kapoor walks you through a structured framework to evaluate colleges beyond just rankings.',
    author: 'Prof. Arjun Kapoor',
    authorAvatar: null,
    timestamp: '2026-05-25T08:00:00.000Z',
    likes: 67,
    comments: 22,
    tags: ['blog', 'college', 'admissions', 'guide'],
    readUrl: '/blog/how-to-choose-the-right-college',
  },
  {
    id: 'feed-004',
    type: 'platform_update',
    title: '🧠 New Feature: RIASEC Career Assessment v2',
    body: 'Our upgraded career assessment now includes 60 questions, a detailed personality breakdown, and AI-powered career match scores. Retake your assessment to see your updated results!',
    author: 'Secret Sharz Team',
    authorAvatar: null,
    timestamp: '2026-05-20T10:00:00.000Z',
    likes: 203,
    comments: 41,
    tags: ['platform', 'feature', 'assessment', 'riasec'],
  },
];

// ── MOCK NOTIFICATIONS ───────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'system_alert',
    title: 'Complete Your Profile to Earn 200 XP!',
    message: 'Your profile is 40% complete. Add your education details, hobbies, and a profile picture to unlock bonus experience points and get better career recommendations.',
    isRead: false,
    priority: 'high',
    timestamp: '2026-06-01T08:00:00.000Z',
    actionLabel: 'Complete Profile',
    actionUrl: '/student-dashboard/profile',
  },
  {
    id: 'notif-002',
    type: 'counsellor_message',
    title: 'Dr. Meera Nair sent you a message',
    message: 'Hi! I have reviewed your RIASEC results. Please check your homework task for this week — research 3 psychology colleges and their admission criteria.',
    isRead: false,
    priority: 'medium',
    timestamp: '2026-05-31T14:30:00.000Z',
    actionLabel: 'View Message',
    actionUrl: '/student-dashboard/counsellor',
  },
  {
    id: 'notif-003',
    type: 'platform_update',
    title: 'New Blog Post: Top 10 Careers After Class 12',
    message: 'A new article has been published that matches your interests. Check out the top career paths for Science students.',
    isRead: true,
    priority: 'low',
    timestamp: '2026-05-28T11:30:00.000Z',
    actionLabel: 'Read Now',
    actionUrl: '/blog/top-10-careers-after-class-12-science',
  },
  {
    id: 'notif-004',
    type: 'achievement',
    title: '🏆 Achievement Unlocked: First Assessment!',
    message: 'Congratulations! You completed your first RIASEC Career Assessment. You have earned 100 XP. Keep going to unlock more achievements!',
    isRead: true,
    priority: 'low',
    timestamp: '2026-05-15T16:00:00.000Z',
    actionLabel: 'View Achievements',
    actionUrl: '/student-dashboard/achievements',
  },
];

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

// ── INSTITUTION HELPERS ──────────────────────────────────────────────────────

/**
 * generateAccountNumber()
 * Generates a unique 12-digit account number prefixed with "SS-".
 */
function generateAccountNumber() {
  const digits = Math.floor(100000000000 + Math.random() * 900000000000);
  return `SS-${digits}`;
}

/**
 * generateSecurePassword(length)
 * Generates a secure random password of the given length using uppercase,
 * lowercase, digits, and symbols.
 */
function generateSecurePassword(length = 13) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+';
  const all = upper + lower + digits + symbols;
  // Guarantee at least one of each category
  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  for (let i = pwd.length; i < length; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }
  // Shuffle
  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }
  return pwd.join('');
}

export function DashboardProvider({ children, navigate }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [counsellors, setCounsellors] = useState(INITIAL_COUNSELLORS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [institutions, setInstitutions] = useState([]);

  // ── FETCH SAVED DATA ON PAGE REFRESH ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const dbData = docSnap.data();
            setUserProfile(prev => {
              const merged = { ...prev, ...dbData };
              // Deep-merge the education sub-object safely
              if (dbData.education) {
                merged.education = { ...prev.education, ...dbData.education };
              }
              return merged;
            });
            
            // Recalculate the gamified XP points automatically after fetching
            setTimeout(() => {
              setUserProfile(curr => ({ ...curr, exPoints: calculateExPoints(curr) }));
            }, 100);
          }
        } catch (err) {
          console.error("Failed to load profile on refresh:", err);
        }
      } else {
        // Reset to default if the user logs out
        setUserProfile(DEFAULT_USER_PROFILE); 
      }
    });

    return () => unsubscribe();
  }, [calculateExPoints]);

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

  // ── GAMIFIED PROFILE HELPERS ─────────────────────────────────────────────

  /**
   * calculateExPoints(profileData)
   *
   * Evaluates how many gamified profile fields are filled out and updates
   * the `exPoints` value on the userProfile state.
   *
   * Point breakdown:
   *   +100  Education section fully filled (schoolName + highestLevel + marksValue)
   *   +50   Profile picture uploaded
   *   +30   Interests list has at least one entry
   *   +20   Hobbies list has at least one entry
   *   +15   TV Shows list has at least one entry
   *   +15   Movies list has at least one entry
   *   +15   Games list has at least one entry
   *   +15   Sports list has at least one entry
   *   +20   Education subjects filled (at least one subject)
   *   +10   Education electives filled (at least one elective)
   *   +10   Education address filled
   *   +10   Education yearOfPassing filled
   *
   * @param {object} profileData - A profile object matching DEFAULT_USER_PROFILE shape.
   *                               If omitted, the current userProfile state is used.
   * @returns {number} The newly calculated exPoints total.
   */
  const calculateExPoints = useCallback((profileData) => {
    const data = profileData || userProfile;
    let points = 0;

    // ── Profile picture ──────────────────────────────────────────────────
    if (data.profilePicture) points += 50;

    // ── Interests ────────────────────────────────────────────────────────
    if (Array.isArray(data.interests) && data.interests.length > 0) points += 30;

    // ── Hobbies ──────────────────────────────────────────────────────────
    if (Array.isArray(data.hobbies) && data.hobbies.length > 0) points += 20;

    // ── TV Shows ─────────────────────────────────────────────────────────
    if (Array.isArray(data.tvShows) && data.tvShows.length > 0) points += 15;

    // ── Movies ───────────────────────────────────────────────────────────
    if (Array.isArray(data.movies) && data.movies.length > 0) points += 15;

    // ── Games ────────────────────────────────────────────────────────────
    if (Array.isArray(data.games) && data.games.length > 0) points += 15;

    // ── Sports ───────────────────────────────────────────────────────────
    if (Array.isArray(data.sports) && data.sports.length > 0) points += 15;

    // ── Education ────────────────────────────────────────────────────────
    const edu = data.education || {};

    // Core education completion: schoolName + highestLevel + marksValue = +100
    const eduCoreComplete =
      edu.schoolName && edu.schoolName.trim() !== '' &&
      edu.highestLevel && edu.highestLevel.trim() !== '' &&
      edu.marksValue && String(edu.marksValue).trim() !== '';
    if (eduCoreComplete) points += 100;

    // Address filled
    if (edu.address && edu.address.trim() !== '') points += 10;

    // Year of passing filled
    if (edu.yearOfPassing && String(edu.yearOfPassing).trim() !== '') points += 10;

    // Subjects filled
    if (Array.isArray(edu.subjects) && edu.subjects.length > 0) points += 20;

    // Electives filled
    if (Array.isArray(edu.electives) && edu.electives.length > 0) points += 10;

    // ── Persist to state ─────────────────────────────────────────────────
    setUserProfile(prev => ({ ...prev, exPoints: points }));

    return points;
  }, [userProfile]);

  /**
   * updateUserProfile(updates)
   * Merges partial updates into the userProfile state.
   * Automatically recalculates exPoints after every update.
   *
   * @param {Partial<DEFAULT_USER_PROFILE>} updates
   */
  const updateUserProfile = useCallback(async (updates) => {
    // 1. Update the local React state instantly
    setUserProfile(prev => {
      const merged = { ...prev, ...updates };
      // Deep-merge education sub-object if provided
      if (updates.education) {
        merged.education = { ...prev.education, ...updates.education };
      }
      return merged;
    });
    
    // 2. Re-run XP calculation after state settles (next tick)
    setTimeout(() => {
      setUserProfile(prev => {
        const points = calculateExPoints(prev);
        return { ...prev, exPoints: points };
      });
    }, 0);

    // 3. Save permanently to Firebase Firestore
    if (auth?.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, updates, { merge: true });
      } catch (error) {
        console.error("Error saving to Firebase:", error);
      }
    }
  }, [calculateExPoints]);

  /**
   * markNotificationRead(notifId)
   * Marks a single notification as read.
   *
   * @param {string} notifId
   */
  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, isRead: true } : n)
    );
  }, []);

  /**
   * markAllNotificationsRead()
   * Marks all notifications as read.
   */
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  /**
   * incrementSessions()
   * Increments the sessionsBooked counter on the userProfile by 1.
   */
  const incrementSessions = useCallback(() => {
    setUserProfile(prev => ({ ...prev, sessionsBooked: (prev.sessionsBooked || 0) + 1 }));
  }, []);

  /**
   * submitBooking(studentId, bookingDetails)
   * Saves a booking record to the student's userProfile bookings array
   * AND pushes an admin notification with the student name, transaction ID, and amount.
   *
   * @param {string} studentId - The student's ID or name (used for admin notification)
   * @param {{ date: string, timeSlot: string, amount: number, transactionId: string, counsellorName: string }} bookingDetails
   */
  const submitBooking = useCallback((studentId, bookingDetails) => {
    const { date, timeSlot, amount, transactionId, counsellorName } = bookingDetails;

    // Build the booking record
    const newBooking = {
      id: `booking-${Date.now()}`,
      studentId: String(studentId || ''),
      date: String(date || ''),
      timeSlot: String(timeSlot || ''),
      amount: Number(amount || 0),
      transactionId: String(transactionId || ''),
      counsellorName: String(counsellorName || ''),
      bookedAt: new Date().toISOString(),
      status: 'pending_verification',
    };

    // 1. Save booking to userProfile
    setUserProfile(prev => ({
      ...prev,
      sessionsBooked: (prev.sessionsBooked || 0) + 1,
      bookings: [...(Array.isArray(prev.bookings) ? prev.bookings : []), newBooking],
    }));

    // 2. Push admin notification
    const adminNotif = {
      id: `notif-booking-${Date.now()}`,
      type: 'booking_payment',
      title: `💳 New Booking: ${String(studentId || 'Student')}`,
      message: `Student: ${String(studentId || 'Unknown')} | Counsellor: ${String(counsellorName || 'N/A')} | Date: ${String(date || '')} ${String(timeSlot || '')} | Amount: ₹${Number(amount || 0)} | Transaction ID: ${String(transactionId || '')}`,
      isRead: false,
      priority: 'high',
      timestamp: new Date().toISOString(),
      actionLabel: 'Verify Payment',
      actionUrl: '/admin',
      // Structured fields for admin dashboard parsing
      studentName: String(studentId || ''),
      transactionId: String(transactionId || ''),
      amount: Number(amount || 0),
    };

    setNotifications(prev => [adminNotif, ...prev]);
  }, []);

  // ── INSTITUTION HELPERS ──────────────────────────────────────────────────

  /**
   * registerInstitution(data)
   * Registers a new institution with an auto-generated account number,
   * secure password, and calculated billing amount.
   *
   * @param {object} data - Institution form data
   * @returns {object} The newly created institution record
   */
  const registerInstitution = useCallback((data) => {
    const accountNumber = generateAccountNumber();
    const password = generateSecurePassword(13);
    const totalStudents = Number(data.totalStudents) || 0;
    const totalBill = totalStudents * 200;

    const newInstitution = {
      id: `inst-${Date.now()}`,
      accountNumber,
      password,
      totalBill,
      registeredAt: new Date().toISOString(),
      // Scalar fields — all coerced to strings/numbers to prevent React Error #306
      schoolName: String(data.schoolName || ''),
      officialEmail: String(data.officialEmail || ''),
      phone: String(data.phone || ''),
      address: String(data.address || ''),
      maxEducationLevel: String(data.maxEducationLevel || ''),
      totalStaff: Number(data.totalStaff) || 0,
      totalStudents,
      // Contact persons — stored as flat strings
      contact1Name: String(data.contact1Name || ''),
      contact1Phone: String(data.contact1Phone || ''),
      contact2Name: String(data.contact2Name || ''),
      contact2Phone: String(data.contact2Phone || ''),
      contact3Name: String(data.contact3Name || ''),
      contact3Phone: String(data.contact3Phone || ''),
      // School counsellor
      counsellorName: String(data.counsellorName || ''),
      counsellorPhone: String(data.counsellorPhone || ''),
      counsellorEmail: String(data.counsellorEmail || ''),
    };

    setInstitutions(prev => [newInstitution, ...prev]);
    return newInstitution;
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
    institutions,

    // Student operations
    getCounsellorForStudent,
    getStudentsForCounsellor,
    assignStudentToCounsellor,
    reassignStudent,
    unassignStudent,
    updateStudent,
    addSessionToStudent,
    saveAssessmentResults,

    // Institution operations
    registerInstitution,

    // Counsellor operations
    updateCounsellor,

    // Auth
    mockLogin,

    // Derived
    stats,

    // ── Gamified profile ────────────────────────────────────────────────
    userProfile,
    updateUserProfile,
    calculateExPoints,
    incrementSessions,
    submitBooking,

    // ── Social / notifications ──────────────────────────────────────────
    socialFeed,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
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
