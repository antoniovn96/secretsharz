import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const CollegesPage = () => {
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
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Head>
                <title>Top Colleges | VidyaVantage</title>
            </Head>

            {/* Note: We REMOVED <Header /> and <Footer /> here because 
                Next.js automatically adds them from your _app.js layout */}

            <style dangerouslySetInnerHTML={{ __html: `
                .colleges-hero {
                    background: linear-gradient(135deg, #0A2342, #1E3A8A);
                    text-align: center; 
                    padding: 60px 20px; 
                    color: white;
                }
                .filter-container { 
                    max-width: 1200px; 
                    margin: -30px auto 40px; 
                    background: white; 
                    padding: 20px; 
                    border-radius: 16px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex; 
                    gap: 15px; 
                    flex-wrap: wrap; 
                    justify-content: center;
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
                    border-radius: 16px; 
                    overflow: hidden; 
                    border: 1px solid #e2e8f0; 
                    text-decoration: none; 
                    color: inherit;
                    transition: 0.3s;
                    display: flex;
                    flex-direction: column;
                }
                .college-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                .card-img { width: 100%; height: 200px; object-fit: cover; }
                .card-body { padding: 20px; flex-grow: 1; }
                .filter-input { 
                    padding: 12px 18px; 
                    border: 1px solid #ddd; 
                    border-radius: 10px; 
                    width: 250px; 
                    font-family: inherit;
                }
            `}} />

            <main>
                <div className="colleges-hero">
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Top Colleges</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Your gateway to premier academic institutions.</p>
                </div>

                <div className="filter-container">
                    <input 
                        type="text" 
                        placeholder="🔍 Search college name..." 
                        className="filter-input"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="filter-input" onChange={(e) => setLocation(e.target.value)}>
                        <option value="all">📍 All Locations</option>
                        <option value="bengaluru">Bengaluru</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="delhi">Delhi</option>
                    </select>
                </div>

                <div className="college-grid">
                    {filteredData.map((college, idx) => (
                        <a key={idx} href={`/college-details?name=${encodeURIComponent(college.name)}`} className="college-card">
                            <img src={college.image} className="card-img" alt={college.name} />
                            <div className="card-body">
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0A2342' }}>{college.name}</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>📍 {college.displayLocation || college.location}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CollegesPage;