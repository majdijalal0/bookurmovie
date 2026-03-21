import MovieCard from './MovieCard'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchMovies, fetchGenres } from '../../api/movieAPI';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-gray-900/80 border border-gray-700 hover:border-red-500 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-110 flex items-center justify-center group"
      onClick={onClick}
    >
      <ChevronRight size={24} className="group-hover:text-white text-gray-300 transition-colors" />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-gray-900/80 border border-gray-700 hover:border-red-500 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-110 flex items-center justify-center group"
      onClick={onClick}
    >
      <ChevronLeft size={24} className="group-hover:text-white text-gray-300 transition-colors" />
    </div>
  );
};

export default function Recommended(){
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    const [ movies , setMovies ] = useState([])
    const [genreMap, setGenreMap] = useState({});
    const [ isLoading , setIsLoading ] = useState(true)
    const [ err , setErr ] = useState(null)

    useEffect(()=>{
      async function loadData(){
      try{
        setIsLoading(true);
        const [genreData, movieData] = await Promise.all([
          fetchGenres('/genre/movie/list'),
          fetchMovies('/movie/top_rated')
        ]);

        const genres = genreData.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
        }, {});
        setGenreMap(genres);
        setMovies(movieData || [])
      }catch(err){
        setErr(err)
      
      } finally {
        setIsLoading(false);
      }
    }
    loadData()
    },[])

    const getGenreNames = (genreIds) => {
      if (!genreIds || !Object.keys(genreMap).length) return '';
      return genreIds.map(id => genreMap[id]).filter(Boolean).join(', ');
    };

    if (isLoading) return <div className="text-white text-center p-10">Loading...</div>;
    if (err) return <div className="text-red-500 text-center p-10">Failed to load recommendations.</div>;
    if (!movies.length) return null;

    return (
        <section className="py-12 px-6 md:px-12 lg:px-20 relative">
            <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight flex items-center">
                    Top Rated
                </h1>
            </div>
            
            <div className="relative px-4">
                <Slider {...settings} className="movie-carousel">
                    {movies.map((movie)=>(
                        <div className="px-3 py-5" key={movie.id}> 
                            <MovieCard movie={movie} genreNamesString={getGenreNames(movie.genre_ids)} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}