import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const MOODS = [
  { label: 'Awful', emoji: '😢', value: 1 },
  { label: 'Bad', emoji: '😟', value: 2 },
  { label: 'Neutral', emoji: '😐', value: 3 },
  { label: 'Good', emoji: '🙂', value: 4 },
  { label: 'Great', emoji: '😄', value: 5 }
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogMood = async () => {
    if (!selectedMood || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in.');

      await addDoc(collection(db, 'users', user.uid, 'mood_logs'), {
        moodValue: selectedMood.value,
        moodLabel: selectedMood.label,
        timestamp: serverTimestamp()
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error logging mood:', err);
      setError('Failed to log mood. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-teal-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-3xl mb-4">
          ✨
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Thank you for checking in today!</h2>
        <p className="text-sm text-gray-500">Your mood has been safely logged.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 flex flex-col items-center text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Daily Mood Check-In</h2>
      <p className="text-sm text-gray-500 mb-6">How are you feeling today?</p>
      
      <div className="flex gap-4 mb-6">
        {MOODS.map((mood) => {
          const isSelected = selectedMood?.value === mood.value;
          return (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood)}
              title={mood.label}
              className={`text-3xl transition-all p-3 rounded-full 
                ${isSelected ? 'bg-teal-100 scale-125 ring-2 ring-teal-400' : 'bg-gray-50 hover:bg-teal-50 hover:scale-110 opacity-70'}
              `}
            >
              {mood.emoji}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleLogMood}
        disabled={!selectedMood || isSubmitting}
        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors w-full max-w-[200px]
          ${!selectedMood || isSubmitting 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
      >
        {isSubmitting ? 'Loading...' : 'Log Mood'}
      </button>
    </div>
  );
};

export default MoodTracker;
