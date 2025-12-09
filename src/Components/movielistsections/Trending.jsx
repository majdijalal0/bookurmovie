import { ChevronRight , ChevronLeft } from 'react-feather';
import { useState , useEffect , useCallback, useRef } from 'react';
import { fetchMovies } from '../../api/movieAPI';
import { useNavigate } from 'react-router-dom';

export default function Trending(){

  const [movies , setMovies ] = useState([]);
  const [isLoading , setIsLoading] = useState(true);
  const [error , setError] = useState(null);
  const [curr , setCurr] = useState(0);
  const slideIntervalRef = useRef(null);
  const navigate = useNavigate();

  const next = useCallback(() => {
    setCurr(c => (c === movies.length - 1 ? 0 : c + 1));
  }, [movies.length]);

  const resetInterval = useCallback(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    slideIntervalRef.current = setInterval(next, 5000);
  }, [next]);

  const handlePrev = () => {
    setCurr(c => (c === 0 ? movies.length - 1 : c - 1));
    resetInterval();
  };

  const handleNext = () => {
    next();
    resetInterval();
  }

  useEffect(() => {
    resetInterval(); 
    return () => clearInterval(slideIntervalRef.current); 
  }, [resetInterval]);

  useEffect(() => {
    async function loadMovies(){
      try {
        setIsLoading(true);
        const data = await fetchMovies('/trending/movie/week',1);
        setMovies(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovies();
  }, []);

  if (isLoading) return <div className="text-white text-center p-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-10">Failed to load recommendations.</div>;
  if (!movies.length) return null;

  const displayedMovie = movies[curr];
  if(displayedMovie.id === 1218925){
    displayedMovie.backdrop_path = "https://image.tmdb.org/t/p/original/kfXgo2rMF1A19celCwLyQ4Xwpf8.jpg";
  }
  return (
    <div className="overflow-hidden relative h-[90vh]">

      <div className="absolute flex items-center justify-center w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-20"></div>

        <img
          key={curr}
          className="rounded-xl w-full h-full object-cover transition duration-3000 ease-in-out"
          src={`https://image.tmdb.org/t/p/original/${displayedMovie.backdrop_path}`}
          alt="poster"
        />
      </div>

      <div className="absolute bottom-20 left-2 p-12 max-w-xl z-50 sm:left-2 sm:p-4 sm:max-w-full">
        <h1 className="text-white text-5xl">{displayedMovie.original_title}</h1>
        <p className="text-white pt-5 text-xl">{displayedMovie.overview}</p>
        <button
          onClick={() => navigate(`/movie/${displayedMovie.id}`)}
          className="mt-5 bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition font-bold"
        >
          See Details
        </button>
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-40">
        <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition" onClick={handlePrev}>
          <ChevronLeft />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-40">
        <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full opacity-75 hover:opacity-100 transition" onClick={handleNext}>
          <ChevronRight />
        </button>
      </div>

      <div className="absolute flex items-center bottom-4 left-1/2 -translate-x-1/2 gap-4 z-40">
        {movies.map((_, i) => (
          <div
            key={i}
            className={`bg-white w-3 h-3 rounded-full ${curr === i ? 'p-3' : 'opacity-50'}`}
          ></div>
        ))}
      </div>

    </div>
  );
}
