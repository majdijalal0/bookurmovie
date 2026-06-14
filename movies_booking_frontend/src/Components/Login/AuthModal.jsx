import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const { setUser } = useAuth();
    const { addToast } = useToast();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [isSigningUp, setIsSigningUp] = useState(false);

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                addToast('Login successful!', 'success');
                onClose();
            } else {
                addToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            addToast('Connection error', 'error');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            addToast('Passwords do not match', 'error');
            return;
        }
        setIsSigningUp(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signup.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: signupData.name,
                    email: signupData.email,
                    password: signupData.password,
                    phone: signupData.phone
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                addToast('Account created successfully!', 'success');
                onClose();
            } else {
                addToast(data.message || 'Signup failed', 'error');
            }
        } catch (error) {
            addToast('Connection error', 'error');
        } finally {
            setIsSigningUp(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-lg glass-surface rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[101] border-t-4 border-t-red-600"
                    >
                        <div className="relative p-8 sm:p-12">
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <AnimatePresence mode="wait">
                                {mode === 'login' ? (
                                    <motion.div
                                        key="login"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    >
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Welcome Back</h2>
                                            <p className="text-gray-400">Sign in to continue your movie journey</p>
                                        </div>

                                        <form onSubmit={handleLogin} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                    <input
                                                        type="email"
                                                        value={loginEmail}
                                                        onChange={(e) => setLoginEmail(e.target.value)}
                                                        className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-red-600/10 transition-all"
                                                        placeholder="name@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
                                                    <button type="button" className="text-xs text-red-500 font-bold hover:underline font-Inter">Forgot?</button>
                                                </div>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                    <input
                                                        type="password"
                                                        value={loginPassword}
                                                        onChange={(e) => setLoginPassword(e.target.value)}
                                                        className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-red-600/10 transition-all"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoggingIn}
                                                className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white rounded-2xl font-black text-lg transition-all shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.4)] active:scale-[0.98]"
                                            >
                                                {isLoggingIn ? 'Authenticating...' : 'Sign In'}
                                            </button>
                                        </form>

                                        <div className="mt-10 pt-8 border-t border-gray-800/50 text-center">
                                            <p className="text-gray-500 font-medium">
                                                New here? <button onClick={() => setMode('signup')} className="text-red-500 font-black hover:underline underline-offset-4 ml-1">Create Account</button>
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="signup"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    >
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Join Us</h2>
                                            <p className="text-gray-400">Start your cinematic experience today</p>
                                        </div>

                                        <form onSubmit={handleSignup} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                        <input
                                                            type="text"
                                                            required
                                                            className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                                                            placeholder="John Doe"
                                                            value={signupData.name}
                                                            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                        <input
                                                            type="tel"
                                                            className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                                                            placeholder="+212..."
                                                            value={signupData.phone}
                                                            onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                    <input
                                                        type="email"
                                                        required
                                                        className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                                                        placeholder="user@example.com"
                                                        value={signupData.email}
                                                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                        <input
                                                            type="password"
                                                            required
                                                            className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                                                            placeholder="••••••••"
                                                            value={signupData.password}
                                                            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                                        <input
                                                            type="password"
                                                            required
                                                            className="w-full bg-gray-950/50 border border-gray-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                                                            placeholder="••••••••"
                                                            value={signupData.confirmPassword}
                                                            onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSigningUp}
                                                className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white rounded-xl font-black text-base transition-all shadow-[0_4px_20px_rgba(220,38,38,0.3)] active:scale-[0.98]"
                                            >
                                                {isSigningUp ? 'Creating Account...' : 'Sign Up Now'}
                                            </button>
                                        </form>

                                        <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
                                            <p className="text-gray-500 font-medium">
                                                Joined already? <button onClick={() => setMode('login')} className="text-red-500 font-black hover:underline underline-offset-4 ml-1">Log in here</button>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
