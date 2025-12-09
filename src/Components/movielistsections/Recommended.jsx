import MovieCard from './MovieCard'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchMovies, fetchGenres } from '../../api/movieAPI';
import { useState , useEffect } from 'react';

export default function Recommended(){
    const settings = {
        dots : false,
        infinite : true,
        speed : 500,
        slidesToShow : 4,
        slidesToScroll : 1,
        responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]

    }
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
    <>
        <h1 className="text-white text-4xl mx-15 pt-10">Top Rated</h1>
        <div className="pt-5 pl-12 pr-10 ">
            
                <Slider {...settings} >

                  {movies.map((movie)=>(
                      <div className='px-3 py-5' key={movie.id}> 
                        <MovieCard movie={movie} genreNamesString={getGenreNames(movie.genre_ids)} />
                        </div>
                  ))
                  }
                    </Slider >
        </div>
    </>
    )
}