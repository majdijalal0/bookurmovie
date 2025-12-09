import Logo from '../assets/Logo.png';
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from './Modal';

export default function Header({user,setUser}) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex bg-red-800 justify-between gap-10 items-center shadow-md">
      <div className="flex items-center justify-center">
        <img className="h-23 pt-3" src={Logo} alt="Logo" />
        <h1 className="text-white text-xl">
          bookur<span className="text-gray-900 font-extrabold">MOVIE</span>
        </h1>
      </div>

      <nav className="flex p-5 gap-5 justify-between items-center">
        <NavLink className="text-white text-lg hover:text-gray-900" to="/">
          Home
        </NavLink>

        <NavLink className="text-white text-lg hover:text-gray-900" to="/explore">
          Explore
        </NavLink>

      

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-red-400"
            >
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span>{user.name}</span>
            </Link>
          </div>
        ) : (
          <button
            className="bg-white text-red-500 rounded-full p-3 text-lg font-bold hover:bg-gray-900 shadow-xl transition duration-300"
            onClick={openModal}
          >
            Sign up
          </button>
        )}
      </nav>
      <Modal isOpen={isModalOpen} onClose={closeModal} setUser={setUser} />
    </div>
  );
}
