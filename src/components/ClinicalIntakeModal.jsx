import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ClinicalIntakeModal = ({ user, onComplete }) => {
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [presentingConcern, setPresentingConcern] = useState('');
  const [previousSupport, setPreviousSupport] = useState(false);
  
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emergencyName || !emergencyRelation || !emergencyPhone || !presentingConcern || !consent1 || !consent2 || !consent3) {
      return;
    }

    if (user && user.uid) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        intakeData: {
          emergencyName,
          emergencyRelation,
          emergencyPhone,
          presentingConcern,
          previousSupport
        },
        hasCompletedClinicalIntake: true
      }, { merge: true });
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  const isFormValid = emergencyName && emergencyRelation && emergencyPhone && presentingConcern && consent1 && consent2 && consent3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Clinical Intake & Consent</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Emergency Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Clinical Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Presenting Concern</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]" 
                value={presentingConcern} 
                onChange={e => setPresentingConcern(e.target.value)} 
                placeholder="Briefly describe what brings you to counselling..."
                required 
              />
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input type="checkbox" id="prevSupport" checked={previousSupport} onChange={e => setPreviousSupport(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <label htmlFor="prevSupport" className="text-sm font-medium text-gray-700">I have previously received psychological support or counselling.</label>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Informed Consent</h3>
            <p className="text-sm text-gray-500 mb-4">Please read and acknowledge the following statements to proceed.</p>
            
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input type="checkbox" id="c1" checked={consent1} onChange={e => setConsent1(e.target.checked)} className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0" required />
              <label htmlFor="c1" className="text-sm text-gray-700">I understand that counselling is a collaborative process.</label>
            </div>
            
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input type="checkbox" id="c2" checked={consent2} onChange={e => setConsent2(e.target.checked)} className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0" required />
              <label htmlFor="c2" className="text-sm text-gray-700">I consent that information shared remains confidential, EXCEPT where disclosure is required by Indian law (e.g., POCSO) or when there is an immediate risk of harm to self or others.</label>
            </div>
            
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input type="checkbox" id="c3" checked={consent3} onChange={e => setConsent3(e.target.checked)} className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0" required />
              <label htmlFor="c3" className="text-sm text-gray-700">I acknowledge that this platform offers psychological support, but is not an emergency psychiatric crisis service. I understand I may discontinue counselling at any time.</label>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 pt-4">
            <button 
              type="submit" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              disabled={!isFormValid}
            >
              Acknowledge & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicalIntakeModal;
