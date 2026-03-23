import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Signup() {
    const navigateTo = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, { email, password });
            if (res.data.status) {
                toast.success('Account created! Please login.');
                navigateTo('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center premium-gradient p-4">
            <div className="glass-card w-full max-w-md p-8 animate-float">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gradient mb-2">Create Account</h1>
                    <p className="text-slate-400">Join Lisa Interviewer and start your journey</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="input-premium text-white"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="input-premium text-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-premium w-full text-white">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account? 
                    <button onClick={() => navigateTo('/')} className="text-indigo-400 hover:text-indigo-300 font-semibold ml-2">
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;