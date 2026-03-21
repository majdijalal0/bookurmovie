import MovieCard from "./MovieCard";
import { fetchMovies, fetchGenres } from "../../api/movieAPI";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

export default function List() {
    const [movies, setMovies] = useState([]);
    const [genreMap, setGenreMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
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
            } catch (err) {
                setErr(err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const getGenreNames = (genreIds) => {
        if (!genreIds || !Object.keys(genreMap).length) return '';
        return genreIds.map(id => genreMap[id]).filter(Boolean).join(', ');
    };

    if (isLoading) return (
        <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
        </div>
    );
    if (err) return <div className="text-red-500 text-center p-10 font-medium">Failed to load movie collection.</div>;
    if (!movies.length) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <section className="py-12 px-6 md:px-12 lg:px-20 bg-gray-950">
            <div className="flex items-center space-x-3 mb-10">
                <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight flex items-center">
                    Our Collection <Film className="ml-4 text-red-500" size={32} />
                </h1>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12"
            >
                {movies.map((movie) => (
                    <motion.div key={movie.id} variants={itemVariants}>
                        <MovieCard movie={movie} genreNamesString={getGenreNames(movie.genre_ids)} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}