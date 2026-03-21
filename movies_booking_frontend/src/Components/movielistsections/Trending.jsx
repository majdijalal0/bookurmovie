import { ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMovies } from '../../api/movieAPI';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [curr, setCurr] = useState(0);
  const slideIntervalRef = useRef(null);
  const navigate = useNavigate();

  const next = useCallback(() => {
    setCurr((c) => (c === movies.length - 1 ? 0 : c + 1));
  }, [movies.length]);

  const resetInterval = useCallback(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    slideIntervalRef.current = setInterval(next, 7000);
  }, [next]);

  const handlePrev = () => {
    setCurr((c) => (c === 0 ? movies.length - 1 : c - 1));
    resetInterval();
  };

  const handleNext = () => {
    next();
    resetInterval();
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(slideIntervalRef.current);
  }, [resetInterval]);

  useEffect(() => {
    async function loadMovies() {
      try {
        setIsLoading(true);
        const data = await fetchMovies('/trending/movie/week', 1);
        setMovies(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovies();
  }, []);

  if (isLoading) return <div className="text-white text-center p-10 min-h-[90vh] flex items-center justify-center">Loading Trending...</div>;
  if (error) return <div className="text-red-500 text-center p-10 min-h-[90vh] flex items-center justify-center">Failed to load trending movies.</div>;
  if (!movies.length) return null;

  const displayedMovie = movies[curr];
  const backdropPath = displayedMovie.id === 1218925
    ? "kfXgo2rMF1A19celCwLyQ4Xwpf8.jpg"
    : displayedMovie.backdrop_path;

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-gray-950 group">
      <AnimatePresence mode="wait">
        <motion.div
           key={curr}
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
           className="absolute inset-0"
        >
          <img
            className="w-full h-full object-cover"
            src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
            alt={displayedMovie.original_title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/60 to-transparent z-10 w-full md:w-3/4"></div>
        </motion.div>
      </AnimatePresence>


      <div className="absolute inset-0 z-30 flex flex-col justify-end px-6 pb-24 md:pb-32 md:px-16 lg:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${curr}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              {displayedMovie.original_title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6 text-sm md:text-base text-gray-300 font-medium">
              <span className="flex items-center text-yellow-500">
                <span className="mr-1">⭐</span> 
                {displayedMovie.vote_average ? displayedMovie.vote_average.toFixed(1) : 'NR'}
              </span>
              <span>•</span>
              <span className="uppercase tracking-wider font-bold text-red-500">Trending</span>
            </div>

            <p className="text-gray-300 text-sm md:text-lg mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-2xl drop-shadow-md">
              {displayedMovie.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/movie/${displayedMovie.id}`)}
                className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition duration-300 shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-1 w-fit"
              >
                <Play size={22} fill="currentColor" />
                <span className="text-lg">See Details</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>


      <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-40">
        <button 
          onClick={handlePrev}
          className="bg-gray-900/40 hover:bg-red-600 border border-gray-400/30 text-white w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-110 opacity-0 md:opacity-100 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronLeft size={28} />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-40">
        <button 
          onClick={handleNext}
          className="bg-gray-900/40 hover:bg-red-600 border border-gray-400/30 text-white w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-110 opacity-0 md:opacity-100 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronRight size={28} />
        </button>
      </div>


      <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center items-center gap-3">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurr(i); resetInterval(); }}
            className={`transition-all duration-500 rounded-full ${
              curr === i ? 'w-10 h-2.5 bg-red-600 shadow-lg shadow-red-600/50' : 'w-2.5 h-2.5 bg-gray-600/80 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
