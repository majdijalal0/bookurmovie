import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        const apiUrl = `${import.meta.env.VITE_API_URL}/login.php`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful!');
                setUser(data.user);
                navigate('/profile'); 
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error connecting to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 font-Inter">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to book your next movie experience</p>
                </div>

                <div className="glass-surface p-8 rounded-3xl border-t-4 border-t-red-600 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <label className="block text-gray-400 text-sm font-bold uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs text-red-500 hover:underline">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder-gray-600"
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                                isLoading ? 'bg-gray-800 text-gray-500' : 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-red-500'
                            }`}
                        >
                            {isLoading ? 'Processing...' : 'Login'}
                        </motion.button>
                    </form>

                    {message && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 text-center text-red-400 font-medium"
                        >
                            {message}
                        </motion.p>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account? <Link to="/" className="text-red-500 font-bold hover:underline">Sign up for free</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-gray-600 hover:text-white transition-colors text-sm font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;