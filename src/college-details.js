import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

const CollegeDetails = ({ currentUser, handleLogout, isAdmin, setModal }) => {
    const router = useRouter();
    const { name: targetName } = router.query;

    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCampus, setSelectedCampus] = useState('All Campuses');
    const [selectedLevel, setSelectedLevel] = useState('All Programs');
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [activeModalCourse, setActiveModalCourse] = useState(null);

    // --- NORMALIZATION LOGIC ---
    const normalizeCampus = (campusName, collegeName) => {
        let c = (campusName || "").trim().toLowerCase();
        let col = (collegeName || "").toLowerCase();
        if (c.includes("cms") || c.includes("business school")) return "CMS Business School";
        if (c.includes("global campus")) return "JAIN Global Campus";
        if (col.includes("pes")) {
            if (c.includes("electronic")) return "EC Campus (Electronic City)";
            if (c.includes("hanumantha")) return "HN Campus (Hanumanth Nagar)";
            return "RR Campus (Ring Road)";
        }
        return campusName ? campusName.trim() : "Main Campus";
    };

    const normalizeProgramLevel = (level) => {
        if (!level) return "Undergraduate";
        let lvl = level.toLowerCase();
        if (lvl.includes('10th') || lvl.includes('puc') || lvl.includes('diploma')) return 'Pre-University';
        if (lvl.includes('undergraduate') || lvl.includes('ug')) return 'Undergraduate';
        if (lvl.includes('postgraduate') || lvl.includes('pg')) return 'Postgraduate';
        return 'Undergraduate';
    };

    useEffect(() => {
        if (!targetName) return;

        fetch('https://firebasestorage.googleapis.com/v0/b/career-intelligence-system.firebasestorage.app/o/colleges.json?alt=media&token=cd33625c-ef8e-44f6-b9e6-026226a9df17')
            .then(res => res.json())
            .then(data => {
                const found = data.find(c => c.name === targetName);
                if (found && found.detailedCourses) {
                    found.detailedCourses.forEach(course => {
                        course.normalizedDept = course.department || "General Department";
                        course.normalizedCampus = normalizeCampus(course.campusName, found.name);
                        course.normalizedLevel = normalizeProgramLevel(course.programLevel);
                    });
                }
                setCollege(found);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [targetName]);

    if (loading) return <div style={{textAlign:'center', padding:'100px', fontSize:'20px', fontWeight:'bold'}}>Building Premium Insights...</div>;
    if (!college) return <div style={{textAlign:'center', padding:'100px'}}>College not found.</div>;

    // --- FILTERING LOGIC ---
    const filteredCourses = college.detailedCourses?.filter(c => {
        const passesCampus = (selectedCampus === 'All Campuses' || c.normalizedCampus === selectedCampus);
        const passesLevel = (selectedLevel === 'All Programs' || c.normalizedLevel === selectedLevel);
        const passesDept = (selectedDept === 'All Departments' || c.normalizedDept === selectedDept);
        return passesCampus && passesLevel && passesDept;
    }) || [];

    const uniqueCampuses = ['All Campuses', ...new Set(college.detailedCourses?.map(c => c.normalizedCampus))];
    const uniqueLevels = ['All Programs', ...new Set(college.detailedCourses?.map(c => c.normalizedLevel))];
    const uniqueDepts = ['All Departments', ...new Set(college.detailedCourses?.map(c => c.normalizedDept))];

    return (
        <div className="vv-root" style={{background: '#F8FAFC'}}>
            <Head><title>{college.name} | VidyaVantage</title></Head>
            
            <Header navigate={(path) => router.push(path)} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />

            <style dangerouslySetInnerHTML={{ __html: `
                .details-hero { background: linear-gradient(135deg, ${college.theme || '#0A2342'}, #1E3A8A); color: white; padding: 100px 5%; text-align: center; }
                .data-card { background: white; padding: 40px; border-radius: 16px; margin: -50px auto 40px; max-width: 1200px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
                .data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;}
                .data-item { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
                .course-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; background: white; cursor: pointer; transition: 0.3s; }
                .course-card:hover { border-color: #0A2342; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                .filter-select { padding: 12px; border-radius: 10px; border: 2px solid #cbd5e1; margin-right: 10px; font-weight: bold; color: #0A2342; min-width: 200px; }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
                .modal-content { background: white; padding: 40px; border-radius: 20px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
            `}} />

            <div className="details-hero">
                <h1 style={{fontSize: '3rem', margin: '0 0 15px'}}>{college.name}</h1>
                <p style={{background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '50px'}}>{college.location} • Est. {college.establishedYear}</p>
                {college.websiteUrl && (
                    <div style={{marginTop: '20px'}}>
                        <a href={college.websiteUrl} target="_blank" style={{background: '#D4AF37', color: '#0A2342', padding: '12px 25px', borderRadius: '50px', textDecoration: 'none', fontWeight: '900'}}>🌐 Visit Official Website</a>
                    </div>
                )}
            </div>

            <div className="data-card">
                <h2 style={{color: '#0A2342', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px'}}>📊 Institution Overview</h2>
                <div className="data-grid">
                    <div className="data-item"><span style={{fontSize:'0.8rem', fontWeight:800, color:'#64748b'}}>ACCREDITATION</span><div style={{fontSize:'1.2rem', fontWeight:800}}>{college.accreditation || 'N/A'}</div></div>
                    <div className="data-item"><span style={{fontSize:'0.8rem', fontWeight:800, color:'#64748b'}}>NIRF RANK</span><div style={{fontSize:'1.2rem', fontWeight:800}}>{college.nirfRanking || 'N/A'}</div></div>
                    <div className="data-item"><span style={{fontSize:'0.8rem', fontWeight:800, color:'#64748b'}}>AVG TUITION</span><div style={{fontSize:'1.2rem', fontWeight:800}}>{college.tuitionFee || 'N/A'}</div></div>
                    <div className="data-item"><span style={{fontSize:'0.8rem', fontWeight:800, color:'#64748b'}}>HOSTEL FEES</span><div style={{fontSize:'1.2rem', fontWeight:800}}>{college.hostelFee || 'N/A'}</div></div>
                </div>
            </div>

            <div className="data-card" style={{marginTop: '40px'}}>
                <h2 style={{color: '#0A2342'}}>🎯 Programs & Curriculums</h2>
                <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px'}}>
                    <select className="filter-select" onChange={(e) => setSelectedCampus(e.target.value)}>{uniqueCampuses.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    <select className="filter-select" onChange={(e) => setSelectedLevel(e.target.value)}>{uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}</select>
                    <select className="filter-select" onChange={(e) => setSelectedDept(e.target.value)}>{uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}</select>
                </div>

                {filteredCourses.map((course, idx) => (
                    <div key={idx} className="course-card" onClick={() => setActiveModalCourse(course)}>
                        <div>
                            <h3 style={{margin: 0, color: '#0A2342'}}>{course.courseName}</h3>
                            <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold'}}>{course.normalizedDept}</span>
                        </div>
                        <button style={{background: '#f1f5f9', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold'}}>View Details ➔</button>
                    </div>
                ))}
            </div>

            {/* Modal for Course Details */}
            {activeModalCourse && (
                <div className="modal-overlay" onClick={() => setActiveModalCourse(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setActiveModalCourse(null)} style={{position:'absolute', top:20, right:20, border:'none', fontSize:'24px', cursor:'pointer'}}>×</button>
                        <h2 style={{color: '#0A2342', fontSize: '2rem'}}>{activeModalCourse.courseName}</h2>
                        <p><strong>Fees:</strong> {activeModalCourse.fees}</p>
                        <p><strong>Duration:</strong> {activeModalCourse.duration}</p>
                        <hr />
                        <div style={{marginTop: '20px'}} dangerouslySetInnerHTML={{ __html: activeModalCourse.overview }} />
                        {activeModalCourse.curriculumHTML && (
                            <div style={{marginTop: '20px'}} dangerouslySetInnerHTML={{ __html: activeModalCourse.curriculumHTML }} />
                        )}
                    </div>
                </div>
            )}

            <Footer navigate={(path) => router.push(path)} currentUser={currentUser} handleLogout={handleLogout} setModal={setModal} />
        </div>
    );
};

export default CollegeDetails;