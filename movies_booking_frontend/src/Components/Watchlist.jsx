import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    const fetchWatchlist = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get_watchlist.php`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setWatchlist(data);
            } else {
                console.error("Failed to fetch watchlist");
                addToast("Failed to load watchlist", "error");
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            addToast("Error connecting to server", "error");
        } finally {
            setLoading(false);
        }
    };

    fetchWatchlist();
  }, [user, addToast]);

  const removeFromWatchlist = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/remove_from_watchlist.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ movie_id: id }),
        });

        if (response.ok) {
            const updated = watchlist.filter(movie => movie.id !== id);
            setWatchlist(updated);
            addToast("Removed from watchlist", "success");
        } else {
            addToast("Failed to remove movie", "error");
        }
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        addToast("Error connecting to server", "error");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Please log in to view your Watchlist</h2>
        <button onClick={() => navigate('/login')} className="bg-red-600 px-8 py-3 rounded-full text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-500/30">
          Login
        </button>
      </div>
    );
  }

  if (loading) {
      return (
          <div className="min-h-screen bg-gray-950 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          </div>
      );
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Your Watchlist is Empty</h2>
        <p className="text-gray-400 mb-8 max-w-md">Looks like you haven't added any movies to your watchlist yet. Explore our collection and find something great!</p>
        <Link to="/explore" className="bg-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-500/30">
          Explore Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8 border-l-4 border-red-500 pl-4">My Watchlist</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <motion.div 
              key={movie.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative group rounded-xl overflow-hidden glass-surface"
            >
              <Link to={`/movie/${movie.id}`} className="block">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <h3 className="text-white font-bold truncate">{movie.title}</h3>
                </div>
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWatchlist(movie.id);
                }}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                aria-label="Remove from Watchlist"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
