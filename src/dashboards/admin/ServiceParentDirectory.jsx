import React, { useEffect, useMemo, useState } from 'react';
import { HeartHandshake, BriefcaseBusiness, Brain, Users } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import ParentDirectoryTable from './ParentDirectoryTable';
import ParentDetailPanel from './ParentDetailPanel';

const META = {
  career: { label: 'Career Guidance', path: 'Career', icon: BriefcaseBusiness, tone: 'emerald' },
  wellbeing: { label: 'Counselling & Wellbeing', path: 'Wellbeing', icon: HeartHandshake, tone: 'violet' },
  sen: { label: 'SEN / Learning Support', path: 'SEN', icon: Brain, tone: 'amber' },
};

export default function ServiceParentDirectory({ service = 'career', theme = 'light' }) {
  const meta = META[service] || META.career;
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(query(collection(db, 'users'), where('role', '==', 'parent')), snapshot => {
      setParents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, error => { console.error('[ServiceParentDirectory] parent load failed:', error); setLoading(false); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'users'), where('role', '==', 'student')), snapshot => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => console.error('[ServiceParentDirectory] student load failed:', error));
    return () => unsubscribe();
  }, []);

  const rows = useMemo(() => {
    const byParent = new Map();
    students.filter(student => String(student?.path || '').toLowerCase() === meta.path.toLowerCase()).forEach(student => {
      const parentId = student.parentUid || student.parentId;
      if (!parentId) return;
      const children = byParent.get(parentId) || [];
      children.push(student);
      byParent.set(parentId, children);
    });
    return parents.map(parent => {
      const children = [...(byParent.get(parent.id) || [])];
      const linkedIds = Array.isArray(parent.linkedStudentIds) ? parent.linkedStudentIds : [];
      linkedIds.forEach(id => {
        const student = students.find(item => item.id === id);
        if (student && String(student?.path || '').toLowerCase() === meta.path.toLowerCase() && !children.some(item => item.id === id)) children.push(student);
      });
      return { ...parent, children, childrenCount: children.length };
    }).filter(parent => parent.children.length > 0);
  }, [parents, students, meta.path]);

  const Icon = meta.icon;
  const dark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.tone === 'violet' ? 'bg-violet-500/10 text-violet-500' : meta.tone === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}><Icon className="w-5 h-5" /></div>
            <div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{meta.label} · Parents</p><h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Parent Directory</h1></div>
          </div>
          <p className={`mt-3 text-sm max-w-3xl ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Canonical parent accounts are shown only when they have at least one linked child in this service. A parent is never duplicated between services.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${dark ? 'border-slate-800 bg-white/[0.02] text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}><Users className="w-4 h-4" />{rows.length} parents · {rows.reduce((sum, parent) => sum + parent.children.length, 0)} linked students</div>
      </div>
      <ParentDirectoryTable users={rows} isLoading={loading} onViewDetails={parent => { setSelected(parent); setOpen(true); }} theme={theme} />
      <ParentDetailPanel parent={selected} isOpen={open} onClose={() => { setOpen(false); window.setTimeout(() => setSelected(null), 300); }} />
    </div>
  );
}
