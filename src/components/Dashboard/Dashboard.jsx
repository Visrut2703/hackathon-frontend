import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

function Dashboard() {
    const navigateTo = useNavigate();
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [institutionName, setInstitutionName] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [questions, setQuestions] = useState(5);
    const [isSubmitting, setSubmitting] = useState(false);
    const [file, setFile] = useState(null);
    const uni = uuidv4();

    const handleFileInput = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            toast.error('Please upload your resume.');
            return;
        }

        setSubmitting(true);
        const pythonBaseUrl = import.meta.env.VITE_PYTHON_API_BASE_URL;
        const nodeBaseUrl = import.meta.env.VITE_API_BASE_URL;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const extractRes = await axios.post(`${pythonBaseUrl}/extract-text`, formData);
            const text = extractRes.data.text;

            const skillsRes = await axios.post(
                `${nodeBaseUrl}/ai/getSkills`, 
                { text },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            const skills = skillsRes.data.text;
            localStorage.setItem('languages', skills);
            localStorage.setItem('name', name);
            localStorage.setItem('interviewId', uni);

            await axios.post(
                `${nodeBaseUrl}/iv/saveIV`, 
                { interviewId: uni, skills, count: questions },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            toast.success('Interview Ready!');
            navigateTo(`/interview/${uni}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to process resume. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                    <h1 className="text-5xl font-bold text-gradient mb-6 leading-tight">
                        Elevate Your <br /> Interview Game.
                    </h1>
                    <p className="text-slate-400 text-lg mb-8">
                        Upload your resume, and let Lisa generate a tailored AI interview experience just for you.
                    </p>
                    <div className="flex gap-4 items-center">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                     <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">Joined by 1,000+ candidates</p>
                    </div>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <h2 className="text-xl font-semibold text-white mb-4">Interview Setup</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                            <input
                                type="text"
                                className="input-premium text-white"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Grad Year</label>
                                <input
                                    type="number"
                                    className="input-premium text-white"
                                    value={graduationYear}
                                    onChange={(e) => setGraduationYear(e.target.value)}
                                    placeholder="2024"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Questions</label>
                                <select 
                                    className="input-premium text-white px-2"
                                    value={questions}
                                    onChange={(e) => setQuestions(e.target.value)}
                                >
                                    {[3, 5, 7, 10].map(q => <option key={q} value={q} className="bg-slate-900">{q} Questions</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Resume (PDF)</label>
                            <div className="relative border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors">
                                <input
                                    type="file"
                                    onChange={handleFileInput}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf"
                                />
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        {file ? file.name : 'Click or drag to upload resume'}
                                    </p>
                                    <p className="text-xs text-slate-500">PDF only (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`btn-premium w-full text-white mt-4 ${isSubmitting ? 'opacity-50' : ''}`}
                        >
                            {isSubmitting ? 'Processing Resume...' : 'Start My Interview'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;