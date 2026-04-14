import React, { useState, useEffect } from 'react';

const CollegesPage = ({ navigate, currentUser, handleLogout, isAdmin, setModal }) => {
    const [collegeData, setCollegeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('all');

    useEffect(() => {
        fetch('/colleges.json')
            .then(res => res.json())
            .then(data => {
                setCollegeData(data);
                setFilteredData(data);
            })
            .catch(err => console.error("Database Error:", err));
    }, []);

    useEffect(() => {
        const filtered = collegeData.filter(c => {
            const nameMatch = c.name?.toLowerCase().includes(search.toLowerCase());
            const loc = (c.displayLocation || c.location || "").toLowerCase();
            const matchesLocation = location === 'all' || loc.includes(location.toLowerCase());
            return nameMatch && matchesLocation;
        });
        setFilteredData(filtered);
    }, [search, location, collegeData]);

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '40px' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .colleges-hero {
                    background: #1E2820; /* Matching your site's ink/moss color */
                    text-align: center; 
                    padding: 80px 20px; 
                    color: white;
                    border-radius: 24px;
                    max-width: 1200px;
                    margin: 0 auto 40px;
                }
                .filter-container { 
                    max-width: 1000px; 
                    margin: -70px auto 40px; 
                    background: white; 
                    padding: 24px; 
                    border-radius: 16px; 
                    box-shadow: 0 12px 40px rgba(30,40,32,0.1);
                    display: flex; 
                    gap: 15px; 
                    justify-content: center;
                    border: 1px solid rgba(74,124,89,0.15);
                }
                .college-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
                    gap: 30px; 
                    max-width: 1200px; 
                    margin: 0 auto 100px; 
                    padding: 0 20px;
                }
                .college-card { 
                    background: white; 
                    border-radius: 20px; 
                    overflow: hidden; 
                    border: 1px solid rgba(74,124,89,0.1); 
                    text-decoration: none; 
                    color: inherit;
                    transition: all 0.3s ease;
                }
                .college-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(30,40,32,0.13); }
                .card-img { width: 100%; height: 220px; object-fit: cover; }
                .card-body { padding: 24px; }
                .filter-input { 
                    padding: 14px 20px; 
                    border: 1.5px solid rgba(74,124,89,0.2); 
                    border-radius: 50px; 
                    width: 280px; 
                    font-family: inherit;
                    outline: none;
                }
                .filter-input:focus { border-color: #4A7C59; }
            `}} />

            <main>
                <div className="colleges-hero">
                    <h1 style={{ fontSize: '3.5rem', fontFamily: 'Fraunces, serif', marginBottom: '10px' }}>Top Colleges</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Your gateway to premier academic institutions.</p>
                </div>

                <div className="filter-container">
                    <input 
                        type="text" 
                        placeholder="🔍 Search by name..." 
                        className="filter-input"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="filter-input" onChange={(e) => setLocation(e.target.value)}>
                        <option value="all">📍 All Locations</option>
                        <option value="bengaluru">Bengaluru</option>
                        <option value="delhi">Delhi</option>
                    </select>
                </div>

                <div className="college-grid">
                    {filteredData.map((college, idx) => (
                        <a key={idx} href={`/college-details?name=${encodeURIComponent(college.name)}`} className="college-card">
                            <img src={college.image} className="card-img" alt={college.name} />
                            <div className="card-body">
                                <h2 style={{ fontSize: '1.4rem', color: '#1E2820', marginBottom: '8px' }}>{college.name}</h2>
                                <p style={{ color: '#4A7C59', fontWeight: 700 }}>📍 {college.displayLocation || college.location}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CollegesPage;