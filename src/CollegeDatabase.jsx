import React, { useState, useEffect } from 'react';

const STYLES = `
  .cdb-root { font-family: 'DM Sans', sans-serif; background: var(--cream, #FDF6EC); min-height: 100vh; padding: 40px 20px; color: var(--dark, #1C1208); }
  .cdb-header { max-width: 1200px; margin: 0 auto 40px; text-align: center; }
  .cdb-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 48px); margin-bottom: 12px; color: var(--dark); }
  .cdb-title span { color: var(--saffron, #E8650A); font-style: italic; }
  .cdb-subtitle { color: var(--muted, #7A6248); font-size: 16px; max-width: 600px; margin: 0 auto; line-height: 1.6; }
  
  .cdb-search-bar { max-width: 800px; margin: 0 auto 40px; display: flex; gap: 12px; background: white; padding: 12px; border-radius: 50px; box-shadow: 0 8px 32px rgba(28,18,8,0.06); border: 1px solid var(--border, #E8DFD1); }
  .cdb-search-input { flex: 1; border: none; outline: none; font-size: 16px; padding: 0 16px; font-family: inherit; background: transparent; }
  .cdb-search-btn { background: linear-gradient(135deg, var(--saffron, #E8650A), var(--gold, #F0A500)); color: white; border: none; padding: 12px 32px; border-radius: 50px; font-weight: 700; cursor: pointer; transition: 0.2s; }
  .cdb-search-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(232,101,10,0.3); }

  .cdb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }
  .cdb-card { background: white; border-radius: 20px; overflow: hidden; border: 1px solid var(--border, #E8DFD1); box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: 0.3s; display: flex; flex-direction: column; }
  .cdb-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(28,18,8,0.1); border-color: var(--saffron, #E8650A); }
  .cdb-card-img { width: 100%; height: 180px; object-fit: cover; background: var(--parchment, #F5EDD8); }
  .cdb-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
  .cdb-card-location { font-size: 12px; font-weight: 700; color: var(--muted, #7A6248); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .cdb-card-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--dark); margin-bottom: 16px; line-height: 1.3; }
  
  .cdb-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .cdb-stat-box { background: var(--cream, #FDF6EC); padding: 10px; border-radius: 12px; border: 1px solid rgba(61,34,5,0.06); }
  .cdb-stat-label { font-size: 11px; color: var(--muted); margin-bottom: 4px; font-weight: 600; }
  .cdb-stat-value { font-size: 14px; font-weight: 700; color: var(--teal, #0A5C63); }
  .cdb-stat-value.highlight { color: var(--saffron, #E8650A); }

  .cdb-card-footer { margin-top: auto; border-top: 1px solid rgba(61,34,5,0.06); padding-top: 16px; display: flex; justify-content: space-between; align-items: center; }
  .cdb-tag { background: rgba(10,92,99,0.08); color: var(--teal, #0A5C63); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .cdb-link { color: var(--saffron, #E8650A); font-weight: 700; font-size: 13px; text-decoration: none; }

  .cdb-loader { text-align: center; padding: 60px; color: var(--muted); font-weight: 600; font-size: 18px; grid-column: 1 / -1; }
  .cdb-pagination { display: flex; justify-content: center; gap: 12px; margin-top: 40px; align-items: center; }
  .cdb-page-btn { padding: 10px 20px; border: 2px solid var(--border); background: white; border-radius: 50px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .cdb-page-btn:hover:not(:disabled) { border-color: var(--saffron); color: var(--saffron); }
  .cdb-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function CollegeDatabase() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // Triggers the actual fetch
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch data whenever 'query' or 'page' changes
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        // Replace this URL with your actual API endpoint from Step 2
        const response = await fetch(`/api/colleges?search=${query}&page=${page}&limit=12`);
        const data = await response.json();
        
        setColleges(data.colleges || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
        // Fallback Mock Data so you can see the UI working immediately
        setColleges([
          { _id: '1', name: "Rashtreeya Vidyalaya College of Engineering", displayLocation: "Bengaluru", type: "Private, Autonomous", tuitionFee: "₹2.75 Lakhs/Yr", averagePackage: "11 LPA", highestPackage: "80 LPA", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600" },
          { _id: '2', name: "SDM College of Business Management", displayLocation: "Mangaluru", type: "Private", tuitionFee: "₹50,000/Yr", averagePackage: "6 LPA", highestPackage: "18 LPA", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600" }
        ]);
        setTotalPages(1);
      }
      setLoading(false);
    };

    fetchColleges();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    setQuery(search);
  };

  return (
    <div className="cdb-root">
      <div className="cdb-header">
        <h1 className="cdb-title">VidyaVantage <span>College Explorer</span></h1>
        <p className="cdb-subtitle">Search through our database of thousands of Indian institutions. Filter by placement records, fees, and real-world ROI.</p>
      </div>

      <form className="cdb-search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          className="cdb-search-input" 
          placeholder="Search by college name, city, or stream..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="cdb-search-btn">Search Database</button>
      </form>

      <div className="cdb-grid">
        {loading ? (
          <div className="cdb-loader">⏳ Querying 37MB Database...</div>
        ) : colleges.length === 0 ? (
          <div className="cdb-loader">No colleges found. Try a different search.</div>
        ) : (
          colleges.map((college) => (
            <div key={college._id} className="cdb-card">
              <img 
                src={college.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600"} 
                alt={college.name} 
                className="cdb-card-img" 
              />
              <div className="cdb-card-body">
                <div className="cdb-card-location">📍 {college.displayLocation || college.location}</div>
                <div className="cdb-card-name">{college.name}</div>
                
                <div className="cdb-stats-grid">
                  <div className="cdb-stat-box">
                    <div className="cdb-stat-label">Average Pkg</div>
                    <div className="cdb-stat-value highlight">{college.averagePackage || 'N/A'}</div>
                  </div>
                  <div className="cdb-stat-box">
                    <div className="cdb-stat-label">Highest Pkg</div>
                    <div className="cdb-stat-value">{college.highestPackage || 'N/A'}</div>
                  </div>
                  <div className="cdb-stat-box">
                    <div className="cdb-stat-label">Tuition Fee</div>
                    <div className="cdb-stat-value" style={{color: 'var(--dark)'}}>{college.tuitionFee || 'N/A'}</div>
                  </div>
                  <div className="cdb-stat-box">
                    <div className="cdb-stat-label">Institution Type</div>
                    <div className="cdb-stat-value" style={{color: 'var(--dark)'}}>{college.type || 'N/A'}</div>
                  </div>
                </div>

                <div className="cdb-card-footer">
                  <span className="cdb-tag">{college.accreditation || 'Recognized'}</span>
                  <a href={college.websiteUrl || college.url || '#'} target="_blank" rel="noopener noreferrer" className="cdb-link">
                    Visit Website →
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="cdb-pagination">
          <button 
            className="cdb-page-btn" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
          >
            ← Previous
          </button>
          <span style={{fontWeight: 700, color: 'var(--muted)'}}>Page {page} of {totalPages}</span>
          <button 
            className="cdb-page-btn" 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
