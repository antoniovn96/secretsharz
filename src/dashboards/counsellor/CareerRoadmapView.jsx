import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const CareerRoadmapView = ({ studentId, currentUser }) => {
  const { navigate } = useDashboard();
  
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Roadmap State
  const [roadmap, setRoadmap] = useState({
    phase1_unlock: '',
    phase2_explore: '',
    phase3_expand: '',
    phase4_inspire: '',
    phase5_ignite: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentRef = doc(db, 'users', studentId);
        const snapshot = await getDoc(studentRef);
        if (snapshot.exists()) {
          setStudentData(snapshot.data());
        } else {
          setSaveMessage({ text: "Student record not found.", type: "error" });
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleChange = (e) => {
    setRoadmap({ ...roadmap, [e.target.name]: e.target.value });
  };

  const handleSaveRoadmap = async (e) => {
    e.preventDefault();
    
    // Quick validation check
    const isAnyFieldFilled = Object.values(roadmap).some(val => val.trim() !== '');
    if (!isAnyFieldFilled) {
      setSaveMessage({ text: "Cannot save an empty roadmap.", type: "error" });
      return;
    }

    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });

    try {
      const providerId = auth.currentUser?.uid || currentUser?.uid || 'unknown_provider';
      
      const payload = {
        providerId,
        timestamp: serverTimestamp(),
        status: 'Published',
        phases: { ...roadmap }
      };

      await addDoc(collection(db, 'users', studentId, 'career_roadmaps'), payload);
      
      setSaveMessage({ text: "Career Roadmap securely published.", type: "success" });
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000);
      
    } catch (err) {
      console.error("Error saving roadmap:", err);
      setSaveMessage({ text: "Failed to publish roadmap.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const riasecCode = studentData?.careerDNA?.riasec?.code || studentData?.riasecCode || 'Pending';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Top Nav bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/provider/career')}
          className="text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-2 transition-colors"
        >
          <span>←</span> Back to Career Caseload
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {studentData?.name ? studentData.name.charAt(0) : 'S'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                {studentData?.name || 'Unknown Student'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-1"><span>🏫</span> {studentData?.schoolName || 'N/A'}</span>
                <span className="flex items-center gap-1"><span>🎓</span> {studentData?.grade || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-center min-w-[140px]">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Career DNA</p>
            <p className="text-2xl font-black text-indigo-600 tracking-widest">{riasecCode}</p>
          </div>
        </div>

        {/* Roadmap Builder Engine */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="mb-8 pb-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 mb-2">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl text-xl">🗺️</span> 
              Strategic Career Roadmap
            </h2>
            <p className="text-slate-500">Construct an actionable, multi-phase plan based on the student's RIASEC profile and aspirations.</p>
          </div>
          
          <form onSubmit={handleSaveRoadmap} className="space-y-8">
            
            {/* Phase 1: Unlock */}
            <div className="space-y-2 relative">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-indigo-500 hidden md:block"></div>
              <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Phase 1: Unlock <span className="text-sm font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">Self-Discovery</span>
              </label>
              <p className="text-sm text-slate-500">Notes on the student's RIASEC profile, core strengths, and intrinsic motivations.</p>
              <textarea 
                name="phase1_unlock" value={roadmap.phase1_unlock} onChange={handleChange}
                rows="3"
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="e.g. Student exhibits strong Enterprising and Social traits, suggesting a natural aptitude for leadership and human-centric roles..."
              />
            </div>

            {/* Phase 2: Explore */}
            <div className="space-y-2 relative">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-500 hidden md:block"></div>
              <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Phase 2: Explore <span className="text-sm font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">Career Matches</span>
              </label>
              <p className="text-sm text-slate-500">Identify 3-5 specific, actionable career paths that align with their profile.</p>
              <textarea 
                name="phase2_explore" value={roadmap.phase2_explore} onChange={handleChange}
                rows="3"
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="e.g. 1. Product Marketing Manager&#10;2. Management Consultant&#10;3. Organizational Psychologist"
              />
            </div>

            {/* Phase 3: Expand */}
            <div className="space-y-2 relative">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 hidden md:block"></div>
              <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Phase 3: Expand <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">Skill Development</span>
              </label>
              <p className="text-sm text-slate-500">Recommended courses, certifications, or high-leverage extracurriculars.</p>
              <textarea 
                name="phase3_expand" value={roadmap.phase3_expand} onChange={handleChange}
                rows="3"
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                placeholder="e.g. Enroll in Introduction to Psychology (Coursera). Join the school Debate Club to refine persuasion skills."
              />
            </div>

            {/* Phase 4: Inspire */}
            <div className="space-y-2 relative">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-amber-500 hidden md:block"></div>
              <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Phase 4: Inspire <span className="text-sm font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wide">Mentorship & Shadowing</span>
              </label>
              <p className="text-sm text-slate-500">Target professionals to connect with, informational interviews, or internships to pursue.</p>
              <textarea 
                name="phase4_inspire" value={roadmap.phase4_inspire} onChange={handleChange}
                rows="3"
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                placeholder="e.g. Arrange 15-minute informational interview with a local Marketing Director."
              />
            </div>

            {/* Phase 5: Ignite */}
            <div className="space-y-2 relative">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-rose-500 hidden md:block"></div>
              <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Phase 5: Ignite <span className="text-sm font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wide">College & Application Plan</span>
              </label>
              <p className="text-sm text-slate-500">Target universities, required standardized tests, and application timeline strategies.</p>
              <textarea 
                name="phase5_ignite" value={roadmap.phase5_ignite} onChange={handleChange}
                rows="3"
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
                placeholder="e.g. Target colleges: Delhi University (B.Com Hons), Ashoka University. Begin SAT/ACT prep by Summer."
              />
            </div>

            {/* Save Action */}
            <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between">
              {saveMessage.text ? (
                <div className={`p-4 rounded-xl font-semibold text-sm ${saveMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {saveMessage.text}
                </div>
              ) : <div></div>}

              <button 
                type="submit"
                disabled={isSaving}
                className={`px-8 py-4 rounded-xl font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:-translate-y-1'}`
                }
              >
                {isSaving ? 'Publishing securely...' : (
                  <><span>🚀</span> Publish Career Roadmap</>
                )}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default CareerRoadmapView;
