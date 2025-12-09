
import { useNavigate } from 'react-router-dom';
export default function MovieCard({ movie, genreNamesString }) {
    const { id, original_title, poster_path, vote_average} = movie;

    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";
    const posterUrl = poster_path 
        ? `${BASE_IMAGE_URL}${poster_path}` 
        : 'https://via.placeholder.com/200x300?text=No+Image'; 

    const formattedRating = typeof vote_average === 'number' ? vote_average.toFixed(1) : 'N/A';
    const destination = `/movie/${id}`;
    const navigate = useNavigate()
    
    function handleDetails(){
        navigate(destination);
    }

    return(
        <div   className="flex flex-col w-70 h-140 bg-gray-900 overflow-hidden rounded-lg shadow-lg hover:ring-2 ring-red-500">
            <img src={posterUrl} alt={`${original_title} poster`} className="h-96 object-cover hover:scale-105 transition duration-400" />
            <div>
                <h1 className="Inter font-bold text-xl text-white  py-4 truncate hover:text-red-500">{original_title}</h1>
                <div className="flex justify-between items-center text-gray-400">
                <h3 className="py-4 hover:text-red-500 truncate pr-2">{genreNamesString}</h3>
                <h3 className="flex items-center text-yellow-400 font-semibold flex-shrink-0"> <span className="mr-1">⭐</span>{formattedRating}</h3>
            </div>
        <button
            onClick={handleDetails} 
            className='w-full text-center  rounded-xl bg-red-600 text-white p-3 font-bold hover:bg-red-700 transition duration-300 rounded-b-xl'
        >
            See details
        </button>           
         </div>
            
        </div>
    )
}