import MovieCard from "./MovieCard"
import { fetchMovies, fetchGenres } from "../../api/movieAPI" 
import {useState , useEffect} from 'react'

export default function List(){
     const [movies , setMovies ] = useState([])
     const [genreMap, setGenreMap] = useState({});
     const [isLoading,setIsLoading] = useState(true)
     const [err , setErr] = useState(null)

     useEffect(()=>{
          async function loadData(){
               try{
                    const [genreData, ...moviePages] = await Promise.all([
                         fetchGenres('/genre/movie/list'), 
                         fetchMovies('/movie/top_rated', 1),
                         fetchMovies('/movie/top_rated', 2),
                         fetchMovies('/movie/top_rated', 3),
                    ]);

                    const genres = genreData.reduce((acc, genre) => {
                        acc[genre.id] = genre.name;
                        return acc;
                    }, {});
                    setGenreMap(genres);

                    const allMovies = moviePages.flat(); 
                    setMovies(allMovies);
               }catch(err){
                    setErr(err)
               }finally{
                    setIsLoading(false)
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
     
     return(
        <>
            <h1 className="text-white text-4xl mx-15 pt-10">Our collection</h1>
            
            <div className="grid grid-cols-4  gap-5 pt-5 pl-10">
               {movies.map((movie)=>(
               <div key={movie.id}> 
                     <MovieCard movie={movie} genreNamesString={getGenreNames(movie.genre_ids)} />
                </div>                   

               ))
               }
                
                
            </div>
    
        </>
    )
}