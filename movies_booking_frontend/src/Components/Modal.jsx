import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function SignUpModal({ isOpen, onClose, setUser }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email is invalid');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   
    if (!validateForm()) return;
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred during sign-up.');
      }

      const newUser = result;
      
      if (setUser) {
          setUser(newUser);
      }

      onClose();
      addToast(`Welcome ${newUser.name}! Your account has been created.`, 'success');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const resetModalState = () => {
    setFormData({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        phone: '' 
    });
    setError('');
};
const handleCloseAndReset = () => {
    resetModalState();
    onClose();
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseAndReset}>
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <button
            onClick={handleCloseAndReset}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900 text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your name"
              
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter password"
              
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm password"
              
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                className="text-red-500 hover:text-red-400 font-bold hover:underline"
                onClick={() => {
                  handleCloseAndReset();
                  navigate('/login');
                }}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}