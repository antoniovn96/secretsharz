import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const ParentPortalView = ({ userData, currentUser }) => {
  const { navigate } = useDashboard();
  const dynamicName = userData?.name || currentUser?.displayName || 'Parent';
  
  const [childData, setChildData] = useState(null);
  const [latestReport, setLatestReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchChildData = async () => {
      setIsLoading(true);
      try {
        const childId = userData?.childId;
        if (!childId) {
          // If no childId is linked, just handle it gracefully
          setErrorMsg("No student profile is currently linked to your account.");
          setIsLoading(false);
          return;
        }

        // Fetch child master record
        const childRef = doc(db, 'users', childId);
        const childSnap = await getDoc(childRef);
        
        if (!childSnap.exists()) {
          setErrorMsg("Linked student profile could not be found.");
          setIsLoading(false);
          return;
        }

        const cData = childSnap.data();
        setChildData(cData);

        const path = cData.primary_path || 'wellbeing';

        // Fetch latest published report based on path
        if (path === 'sen') {
          const iepRef = collection(db, 'users', childId, 'iep_records');
          const q = query(iepRef, orderBy('timestamp', 'desc'), limit(1));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setLatestReport({ type: 'sen', data: snapshot.docs[0].data() });
          }
        } else if (path === 'career') {
          const roadmapRef = collection(db, 'users', childId, 'career_roadmaps');
          const q = query(roadmapRef, orderBy('timestamp', 'desc'), limit(1));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setLatestReport({ type: 'career', data: snapshot.docs[0].data() });
          }
        } else {
          // Wellbeing - generic summary
          setLatestReport({ type: 'wellbeing', data: { sessionsAttended: 3 } });
        }

      } catch (err) {
        console.error("Error fetching child data:", err);
        setErrorMsg("An error occurred while loading your child's data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [userData]);

  const renderDynamicStatusCard = () => {
    if (!childData) return null;
    
    const path = childData.primary_path || 'wellbeing';
    const childName = childData.name || 'Your child';

    if (path === 'sen') {
      const goals = latestReport?.data?.goals || [];
      const accommodations = latestReport?.data?.accommodations || [];
      
      return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
            <span className="text-3xl bg-amber-100 p-2 rounded-xl">🏗️</span>
            <h2 className="text-2xl font-bold text-stone-800">Active Education Plan (IEP)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
                <span>🎯</span> Active Goals
              </h3>
              {goals.length > 0 ? (
                <ul className="space-y-3">
                  {goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="text-sm text-stone-600">{g}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-500 italic">No active goals drafted yet.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
                <span>🪪</span> Current Accommodations
              </h3>
              {accommodations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {accommodations.map((acc, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">
                      ✓ {acc}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 italic">No accommodations finalized yet.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (path === 'career') {
      const code = childData.careerDNA?.riasec?.code || childData.riasecCode || 'Pending';
      const exploreNotes = latestReport?.data?.phases?.phase2_explore || 'Roadmap drafting in progress.';
      
      return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-indigo-100 p-2 rounded-xl">🗺️</span>
              <h2 className="text-2xl font-bold text-stone-800">Career Roadmap Summary</h2>
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 text-center">
              <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Career DNA</span>
              <span className="block text-xl font-black text-indigo-600">{code}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span>🎯</span> Top Career Matches (Phase 1 & 2)
            </h3>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
              <p className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">
                {exploreNotes}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Wellbeing
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
          <span className="text-3xl bg-teal-100 p-2 rounded-xl">🌿</span>
          <h2 className="text-2xl font-bold text-stone-800">Wellbeing Status</h2>
        </div>
        
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm text-teal-600">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">Session Attendance</h3>
            <p className="text-sm text-stone-600 font-medium">
              {childName} has securely attended <span className="font-bold text-teal-700">{latestReport?.data?.sessionsAttended || 0} sessions</span> this month.
            </p>
            <p className="text-xs text-stone-500 mt-2 italic">
              Note: Clinical session notes and daily mood logs remain strictly confidential between the student and their therapist.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-stone-200 flex flex-col p-6 shadow-sm z-10">
        <div className="mb-10 mt-2">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Secret Sharz</h2>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Parent Portal</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3.5 bg-stone-100 text-stone-800 font-bold rounded-2xl transition-all">
            <span className="text-xl">📊</span> Child Overview
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-stone-500 hover:bg-stone-100 hover:text-stone-700 font-semibold rounded-2xl transition-all">
            <span className="text-xl">📄</span> Published Reports
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-stone-500 hover:bg-stone-100 hover:text-stone-700 font-semibold rounded-2xl transition-all">
            <span className="text-xl">📅</span> Upcoming Meetings
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-stone-500 hover:bg-stone-100 hover:text-stone-700 font-semibold rounded-2xl transition-all">
            <span className="text-xl">✍️</span> Consent Forms
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight relative z-10">
              Welcome, {dynamicName}
            </h1>
            <p className="text-stone-300 text-lg font-medium relative z-10">
              Here is the latest secure update for <strong className="text-white">{childData?.name || 'your child'}</strong>.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-500 font-medium">Loading secure records...</p>
            </div>
          ) : errorMsg ? (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center shadow-sm">
              <div className="text-4xl mb-4 opacity-50">📂</div>
              <h3 className="text-lg font-bold text-red-800 mb-2">No Records Found</h3>
              <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Dynamic Status Column (Spans 2) */}
              <div className="lg:col-span-2 space-y-8">
                {renderDynamicStatusCard()}
              </div>

              {/* Action Items Column */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
                  <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                    <span className="text-rose-500">⚡</span> Action Items
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Placeholder Alert 1 */}
                    <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-stone-800 text-sm">Consent Required</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-wider">Due Today</span>
                      </div>
                      <p className="text-sm text-stone-600 font-medium mb-3">
                        Please review and sign the quarterly check-in consent form.
                      </p>
                      <button className="text-xs font-bold text-rose-600 hover:text-rose-800 uppercase tracking-wide transition-colors">
                        Review Form →
                      </button>
                    </div>

                    {/* Placeholder Alert 2 */}
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-stone-800 text-sm">Upcoming Meeting</span>
                        <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 uppercase tracking-wider">Next Week</span>
                      </div>
                      <p className="text-sm text-stone-600 font-medium mb-3">
                        Parent-Counsellor sync scheduled for Thursday at 4:00 PM.
                      </p>
                      <button className="text-xs font-bold text-stone-600 hover:text-stone-800 uppercase tracking-wide transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentPortalView;