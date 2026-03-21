import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-4 font-Inter">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center flex flex-col items-center gap-6"
      >
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-white">🎬</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mt-4">Scene Missing</h2>
        <p className="text-gray-400 max-w-md text-lg text-center mb-8">
          The page you're looking for has either wrapped production, or you're on the wrong set. Let's get you back.
        </p>

        <Link 
          to="/" 
          className="bg-red-600 px-8 py-4 rounded-full text-xl font-bold text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105"
        >
          Return to Box Office
        </Link>
      </motion.div>
    </div>
  );
}
