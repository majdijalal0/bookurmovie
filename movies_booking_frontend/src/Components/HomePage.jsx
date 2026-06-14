import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { fetchMovies } from '../api/movieAPI';
import TrendingMovies from './movielistsections/TrendingMovies';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const filmstripY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies('/trending/movie/day');
        setTrendingMovies(data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 70, damping: 25 } }
  };

  const featuredMovie = trendingMovies[0];

  return (
    <div className="min-h-screen pt-20 pb-0 bg-[#0A0B0E] relative overflow-hidden flex flex-col">

      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-grain mix-blend-overlay opacity-[0.04] pointer-events-none z-50"></div>

      {/* Ambient theater lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#C5A059]/10 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-mesh pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[900px] h-[900px] bg-[#E31221]/15 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-mesh pointer-events-none" style={{ animationDelay: '3s' }}></div>

      <motion.div
        ref={heroRef}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 mt-16 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* ─── Left: Hero Copy ─── */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start justify-center text-left"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            {/* Now Showing badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E31221]/30 bg-[#E31221]/5 mb-8">
              <span className="w-2 h-2 bg-[#E31221] rounded-full animate-pulse-dot"></span>
              <span className="text-xs font-outfit font-bold uppercase tracking-[0.2em] text-[#E31221]">Now Showing</span>
            </motion.div>

            {/* Headline — editorial serif */}
            <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl lg:text-[88px] font-black tracking-[-0.03em] leading-[0.92] text-white mb-8 font-display">
              Tonight's&nbsp;film
              <br />
              is&nbsp;waiting
              <br />
              <span className="inline-flex items-center gap-4">
                for&nbsp;you
                <span className="inline-flex items-center justify-center border-[1px] border-[#E31221] rounded-full px-4 py-1 bg-[#E31221]/10 text-[#E31221] font-outfit font-black text-xl md:text-2xl lg:text-3xl leading-none animate-breathing-pill">
                  NOW
                </span>
              </span>
            </motion.h1>

            {/* Proof-based hook */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-12 max-w-lg leading-relaxed font-outfit">
              Every genre. Every night. One seat away.
            </motion.p>

            {/* ─── CTA with hover preview ─── */}
            <motion.div variants={itemVariants} className="mt-2 relative group">
              <Link
                to="/explore"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full px-10 py-5 bg-white text-[#0A0B0E] font-outfit font-bold text-lg uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              >
                <span>EXPLORE TONIGHT'S SHOWINGS</span>
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* ─── Right: Scrolling Filmstrip ─── */}
          <motion.div
            className="lg:col-span-5 relative overflow-hidden h-[520px] rounded-2xl border border-gray-800/50 bg-white/[0.01]"
            style={{ y: filmstripY }}
            variants={itemVariants}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E31221]/40 to-transparent z-10"></div>

            {/* Side perforations (film-strip aesthetic) */}
            <div className="absolute top-0 left-3 bottom-0 flex flex-col gap-4 py-7 z-10 pointer-events-none">
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
              ))}
            </div>
            <div className="absolute top-0 right-3 bottom-0 flex flex-col gap-4 py-7 z-10 pointer-events-none">
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
              ))}
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 pt-4 pb-3 flex items-center gap-3 border-b border-gray-800/50">
              <span className="w-2 h-2 bg-[#E31221] rounded-full animate-pulse-dot"></span>
              <span className="text-xs font-outfit font-bold uppercase tracking-[0.15em] text-gray-400">Now Playing</span>
              <span className="text-xs text-gray-600 ml-auto">{trendingMovies.length} films</span>
            </div>

            {/* Scrolling list */}
            {!loading && (
              <div className="absolute inset-x-0 top-[52px] bottom-0 overflow-hidden">
                <div className="animate-scroll-vertical will-change-transform">
                  {[...trendingMovies, ...trendingMovies].map((movie, idx) => (
                    <Link
                      key={`${movie.id}-${idx}`}
                      to={`/movie/${movie.id}`}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-white/[0.03] transition-colors duration-200 border-b border-white/[0.02]"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-9 h-[52px] object-cover rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-outfit font-bold text-sm truncate">{movie.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">9:00 PM • {movie.release_date?.substring(0, 4) || "2025"}</p>
                      </div>
                      <span className="text-xs text-[#C5A059] font-outfit font-bold">{movie.vote_average?.toFixed(1)}★</span>
                    </Link>
                  ))}
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0A0B0E] to-transparent pointer-events-none z-10"></div>
                {/* Top fade (on scroll) */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0A0B0E] to-transparent pointer-events-none z-10"></div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-10 max-w-[1400px] mx-auto z-10"></div>

      {/* Trending Movies Section */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full pb-20">
        <TrendingMovies />
      </div>
    </div>
  );
}
