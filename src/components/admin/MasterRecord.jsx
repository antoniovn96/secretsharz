import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { COLLECTIONS } from '../../utils/constants';
import { assignStaffToStudent } from '../../services/intakeService';
import { ArrowLeft, User, FileText, Heart, Brain, Compass, CreditCard, ChevronDown } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'case_files', label: 'Case Files', icon: FileText },
  { id: 'mental_health', label: 'Mental Health', icon: Heart },
  { id: 'sen', label: 'SEN', icon: Brain },
  { id: 'career', label: 'Career (VidyaVantage)', icon: Compass },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function MasterRecord({ studentId, navigate, adminUser }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [staffList, setStaffList] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [assignForm, setAssignForm] = useState({ division: '', staffId: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.STUDENTS, studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching student');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffSnap = await getDocs(collection(db, COLLECTIONS.STAFF));
        const staff = staffSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setStaffList(staff);
      } catch (err) {
        console.error("Error fetching staff", err);
      }
    };
    fetchStaff();
  }, []);

  const handleAssign = async () => {
    if (!assignForm.division || !assignForm.staffId) {
      setError('Please select both division and staff');
      return;
    }
    setError('');
    setSuccessMsg('');
    setAssigning(true);
    try {
      // adminUser needs to have { role: 'super_admin', uid: ... }
      await assignStaffToStudent(adminUser, studentId, assignForm.division, assignForm.staffId);
      
      // Refresh student data
      const docRef = doc(db, COLLECTIONS.STUDENTS, studentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent({ id: docSnap.id, ...docSnap.data() });
      }
      setSuccessMsg('Staff assigned successfully');
      setAssignForm({ division: '', staffId: '' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error assigning staff');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>;
  }

  if (error && !student) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#F4F7FE] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-gray-800">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{student.profile?.name || 'Unknown Student'}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
                  {student.id}
                </span>
                {student.status === 'active' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>
                )}
                {student.status === 'onboarding' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Onboarding</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Grade {student.school?.grade || 'N/A'} • {student.school?.board || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {student.activeDivisions?.includes('mental_health') && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-sm font-medium">
                <Heart size={14} /> Mental Health
              </div>
            )}
            {student.activeDivisions?.includes('sen') && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                <Brain size={14} /> SEN
              </div>
            )}
            {student.activeDivisions?.includes('career') && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Compass size={14} /> VidyaVantage
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mt-6 border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Read-only Cards */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={18} className="text-indigo-500"/> Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.profile?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date of Birth</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.profile?.dob || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Gender</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium capitalize">{student.profile?.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.profile?.phone || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Parent Name</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.parent?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.parent?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.parent?.phone || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">School ID</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.school?.schoolId || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Grade</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.school?.grade || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Board</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.school?.board || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Intake Data</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Primary Concern</p>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">{student.intake?.primaryConcern || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Referral Source</p>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{student.intake?.referralSource || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Assignment Panel */}
            <div className="col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 relative z-10">Assignment Panel</h3>
                
                {/* Current Assignments */}
                <div className="mb-6 space-y-3 relative z-10">
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Assignments</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm p-2 rounded bg-gray-50">
                      <span className="text-gray-600">Career Coach</span>
                      <span className="font-medium text-gray-900">{student.assignedStaff?.career ? staffList.find(s => s.id === student.assignedStaff.career)?.name || student.assignedStaff.career : 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded bg-gray-50">
                      <span className="text-gray-600">Psychologist</span>
                      <span className="font-medium text-gray-900">{student.assignedStaff?.psych ? staffList.find(s => s.id === student.assignedStaff.psych)?.name || student.assignedStaff.psych : 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded bg-gray-50">
                      <span className="text-gray-600">SEN Specialist</span>
                      <span className="font-medium text-gray-900">{student.assignedStaff?.sen ? staffList.find(s => s.id === student.assignedStaff.sen)?.name || student.assignedStaff.sen : 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Assign New */}
                <div className="space-y-4 relative z-10 pt-4 border-t border-gray-100">
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assign Professional</h4>
                  
                  {error && <div className="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">{error}</div>}
                  {successMsg && <div className="p-2 bg-green-50 text-green-600 text-xs rounded border border-green-100">{successMsg}</div>}
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Division</label>
                    <div className="relative">
                      <select 
                        value={assignForm.division}
                        onChange={(e) => setAssignForm({...assignForm, division: e.target.value})}
                        className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                      >
                        <option value="">Select Division...</option>
                        <option value="career">Career (VidyaVantage)</option>
                        <option value="psych">Mental Health (Psychology)</option>
                        <option value="sen">SEN (Special Needs)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Staff Member</label>
                    <div className="relative">
                      <select 
                        value={assignForm.staffId}
                        onChange={(e) => setAssignForm({...assignForm, staffId: e.target.value})}
                        className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                      >
                        <option value="">Select Staff...</option>
                        {staffList.map(staff => (
                          <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <button
                    onClick={handleAssign}
                    disabled={assigning}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {assigning ? 'Assigning...' : 'Assign Staff'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-xl font-medium text-gray-900">Module Under Construction</h3>
            <p className="text-gray-500 mt-2">The {TABS.find(t => t.id === activeTab)?.label} view is being integrated.</p>
          </div>
        )}
      </div>
    </div>
  );
}
