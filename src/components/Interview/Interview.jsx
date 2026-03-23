import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useSpeechRecognition } from "react-speech-kit";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

const NewQuestion = ({ idx, questions }) => (
    <div className="text-2xl font-bold text-white mb-6 animate-in slide-in-from-left duration-500">
        <span className="text-indigo-500 mr-4">Q{idx + 1}.</span>
        {questions[idx].question}
    </div>
);

const NewResponse = ({ responses, idx }) => (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-8 animate-in fade-in duration-700">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Your Response</span>
        <p className="text-slate-300 italic">"{responses[idx].answer}"</p>
    </div>
);

function Interview() {
    const { id } = useParams();
    const navigateTo = useNavigate();
    const [value, setValue] = useState("");
    const [disableAll, setDisableAll] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [count, setCount] = useState(0);
    const videoRef = useRef(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");

    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => setValue(result),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: questionsData } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/iv/getQuestions`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/iv/getIV`,
                    { interviewId: id },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                
                const iv = res.data.data[0];
                const skills = iv.skills.toLowerCase();
                const filtered = questionsData.data.filter(q => 
                    q.type === 'basic' || (skills.includes(q.type === 'js' ? 'javascript' : q.type))
                );

                const finalSet = [filtered[0]]; // Always start with one basic
                while (finalSet.length < iv.count && filtered.length > finalSet.length) {
                    const rand = filtered[Math.floor(Math.random() * filtered.length)];
                    if (!finalSet.includes(rand)) finalSet.push(rand);
                }

                setQuestions(finalSet);
                setVideoUrl(finalSet[0].videoUrl);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [id]);

    const handleNext = () => {
        const currentResponses = [...responses, { question: questions[count].question, answer: value }];
        setResponses(currentResponses);
        setValue("");
        setIsListening(false);
        stop();
        
        if (count < questions.length - 1) {
            setCount(prev => prev + 1);
            setVideoUrl(questions[count + 1].videoUrl);
            setDisableAll(true);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const finalResponses = [...responses, { question: questions[count].question, answer: value }];
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/iv/uploadResponses`,
                { interviewId: id, answers: finalResponses },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            const evalRes = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/ai/checkAnswers`,
                { responses: finalResponses },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            localStorage.setItem("dataList", JSON.stringify(finalResponses));
            localStorage.setItem("scores", JSON.stringify(evalRes.data.data));
            navigateTo("/feedback");
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Initializing AI Interviewer...</div>;

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-80px)]">
                {/* Video Section */}
                <div className="lg:col-span-5 h-full flex flex-col">
                    <div className="glass-card flex-1 overflow-hidden relative group">
                        <video
                            ref={videoRef}
                            onEnded={() => setDisableAll(false)}
                            className="w-full h-full object-cover"
                            autoPlay
                            src={videoUrl}
                            crossOrigin="anonymous"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-red-500/80 text-white text-xs font-bold animate-pulse">RECORDING AI</span>
                        </div>
                    </div>
                </div>

                {/* Interaction Section */}
                <div className="lg:col-span-7 h-full flex flex-col">
                    <div className="glass-card flex-1 p-8 overflow-y-auto mb-6">
                        <div className="mb-12">
                            <NewQuestion idx={count} questions={questions} />
                            {responses.map((_, i) => (
                                <NewResponse key={i} idx={i} responses={responses} />
                            ))}
                        </div>

                        <div className="mt-auto">
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-600"
                                rows={4}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Start speaking or type your answer here..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-between items-center p-4 glass-card">
                        <div className="flex items-center gap-6">
                            <button
                                disabled={disableAll}
                                onClick={() => {
                                    if (isListening) {
                                        stop();
                                        setIsListening(false);
                                    } else {
                                        listen();
                                        setIsListening(true);
                                    }
                                }}
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-800 hover:bg-slate-700'} ${disableAll ? 'opacity-20 cursor-not-allowed' : ''}`}
                            >
                                <MicIcon sx={{ fontSize: 32, color: 'white' }} />
                            </button>
                            <div>
                                <p className="text-white font-bold">{isListening ? 'Listening...' : 'Microphone Off'}</p>
                                <p className="text-slate-500 text-sm">Question {count + 1} of {questions.length}</p>
                            </div>
                        </div>

                        {count === questions.length - 1 ? (
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting || disableAll}
                                className="btn-premium px-12 text-white h-14"
                            >
                                {isSubmitting ? 'Evaluating Output...' : 'Final Submit'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleNext}
                                disabled={disableAll}
                                className="btn-premium px-12 text-white h-14"
                            >
                                Next Question
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Interview;
