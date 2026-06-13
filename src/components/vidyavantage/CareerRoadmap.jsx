import React from 'react';

const roadmapData = [
  {
    step: "Step 1",
    title: "Grade 10 (Current)",
    focus: "Board Exams & Stream Selection",
    icon: "📚",
    status: "current"
  },
  {
    step: "Step 2",
    title: "Grade 11/12",
    focus: "Science PCB / Humanities",
    icon: "🔬",
    status: "upcoming"
  },
  {
    step: "Step 3",
    title: "Undergrad",
    focus: "BSc Psychology",
    icon: "🎓",
    status: "upcoming"
  },
  {
    step: "Step 4",
    title: "Postgrad",
    focus: "MSc Clinical Psychology",
    icon: "🎓",
    status: "upcoming"
  },
  {
    step: "Step 5",
    title: "Career",
    focus: "Licensed Psychologist",
    icon: "💼",
    status: "upcoming"
  }
];

export default function CareerRoadmap() {
  return (
    <div className="bg-[#F4F7FE] p-6 rounded-2xl mb-8">
      <div className="relative border-l-2 border-blue-500 ml-4 md:ml-6 space-y-8 pt-2 pb-2">
        {roadmapData.map((node, index) => (
          <div key={index} className="relative pl-8 md:pl-10">
            {/* Timeline Node Icon */}
            <div className={`absolute -left-[17px] top-2 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-[#F4F7FE] shadow-sm ${node.status === 'current' ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className="text-sm">{node.icon}</span>
            </div>
            
            {/* Card Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">{node.step}</span>
              <h4 className="text-lg font-bold text-gray-900">{node.title}</h4>
              <p className="text-gray-600 mt-2 text-sm font-medium">Focus: {node.focus}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
