import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

function Feedback() {
    const navigateTo = useNavigate();
    const [responses, setResponses] = useState([]);
    const [scores, setScores] = useState([]);
    const [averageScore, setAverageScore] = useState(0);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("dataList") || "[]");
        const scoreData = JSON.parse(localStorage.getItem("scores") || "[]");
        
        setResponses(data);
        setScores(scoreData);

        if (scoreData.length > 0) {
            const total = scoreData.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
            setAverageScore((total / scoreData.length).toFixed(1));
        }
    }, []);

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-emerald-400';
        if (score >= 5) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gradient mb-4">Interview Feedback</h1>
                    <p className="text-slate-400 text-lg">Detailed analysis of your performance</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="glass-card p-8 md:col-span-1 flex flex-col items-center justify-center text-center">
                        <div className="text-slate-400 text-sm font-medium mb-2">Overall Score</div>
                        <div className={`text-6xl font-bold ${getScoreColor(averageScore)}`}>
                            {averageScore}
                        </div>
                        <div className="text-slate-500 text-xs mt-2">Scale of 1-10</div>
                    </div>

                    <div className="glass-card p-8 md:col-span-3">
                        <h2 className="text-2xl font-bold mb-4">Summary Verdict</h2>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            {averageScore >= 7 
                                ? "Excellent performance! You demonstrated strong technical knowledge and clear communication. Your answers were well-structured and showed depth in the core competencies required for this role."
                                : averageScore >= 5
                                ? "Good effort. You have a solid foundation but there are some areas where you could provide more detailed examples or technical depth. Focus on refining your explanations for complex concepts."
                                : "A learning opportunity. While you addressed the questions, we recommend more focus on technical fundamentals and practical coding scenarios. Review the specific feedback below for improvement."
                            }
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {responses.map((resp, i) => (
                        <div key={i} className="glass-card p-8 border-l-4 border-indigo-500">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Question {i + 1}</span>
                                    <h3 className="text-xl font-bold text-white">{resp.question}</h3>
                                </div>
                                <div className="ml-4 text-center">
                                    <span className="text-xs font-medium text-slate-500 uppercase block mb-1">Score</span>
                                    <span className={`text-3xl font-black ${getScoreColor(scores[i]?.score || 0)}`}>
                                        {scores[i]?.score || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-400 mb-3 border-b border-white/5 pb-2">Your Answer</h4>
                                    <p className="text-slate-300 italic">"{resp.answer || 'No answer recorded.'}"</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-400 mb-3 border-b border-white/5 pb-2">AI Critique</h4>
                                    <p className="text-slate-300">{scores[i]?.critique || "AI analysis in progress..."}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button 
                        onClick={() => {
                            localStorage.removeItem('dataList');
                            localStorage.removeItem('scores');
                            navigateTo('/dashboard');
                        }}
                        className="btn-premium text-white px-12"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Feedback;