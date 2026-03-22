import Logo from '../assets/Logo.png';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div className="flex items-center gap-3">
              <img className="h-10 w-auto object-contain max-w-full" src={Logo} alt="Logo" />
              <Link to="/" className="text-white text-2xl font-bold tracking-tight">
                bookur<span className="text-red-500 font-extrabold">MOVIE</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink 
                className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-red-500' : 'text-gray-300 hover:text-white'}`} 
                to="/"
              >
                Home
              </NavLink>
              <NavLink 
                className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-red-500' : 'text-gray-300 hover:text-white'}`} 
                to="/explore"
              >
                Explore
              </NavLink>
              <NavLink 
                className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-red-500' : 'text-gray-300 hover:text-white'}`} 
                to="/watchlist"
              >
                Watchlist
              </NavLink>

              {user ? (
                <div className="flex items-center gap-6 ml-4 pl-6 border-l border-gray-700">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium hidden lg:block">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-800 text-gray-300 rounded-full px-6 py-2 text-sm font-bold hover:bg-gray-700 hover:text-white shadow-md transition-all border border-gray-700 hover:border-gray-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="ml-4 pl-6 border-l border-gray-700">
                  <button
                    className="bg-white text-gray-900 rounded-full px-8 py-2.5 text-sm font-bold hover:bg-gray-200 shadow-xl transition-all hover:scale-105"
                    onClick={openModal}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </nav>

            {/* Hamburger Button */}
            <div className="md:hidden flex items-center">
               <button onClick={toggleMobileMenu} className="text-gray-300 hover:text-white focus:outline-none">
                 {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-surface border-t border-gray-800">
            <nav className="flex flex-col px-4 pt-2 pb-6 space-y-4">
              <NavLink 
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-gray-800 text-red-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`} 
                to="/"
              >
                Home
              </NavLink>
              <NavLink 
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-gray-800 text-red-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`} 
                to="/explore"
              >
                Explore
              </NavLink>
              <NavLink 
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-gray-800 text-red-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`} 
                to="/watchlist"
              >
                Watchlist
              </NavLink>

              {user ? (
                <div className="pt-4 pb-2 border-t border-gray-700">
                  <div className="flex items-center px-3 mb-4 gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-base font-medium text-white">{user.name}</div>
                      <Link to="/profile" className="text-sm text-red-500 hover:text-red-400">View Profile</Link>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-700">
                  <button
                    className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 text-base font-bold hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openModal();
                    }}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

