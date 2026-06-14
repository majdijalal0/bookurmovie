import { useState, useEffect, useRef } from 'react';
import { fetchMovies } from '../../api/movieAPI';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

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
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    customPaging: i => (
      <div className="w-10 sm:w-16 h-[2px] bg-gray-800 transition-colors duration-500 overflow-hidden rounded-full">
        <div className="custom-dot-indicator w-full h-full bg-transparent"></div>
      </div>
    ),
    appendDots: dots => (
      <div className="mt-8 pt-4">
        <ul className="flex items-center justify-center gap-1 m-0 p-0 list-none"> {dots} </ul>
      </div>
    ),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  if (loading) return null;

  return (
    <div className="w-full max-w-[1440px] mx-auto py-12 px-6 sm:px-8 lg:px-12 font-outfit">
      
      <style>{`
        .slick-dots li { margin: 0; width: auto; height: auto; }
        .slick-dots li.slick-active .custom-dot-indicator {
          background-color: #E31221;
          box-shadow: 0 0 10px rgba(227,18,33,0.5);
        }
      `}</style>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:border-b border-gray-800 pb-6 gap-6 sm:gap-0">
        <h2 className="text-4xl md:text-5xl flex items-center gap-4">
          <div className="w-3 h-3 bg-[#E31221] rounded-full animate-pulse-dot"></div>
          <span className="font-outfit font-black text-white tracking-tight">Trending</span>
          <span className="font-outfit font-light italic text-gray-500">Now</span>
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={() => sliderRef.current?.slickPrev()} className="w-12 h-12 rounded-full border border-gray-700/50 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#C5A059]/50 hover:bg-[#C5A059]/10 transition-all duration-300 group backdrop-blur-md">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={() => sliderRef.current?.slickNext()} className="w-12 h-12 rounded-full border border-gray-700/50 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#C5A059]/50 hover:bg-[#C5A059]/10 transition-all duration-300 group backdrop-blur-md">
             <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      <div className="mx-[-12px]">
        <Slider ref={sliderRef} {...settings}>
          {movies.map((movie) => (
            <motion.div 
              key={movie.id} 
              className="px-[12px] pb-[40px] pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to={`/movie/${movie.id}`} className="block relative group rounded-2xl overflow-hidden border border-gray-800 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] aspect-[2/3] hover:border-gray-500 hover:shadow-[0_20px_40px_-10px_rgba(227,18,33,0.15)] transition-all duration-700 cursor-crosshair">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-2xl transform group-hover:scale-[1.05] transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  loading="lazy"
                />
                
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/50 to-transparent opacity-90 z-10 pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform translate-y-0 text-left transition-transform duration-500">
                  <h3 className="text-white font-outfit font-black text-2xl tracking-tight leading-tight line-clamp-2">{movie.title}</h3>
                </div>

                <div className="absolute inset-0 bg-[#0A0B0E]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full transform scale-90 group-hover:scale-100 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-3">
                     <span className="font-jetbrains font-bold text-sm tracking-widest text-[#C5A059]">
                       {movie.vote_average?.toFixed(1)}★
                     </span>
                     <span className="text-white/30 text-sm">|</span>
                     <span className="font-jetbrains font-bold text-sm tracking-widest text-white">
                       {movie.release_date?.substring(0,4) || "2024"}
                     </span>
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
