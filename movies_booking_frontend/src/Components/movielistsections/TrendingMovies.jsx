import { useState, useEffect } from 'react';
import { fetchMovies } from '../../api/movieAPI';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrending = async () => {
      try {
        const data = await fetchMovies('/trending/movie/day');
        setMovies(data.slice(0, 10)); 
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };
    getTrending();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  if (loading) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-white border-l-4 border-red-500 pl-4">Trending Now</h2>
      <div className="mx-[-10px]">
        <Slider {...settings}>
          {movies.map((movie) => (
            <motion.div 
              key={movie.id} 
              className="px-[10px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/movie/${movie.id}`} className="block relative group rounded-xl overflow-hidden glass-surface">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg truncate">{movie.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </span>
                    <button className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold hover:bg-red-500 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
