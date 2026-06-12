import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SOAPNoteModal = ({ studentId, studentName, onClose }) => {
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');

  const handleSaveNote = async () => {
    try {
      const noteData = {
        subjective,
        objective,
        assessment,
        plan,
        nextAppointment
      };
      await addDoc(collection(db, 'users', studentId, 'clinical_sessions'), {
        ...noteData,
        timestamp: new Date().toISOString()
      });
      alert('Note Saved & Signed successfully!');
      onClose();
    } catch (error) {
      console.error("Error saving note: ", error);
      alert('Failed to save note.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl w-full max-w-3xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📝 Session Note: {studentName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjective</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows="3"
              placeholder="Client's self-reported feelings and experiences..."
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows="3"
              placeholder="Clinician's objective observations..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows="3"
              placeholder="Synthesis of subjective and objective data..."
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows="3"
              placeholder="Next steps, interventions, homework..."
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={nextAppointment}
              onChange={(e) => setNextAppointment(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNote}
            className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save & Sign Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOAPNoteModal;
