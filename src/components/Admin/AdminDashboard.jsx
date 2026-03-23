import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AdminDashboard() {
    const [stats, setStats] = useState({ totalInterviews: 0, pendingSchedules: 0, totalCandidates: 0 });
    const [candidateName, setCandidateName] = useState('');
    const [candidateEmail, setCandidateEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStats(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch stats');
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/schedule`, 
                { candidateName, candidateEmail },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success(`Interview Scheduled! Token: ${res.data.token}`);
            setCandidateName('');
            setCandidateEmail('');
            fetchStats();
        } catch (err) {
            toast.error('Failed to schedule interview');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient">Admin Command Center</h1>
                        <p className="text-slate-400 mt-2">Manage your recruitment pipeline and candidate sessions</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 border-l-4 border-indigo-500">
                        <p className="text-slate-400 text-sm font-medium">Total Interviews</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.totalInterviews}</h3>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-purple-500">
                        <p className="text-slate-400 text-sm font-medium">Pending Schedules</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.pendingSchedules}</h3>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-pink-500">
                        <p className="text-slate-400 text-sm font-medium">Total Candidates</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.totalCandidates}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                           <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></span>
                           Schedule New Interview
                        </h2>
                        <form onSubmit={handleSchedule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Candidate Name</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Candidate Email</label>
                                <input
                                    type="email"
                                    className="input-premium"
                                    value={candidateEmail}
                                    onChange={(e) => setCandidateEmail(e.target.value)}
                                    placeholder="email@candidate.com"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={`btn-premium w-full text-white ${loading ? 'opacity-50' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Scheduling...' : 'Generate Interview Token'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card p-8 flex flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mb-6 shadow-2xl">
                             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                             </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Candidate Reports</h2>
                        <p className="text-slate-400 mb-8 max-w-sm">View detailed transcripts, scores, and skills for all interview sessions.</p>
                        <a href="/admin/reports" className="btn-premium w-full inline-block text-center">Open Reports Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
