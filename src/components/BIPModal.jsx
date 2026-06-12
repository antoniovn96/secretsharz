import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const BIPModal = ({ studentId, studentName, onClose }) => {
  const [targetBehaviour, setTargetBehaviour] = useState('');
  const [triggers, setTriggers] = useState('');
  const [interventionStrategies, setInterventionStrategies] = useState('');
  
  const [newTask, setNewTask] = useState('');
  const [tasksToAssign, setTasksToAssign] = useState([]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasksToAssign([
        ...tasksToAssign,
        { id: Date.now().toString(), text: newTask, status: 'todo' }
      ]);
      setNewTask('');
    }
  };

  const handleRemoveTask = (idToRemove) => {
    setTasksToAssign(tasksToAssign.filter(task => task.id !== idToRemove));
  };

  const handleSaveBIP = async () => {
    try {
      // First, save the private clinical data to the sub-collection
      await addDoc(collection(db, 'users', studentId, 'bip_records'), {
        targetBehaviour,
        triggers,
        interventionStrategies,
        timestamp: new Date().toISOString()
      });

      // Second, push the actionable homework to the student's main dashboard
      if (tasksToAssign.length > 0) {
        await updateDoc(doc(db, 'users', studentId), {
          roadmapTasks: arrayUnion(...tasksToAssign)
        });
      }

      alert('BIP Saved & Homework Pushed successfully!');
      onClose();
    } catch (error) {
      console.error("Error saving BIP: ", error);
      alert('Failed to save BIP.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl w-full max-w-3xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🧠 Behaviour Intervention Plan: {studentName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Clinical Plan Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Clinical Plan</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Behaviour</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                rows="2"
                placeholder="Specific behaviour to address..."
                value={targetBehaviour}
                onChange={(e) => setTargetBehaviour(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Triggers / Antecedents</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                rows="2"
                placeholder="What usually precedes the behaviour..."
                value={triggers}
                onChange={(e) => setTriggers(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intervention Strategies</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                rows="3"
                placeholder="Techniques and strategies to apply..."
                value={interventionStrategies}
                onChange={(e) => setInterventionStrategies(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Homework Assigner Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 pb-2">Homework Assigner</h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="New task for the student..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
              >
                Add Task
              </button>
            </div>

            {tasksToAssign.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 mt-3">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Pending Tasks to Assign:</h4>
                <ul className="space-y-2">
                  {tasksToAssign.map(task => (
                    <li key={task.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-gray-800 text-sm">{task.text}</span>
                      <button 
                        onClick={() => handleRemoveTask(task.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium px-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
            onClick={handleSaveBIP}
            className="px-6 py-2.5 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
          >
            Save & Push Homework
          </button>
        </div>
      </div>
    </div>
  );
};

export default BIPModal;
