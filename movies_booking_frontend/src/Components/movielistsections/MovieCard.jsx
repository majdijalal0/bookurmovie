import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, genreNamesString }) {
    const { id, original_title, poster_path, vote_average } = movie;

    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    const posterUrl = poster_path 
        ? `${BASE_IMAGE_URL}${poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster'; 

    const formattedRating = typeof vote_average === 'number' ? vote_average.toFixed(1) : 'NR';
    const navigate = useNavigate();
    
    function handleDetails() {
        navigate(`/movie/${id}`);
    }

    return (
        <div className="flex flex-col w-full h-full bg-gray-900 border border-gray-800 overflow-hidden rounded-xl shadow-xl hover:-translate-y-1 hover:shadow-red-900/40 hover:ring-1 ring-red-500 transition-all duration-300 group">
            <div className="relative overflow-hidden w-full aspect-[2/3]">
                 <img 
                    src={posterUrl} 
                    alt={`${original_title} poster`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                    loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-Inter font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-red-400 transition-colors" title={original_title}>
                    {original_title}
                </h2>
                
                <div className="flex justify-between items-center text-sm font-medium mb-4">
                    <span className="text-gray-400 truncate pr-3" title={genreNamesString}>
                        {genreNamesString || 'Various'}
                    </span>
                    <span className="flex items-center text-yellow-500 flex-shrink-0 bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700">
                        <span className="mr-1 text-xs">⭐</span>{formattedRating}
                    </span>
                </div>
                
                <div className="mt-auto pt-2">
                    <button
                        onClick={handleDetails} 
                        className="w-full text-center rounded-lg bg-gray-800 hover:bg-red-600 border border-gray-700 hover:border-red-500 text-white py-2.5 font-bold transition-all duration-300 shadow-md"
                    >
                        See details
                    </button>           
                </div>
            </div>
        </div>
    );
}