import { useParams , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetail } from "../api/movieAPI"; 

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true); 
            try {
                const data = await fetchMovieDetail(id); 
                setMovie(data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
                setMovie(null); 
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchMovieDetails();
        }
    }, [id]); 

    const navigate  = useNavigate();
    function handleClick(){
        navigate(`/book/${id}`, {
            state : {
                movieTitle : movie.title,
                movieImage : posterUrl,
            }
        }
        )
    }

    if (loading) return <div>Loading...</div>;
    if (!movie) return <div>Movie not found</div>;
    
    const posterUrl = movie.poster_path
        ? `${BASE_IMAGE_URL}${movie.poster_path}`
        : 'placeholder_image_path.jpg';
    return (
        <div className="flex flex-row bg-gray-900 h-screen">
            <div className="flex  m-5  shadow-red-500 h-150 w-300  ">
                <img className="object-cover  rounded-2xl ring ring-red-500 hover:shadow-xl/50 hover:shadow-red-900 hover:scale-102 " src={posterUrl} alt={`${movie.title} poster`} />
            </div>
            <div className="flex flex-col items-center mr-10 ">
                 <div className="bg-red-800  my-8  rounded-2xl px-8  hover:shadow-lg/50 shadow-red-500 h-60">
                <h1 className="text-gray-900 text-center text-4xl pb-1">{movie.title || movie.original_title}</h1>
                <p className="text-white pb-1">{movie.release_date} | {movie.vote_average} | {movie.genres[0]?.name}</p>
                <p className="text-white text-xl">{movie.overview}</p>
            </div>
            <button onClick={handleClick} className="bg-red-500 w-50 mt-20 rounded-full p-5 text-xl font-bold text-white hover:bg-red-600 shadow-xl transition duration-300">Book Now</button>
            </div>
           
        </div>
    );
}