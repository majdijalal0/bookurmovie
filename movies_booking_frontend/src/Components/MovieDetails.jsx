import { useParams , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetail } from "../api/movieAPI";
import { motion } from 'framer-motion';
import { BookmarkPlus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [isWatchlistActionLoading, setIsWatchlistActionLoading] = useState(false);
    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true); 
            try {
                const data = await fetchMovieDetail(id); 
                setMovie(data);
                

                if (user) {
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/get_watchlist.php`, {
                            credentials: 'include',
                        });
                        if (response.ok) {
                            const watchlist = await response.json();
                            if (watchlist.some(m => m.id === data.id)) {
                                setInWatchlist(true);
                            }
                        }
                    } catch (err) {
                        console.error("Failed to check watchlist status:", err);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
                setMovie(null); 
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchDetails();
        }
    }, [id]); 

    const handleBookNow = () => {
        navigate(`/book/${id}`, {
            state : {
                movieTitle : movie.title,
                movieImage : posterUrl,
            }
        });
    }

    const toggleWatchlist = async () => {
        if (!user) {
            addToast("Please login to add to watchlist", "info");
            navigate('/login');
            return;
        }

        setIsWatchlistActionLoading(true);

        if (inWatchlist) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/remove_from_watchlist.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ movie_id: movie.id }),
                });

                if (response.ok) {
                    setInWatchlist(false);
                    addToast("Removed from watchlist", "success");
                } else {
                    addToast("Failed to remove movie", "error");
                }
            } catch (error) {
                console.error("Error removing from watchlist:", error);
                addToast("Error connecting to server", "error");
            }
        } else {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/add_to_watchlist.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        movie_id: movie.id,
                        movie_title: movie.title || movie.original_title,
                        poster_path: movie.poster_path
                    }),
                });

                if (response.ok) {
                    setInWatchlist(true);
                    addToast("Added to watchlist", "success");
                } else {
                    const data = await response.json();
                    addToast(data.message || "Failed to add movie", "error");
                }
            } catch (error) {
                console.error("Error adding to watchlist:", error);
                addToast("Error connecting to server", "error");
            }
        }
        setIsWatchlistActionLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        </div>
    );
    if (!movie) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Movie not found</div>;
    
    const posterUrl = movie.poster_path
        ? `${BASE_IMAGE_URL}${movie.poster_path}`
        : 'placeholder_image_path.jpg';
        
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-Inter relative">

            <div className="absolute inset-0 z-0">
                <img 
                    src={`${BASE_IMAGE_URL}${movie.backdrop_path}`} 
                    alt="backdrop" 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-start mt-8">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full md:w-1/3 shrink-0"
                >
                    <img 
                        className="w-full rounded-2xl shadow-2xl shadow-red-900/20 border border-gray-800" 
                        src={posterUrl} 
                        alt={`${movie.title} poster`} 
                    />
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full md:w-2/3 flex flex-col pt-4"
                >
                    <h1 className="text-white text-5xl font-extrabold mb-4">{movie.title || movie.original_title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-300 font-medium mb-6">
                        <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">{movie.release_date?.split('-')[0]}</span>
                        <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                            ⭐ <span className="text-white font-bold">{movie.vote_average?.toFixed(1)}</span>
                        </span>
                        {movie.genres?.slice(0, 3).map(g => (
                            <span key={g.id} className="text-red-400">• {g.name}</span>
                        ))}
                    </div>
                    
                    <div className="glass-surface p-8 rounded-2xl mb-8">
                        <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={handleBookNow} 
                            className="bg-red-600 px-10 py-4 rounded-full text-xl font-bold text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105"
                        >
                            Book Tickets
                        </button>
                        
                        <button 
                            onClick={toggleWatchlist} 
                            disabled={isWatchlistActionLoading}
                            className={`flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 border ${
                                inWatchlist 
                                ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                                : 'bg-transparent text-white border-gray-600 hover:border-white'
                            } ${isWatchlistActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {inWatchlist ? (
                                <>
                                    <Check size={20} className="text-green-400" />
                                    Saved to Watchlist
                                </>
                            ) : (
                                <>
                                    <BookmarkPlus size={20} />
                                    Add to Watchlist
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}