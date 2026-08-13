import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const EMPTY_ROADMAP = { phase1_unlock: '', phase2_explore: '', phase3_expand: '', phase4_inspire: '', phase5_ignite: '' };
const phases = [
  ['phase1_unlock', 'Phase 1: Unlock', 'Self-Discovery', 'RIASEC profile, strengths, interests and motivations.'],
  ['phase2_explore', 'Phase 2: Explore', 'Career Matches', '3–5 specific career pathways worth investigating.'],
  ['phase3_expand', 'Phase 3: Expand', 'Skill Development', 'Courses, certifications, projects and extracurricular development.'],
  ['phase4_inspire', 'Phase 4: Inspire', 'Mentorship & Shadowing', 'Professionals, informational interviews, shadowing or internships.'],
  ['phase5_ignite', 'Phase 5: Ignite', 'College & Applications', 'Target institutions, tests, prerequisites and application timeline.']
];

const CareerRoadmapView = ({ studentId, currentUser }) => {
  const { navigate } = useDashboard();
  const [studentData, setStudentData] = useState(null);
  const [roadmap, setRoadmap] = useState(EMPTY_ROADMAP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const snapshot = await getDoc(doc(db, 'students', studentId));
        if (snapshot.exists()) setStudentData(snapshot.data());
        else setMessage({ type: 'error', text: 'Student master record not found.' });
      } catch (error) {
        console.error('Error loading assigned student:', error);
        setMessage({ type: 'error', text: 'You are not authorised to access this student or the record could not be loaded.' });
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [studentId]);

  const handleSave = async event => {
    event.preventDefault();
    const providerId = auth.currentUser?.uid || currentUser?.uid;
    if (!providerId) return setMessage({ type: 'error', text: 'Your professional session has expired. Please sign in again.' });
    if (!Object.values(roadmap).some(value => value.trim())) return setMessage({ type: 'error', text: 'Please complete at least one roadmap phase before publishing.' });

    setSaving(true);
    setMessage(null);
    try {
      await addDoc(collection(db, 'students', studentId, 'career_roadmaps'), {
        providerId,
        status: 'Published',
        phases: { ...roadmap },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: 'Career roadmap securely published.' });
    } catch (error) {
      console.error('Error publishing career roadmap:', error);
      setMessage({ type: 'error', text: 'The roadmap could not be published. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>;

  const studentName = studentData?.name || studentData?.studentName || studentData?.profile?.name || 'Student';
  const school = studentData?.schoolName || studentData?.school?.name || studentData?.school?.schoolId || studentData?.school || 'N/A';
  const grade = studentData?.grade || studentData?.class || studentData?.school?.grade || 'N/A';
  const riasecCode = studentData?.careerDNA?.riasec?.code || studentData?.riasecCode || studentData?.careerAssessment?.riasecCode || 'Pending';

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 shadow-sm md:px-8">
        <button onClick={() => navigate(`/provider/career/case/${studentId}`)} className="font-semibold text-slate-500 hover:text-indigo-600">← Back to Student Case</button>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Career Roadmap Builder</span>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-5 py-8 md:px-8">
        <section className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
          <div className="flex items-center gap-5"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-black text-indigo-600">{studentName.charAt(0).toUpperCase()}</div><div><div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Student</div><h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{studentName}</h1><div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-500"><span>🏫 {school}</span><span>🎓 {grade}</span></div></div></div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-7 py-4 text-center"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">Career DNA</div><div className="mt-1 text-2xl font-black tracking-widest text-indigo-700">{riasecCode}</div></div>
        </section>

        {message && <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 border-b border-slate-100 pb-6"><h2 className="text-2xl font-black text-slate-900">🗺️ Strategic Career Roadmap</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">Build an actionable five-phase plan that translates the student's profile into concrete career-development steps.</p></div>
          <form onSubmit={handleSave} className="space-y-8">
            {phases.map(([key,title,badge,description]) => <div key={key}><label className="flex flex-wrap items-center gap-2 text-lg font-black text-slate-800">{title}<span className="rounded bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600">{badge}</span></label><p className="mt-1 text-sm text-slate-500">{description}</p><textarea name={key} value={roadmap[key]} onChange={event => setRoadmap(current => ({ ...current, [key]: event.target.value }))} rows={4} className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" placeholder={`Add notes for ${badge.toLowerCase()}…`} /></div>)}
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">{message ? <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.text}</div> : <div />}
              <button disabled={saving} type="submit" className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Publishing securely…' : '🚀 Publish Career Roadmap'}</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CareerRoadmapView;
