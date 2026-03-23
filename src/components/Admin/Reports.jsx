import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/reports`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReports(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <button 
                        onClick={() => window.history.back()} 
                        className="text-indigo-400 hover:text-indigo-300 font-medium mb-4 flex items-center"
                    >
                        ← Back to Command Center
                    </button>
                    <h1 className="text-4xl font-bold text-gradient">Candidate Reports Center</h1>
                </header>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Candidate ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Skills</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">questions</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reports.length > 0 ? reports.map((report) => (
                                    <tr key={report._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{report.interviewId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {report.skills?.split(',').map((skill, i) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-400">{report.count || 0} Questions</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                                Evaluated
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            {loading ? 'Crunching data...' : 'No reports found yet.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;
