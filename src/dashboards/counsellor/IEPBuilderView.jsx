import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const COMMON_ACCOMMODATIONS = [
  'Extra Time (25%)',
  'Extra Time (50%)',
  'Quiet Testing Area',
  'Calculator Use',
  'Visual Schedules',
  'Sensory Breaks',
  'Text-to-Speech Software',
  'Scribe / Writer',
];

const IEPBuilderView = ({ studentId, currentUser }) => {
  const { navigate } = useDashboard();
  
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // IEP Form State
  const [plop, setPlop] = useState('');
  const [goals, setGoals] = useState(['']);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  
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

  const handleAddGoal = () => setGoals([...goals, '']);
  const handleGoalChange = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };
  const handleRemoveGoal = (index) => {
    const newGoals = [...goals];
    newGoals.splice(index, 1);
    setGoals(newGoals);
  };

  const toggleAccommodation = (acc) => {
    if (selectedAccommodations.includes(acc)) {
      setSelectedAccommodations(selectedAccommodations.filter(a => a !== acc));
    } else {
      setSelectedAccommodations([...selectedAccommodations, acc]);
    }
  };

  const handleSaveIEP = async (e) => {
    e.preventDefault();
    if (!plop.trim() && goals.every(g => !g.trim()) && selectedAccommodations.length === 0) {
      setSaveMessage({ text: "Cannot save an empty IEP.", type: "error" });
      return;
    }

    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });

    try {
      const providerId = auth.currentUser?.uid || currentUser?.uid || 'unknown_provider';
      
      const iepPayload = {
        providerId,
        timestamp: serverTimestamp(),
        status: 'Active',
        plop,
        goals: goals.filter(g => g.trim() !== ''),
        accommodations: selectedAccommodations
      };

      await addDoc(collection(db, 'users', studentId, 'iep_records'), iepPayload);
      
      setSaveMessage({ text: "IEP saved securely to Master Record.", type: "success" });
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000);
      
    } catch (err) {
      console.error("Error saving IEP:", err);
      setSaveMessage({ text: "Failed to save IEP.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Top Nav bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/provider/educator')}
          className="text-slate-500 hover:text-amber-600 font-semibold flex items-center gap-2 transition-colors"
        >
          <span>←</span> Back to SEN Caseload
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {studentData?.name ? studentData.name.charAt(0) : 'S'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900">
                {studentData?.name || 'Unknown Student'}
              </h1>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                IEP Drafting
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1"><span>🏫</span> {studentData?.schoolName || 'N/A'}</span>
              <span className="flex items-center gap-1"><span>🎓</span> {studentData?.grade || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* IEP Builder Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <span className="bg-amber-100 text-amber-600 p-2 rounded-xl text-xl">🏗️</span> 
              Individualized Education Program
            </h2>
          </div>
          
          <form onSubmit={handleSaveIEP} className="space-y-10">
            
            {/* PLOP */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2 mb-1">
                <label className="text-lg font-bold text-slate-800">Present Levels of Performance (PLOP)</label>
              </div>
              <p className="text-sm text-slate-500 mb-2">Document the student's current academic and functional performance, including their strengths and areas requiring support.</p>
              <textarea 
                value={plop} onChange={(e) => setPlop(e.target.value)}
                rows="5"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="e.g. Student demonstrates strong verbal reasoning skills but struggles with written expression..."
              />
            </div>

            {/* SMART Goals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-lg font-bold text-slate-800">SMART Goals</label>
                  <p className="text-sm text-slate-500">By [Date], [Student] will [Action] with [Accuracy]% accuracy.</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <input 
                      type="text"
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="e.g. By December, student will independently use graphic organizers for essay planning with 80% accuracy."
                    />
                    {goals.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveGoal(index)}
                        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-0.5"
                        title="Remove Goal"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={handleAddGoal}
                className="text-amber-600 font-bold text-sm hover:text-amber-700 flex items-center gap-1 transition-colors mt-2"
              >
                <span>+</span> Add another goal
              </button>
            </div>

            {/* Accommodations */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-lg font-bold text-slate-800">Required Accommodations</label>
              <p className="text-sm text-slate-500 mb-3">Select the necessary structural or testing accommodations for this student.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {COMMON_ACCOMMODATIONS.map(acc => {
                  const isSelected = selectedAccommodations.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccommodation(acc)}
                      className={`p-4 rounded-xl border text-left font-semibold transition-all flex items-center justify-between
                        ${isSelected 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                      <span>{acc}</span>
                      {isSelected && <span className="text-emerald-500">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Action */}
            <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-between">
              {saveMessage.text ? (
                <div className={`p-4 rounded-xl font-semibold text-sm ${saveMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {saveMessage.text}
                </div>
              ) : <div></div>}

              <button 
                type="submit"
                disabled={isSaving}
                className={`px-8 py-4 rounded-xl font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${isSaving ? 'bg-amber-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:-translate-y-1'}`
                }
              >
                {isSaving ? 'Saving securely...' : (
                  <><span>🗄️</span> Save IEP to Master Record</>
                )}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default IEPBuilderView;
