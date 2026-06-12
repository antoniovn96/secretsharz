import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function DocumentVaultModal({ localUserData, onClose }) {
  const [uniqueCode, setUniqueCode] = useState(localUserData?.uniqueCode || '');

  useEffect(() => {
    const initializeCode = async () => {
      if (localUserData && !localUserData.uniqueCode) {
        const generatedCode = `VV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setUniqueCode(generatedCode);
        
        try {
          if (localUserData.uid) {
            const userRef = doc(db, 'users', localUserData.uid);
            await updateDoc(userRef, { uniqueCode: generatedCode });
          }
        } catch (error) {
          console.error("Error generating unique code:", error);
        }
      }
    };
    initializeCode();
  }, [localUserData]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 w-full max-w-2xl relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span>🔒</span> Secure Document Vault
          </h2>
        </div>

        <div className="mb-8">
          <div className="bg-blue-100 text-blue-800 font-mono text-lg px-4 py-2 rounded-full inline-block font-semibold mb-2">
            Student ID: {uniqueCode || 'Generating...'}
          </div>
          <p className="text-sm text-gray-600">
            All documents are encrypted and tagged with this ID for your privacy.
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-8 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-600 font-medium">Click or drag files here to upload (PDF, JPG, PNG)</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-800">10th Grade Marksheet</p>
                  <p className="text-xs text-gray-500">Uploaded on: Oct 12, 2025</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-800">Draft Statement of Purpose</p>
                  <p className="text-xs text-gray-500">Uploaded on: Nov 05, 2025</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                Pending Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
