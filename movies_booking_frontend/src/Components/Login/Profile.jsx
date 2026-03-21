import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { motion } from "framer-motion";
import ConfirmationModal from "../ConfirmationModal";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/get_bookings.php`, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setBookings(data);
          } else {
            console.error("Failed to fetch bookings");
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
      <button onClick={() => navigate('/login')} className="bg-red-600 px-6 py-2 rounded-lg text-white font-bold">Login</button>
    </div>
  );

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delete_booking.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingToDelete }),
      });
      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingToDelete));
        addToast('Booking deleted successfully.', 'success');
      } else {
        addToast('Failed to delete booking.', 'error');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      addToast('Error connecting to server.', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setBookingToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-Inter pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-surface p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-8 border-l-4 border-red-500"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
            <p className="text-gray-400 text-lg mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="bg-gray-800 px-4 py-1 rounded-full text-xs font-bold text-red-400 border border-gray-700 uppercase tracking-widest">Premium Member</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-800 text-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300 border border-gray-700"
          >
            Sign Out
          </button>
        </motion.div>

        <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl font-black text-white">Your Bookings</h2>
              <p className="text-gray-500 mt-2">Manage your upcoming movie experiences</p>
            </div>
        </div>

        <div className="flex flex-col gap-6">
            {loading ? (
              <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
              </div>
            ) : bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={booking.id} 
                  className="glass-effect p-6 rounded-2xl flex flex-col sm:flex-row gap-6 hover:border-gray-600 transition-all group"
                >
                  <div className="relative overflow-hidden rounded-xl h-48 w-full sm:w-32 flex-shrink-0">
                    <img src={booking.movie_image} alt={booking.movie_title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{booking.movie_title}</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                         <span className="w-2 h-2 rounded-full bg-red-500"></span>
                         Date: <span className="text-gray-200">{new Date(booking.booking_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                         <span className="w-2 h-2 rounded-full bg-red-500"></span>
                         Time: <span className="text-gray-200">{booking.show_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm col-span-2">
                         <span className="w-2 h-2 rounded-full bg-red-500"></span>
                         Seats: <span className="text-gray-200">{Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-white mt-4">${booking.total_price}</p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button 
                      onClick={() => openDeleteModal(booking.id)} 
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900/50 text-gray-500 hover:bg-red-600 hover:text-white transition-all shadow-inner"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <span className="text-[10px] font-bold text-gray-600 tracking-widest uppercase mb-1">Confirmed</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 glass-surface rounded-3xl border border-dashed border-gray-800">
                <p className="text-gray-500 text-xl font-medium">You have no active bookings.</p>
                <button onClick={() => navigate('/explore')} className="mt-4 text-red-500 font-bold hover:underline">Explore Movies</button>
              </div>
            )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBooking}
        title="Delete Booking?"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </div>
  );
}
