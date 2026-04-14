import { useEffect, useState } from 'react';

export default function CollegeDatabase() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  // This runs when the page loads to go fetch the data from our new API
  useEffect(() => {
    fetch('/api/colleges')
      .then((res) => res.json())
      .then((data) => {
        setColleges(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center text-xl">Loading colleges from database... ⏳</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">College Database</h1>
      
      <div className="grid gap-4">
        {colleges.map((college, index) => (
          <div key={index} className="p-5 border rounded-lg shadow-sm bg-white text-black">
            {/* NOTE: Change 'name' and 'city' to whatever the actual labels are in your JSON file! */}
            <h2 className="text-xl font-bold">{college.name || college.CollegeName || "Unnamed College"}</h2>
            <p className="text-gray-600">{college.city || college.location || "Location not listed"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
