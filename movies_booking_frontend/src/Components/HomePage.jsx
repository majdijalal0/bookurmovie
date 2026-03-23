import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Tag, Zap } from 'lucide-react';
import TrendingMovies from './movielistsections/TrendingMovies';

export default function HomePage(){
  const destination = '/explore';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return(
    <div className='min-h-screen pt-24 pb-12 bg-gray-950 relative overflow-hidden flex flex-col font-Inter'>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <motion.div 
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className='text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-red-500 to-red-300'>
          Book your ticket for the movies <span className="text-white">Now</span>
        </motion.h1>
        
        <motion.h3 variants={itemVariants} className='text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl'>
          All your favorite movies available at the best prices, with an experience designed for true cinephiles.
        </motion.h3>

        <motion.div variants={itemVariants} className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12'>
          <div className='glass-surface p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform'>
            <div className="p-4 bg-red-500/20 rounded-full text-red-500">
               <Film size={32} />
            </div>
            <span className="text-xl font-semibold">10,000+ Movies</span>
          </div>
          
          <div className='glass-surface p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform'>
            <div className="p-4 bg-purple-500/20 rounded-full text-purple-400">
               <Tag size={32} />
            </div>
            <span className="text-xl font-semibold">Best Prices</span>
          </div>
          
          <div className='glass-surface p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform'>
            <div className="p-4 bg-blue-500/20 rounded-full text-blue-400">
               <Zap size={32} />
            </div>
            <span className="text-xl font-semibold">Instant Booking</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-20">
          <Link 
            to={destination} 
            className='inline-block bg-red-600 px-8 py-4 rounded-full text-xl font-bold text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105'
          >
            Start exploring
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative z-10 bg-gray-950 w-full pt-10 border-t border-gray-800/50">
        <TrendingMovies />
      </div>
    </div>
  )
}
