import Logo from '../assets/Logo.png';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div className="flex items-center gap-3">
              <img className="h-10 w-auto object-contain" src={Logo} alt="Logo" />
              <Link to="/" className="text-white text-2xl font-bold tracking-tight">
                bookur<span className="text-red-500 font-extrabold">MOVIE</span>
              </Link>
            </div>


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
            

            <div className="md:hidden flex items-center">
               <button className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
               </button>
            </div>
          </div>
        </div>
      </header>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

