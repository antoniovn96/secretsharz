import React, { useState } from 'react';
import { processIntake } from '../../services/intakeService';

const UnifiedIntakeForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1
    studentName: '',
    dob: '',
    gender: '',
    studentPhone: '',
    // Step 2
    parentName: '',
    parentEmail: '',
    schoolName: '',
    grade: '',
    // Step 3
    primaryConcern: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        profile: {
          name: formData.studentName,
          dob: formData.dob,
          gender: formData.gender,
          phone: formData.studentPhone
        },
        school: {
          schoolId: formData.schoolName,
          grade: formData.grade,
          board: ''
        },
        parent: {
          name: formData.parentName,
          email: formData.parentEmail,
          phone: ''
        },
        intake: {
          primaryConcern: formData.primaryConcern,
          referralSource: ''
        }
      };

      const masterId = await processIntake(null, payload);
      setSuccessId(masterId);
    } catch (err) {
      console.error(err);
      setError('An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Intake Successful</h2>
          <p className="text-gray-600 mb-6">The student's new ID has been generated.</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Student ID</p>
            <p className="text-xl font-mono font-bold text-blue-600">{successId}</p>
          </div>
          <button
            onClick={() => {
              setSuccessId(null);
              setStep(1);
              setFormData({
                studentName: '', dob: '', gender: '', studentPhone: '',
                parentName: '', parentEmail: '', schoolName: '', grade: '',
                primaryConcern: ''
              });
            }}
            className="mt-8 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Start New Intake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-xl w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Unified Intake Form</h2>
          <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Parent & School Info</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Lincoln High School"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10th Grade"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Support Routing</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Concern</label>
                <select
                  name="primaryConcern"
                  value={formData.primaryConcern}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Primary Concern...</option>
                  <option value="Mental Health & Wellbeing">Mental Health & Wellbeing</option>
                  <option value="Learning Support (SEN)">Learning Support (SEN)</option>
                  <option value="Career Guidance (VidyaVantage)">Career Guidance (VidyaVantage)</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Select the primary area of support required for the student. This will help us route to the correct specialist.
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 flex justify-between border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : step === 3 ? (
                'Submit Intake'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnifiedIntakeForm;
