import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SeatPicker from './SEAT/SeatPicker';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function BookingPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [movieDetails, setMovieDetails] = useState(location.state || null);

    useEffect(() => {
        if (!movieDetails && id) {
            const apiKey = import.meta.env.VITE_API_KEY;
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
                .then(res => res.json())
                .then(data => {
                    setMovieDetails({
                        movieTitle: data.title || data.original_title,
                        movieImage: `https://image.tmdb.org/t/p/original/${data.backdrop_path}`
                    });
                })
                .catch(err => console.error("Error fetching movie:", err));
        }
    }, [id]);

    const movieTitle = movieDetails?.movieTitle || 'Movie Not Found';
    const movieImage = movieDetails?.movieImage || 'Image Not Found';
    const [selectedSeats, setSelectedSeats] = useState([]); 
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const showtimes = ["13:00", "16:00", "19:00", "22:00"];
    const ticketPrice = 12.00;
    const ticketCount = selectedSeats.length;

    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        setSelectedSeats(prevSeats =>
            prevSeats.includes(seatId)
                ? prevSeats.filter(id => id !== seatId)
                : [...prevSeats, seatId]
        );
    };

    useEffect(() => {
        if (movieTitle && selectedTime) {
            const fetchBookedSeats = async () => {
                const today = new Date().toISOString().split('T')[0];
                const params = new URLSearchParams({
                    movie_title: movieTitle,
                    booking_date: today,
                    show_time: selectedTime,
                });
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/get_booked_seats.php?${params.toString()}`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setBookedSeats(data);
                    } else {
                        console.error("Failed to fetch booked seats.");
                    }
                } catch (error) {
                    console.error("Error fetching booked seats:", error);
                }
            };
            fetchBookedSeats();
        }
    }, [movieTitle, selectedTime]);

    const handleCheckout = async () => {
        if (!user) {
            addToast("Please login to book a ticket.", "error");
            navigate('/login');
            return;
        }

        const bookingData = {
            movie_title: movieTitle,
            movie_image: movieImage,
            booking_date: new Date().toISOString().split('T')[0],
            show_time: selectedTime,
            seats: selectedSeats,
            total_price: (ticketCount * ticketPrice).toFixed(2)
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/book_ticket.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify(bookingData),
            });

            const data = await response.json();

            if (response.ok) {
                addToast(`Booking successful for ${movieTitle}!`, "success");
                navigate('/profile');
            } else {
                addToast(data.message || 'Booking failed', "error");
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('Error connecting to server', "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 font-Inter relative pb-20">
            <div className="absolute top-0 left-0 right-0 h-96 z-0 overflow-hidden">
                <img 
                    src={movieImage} 
                    alt="Movie Backdrop" 
                    className="w-full h-full object-cover opacity-30 mask-image-b"
                    style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/80 to-gray-950"></div>
            </div>

            <div className="relative z-10 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">{movieTitle}</h1>
                    <p className="text-red-400 font-medium text-lg tracking-widest uppercase">Select Your Seats</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 flex flex-col gap-8">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="glass-surface p-8 rounded-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                                Choose a time
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {showtimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 border ${
                                            selectedTime === time 
                                            ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] transform scale-105' 
                                            : 'bg-gray-800/80 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gray-500'
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`glass-surface p-8 rounded-2xl transition-all duration-500 ${!selectedTime ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                                Select your seats
                            </h2>
                            
                            <div className="flex justify-center mb-8">
                                <SeatPicker 
                                    selectedSeats={selectedSeats}
                                    toggleSeat={toggleSeat}
                                    bookedSeats={bookedSeats}
                                />
                            </div>

                            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-800 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm bg-gray-700"></div>
                                    <span className="text-gray-400">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                                    <span className="text-gray-400">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm bg-gray-900 border border-gray-800 opacity-50"></div>
                                    <span className="text-gray-400">Booked</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    
                    <div className="lg:w-1/3">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="sticky top-28 glass-effect p-8 rounded-2xl border-t-4 border-t-red-500"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                            
                            <div className="flex flex-col gap-4 text-gray-300">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                                    <span className="text-gray-500">Time</span>
                                    <span className="font-semibold text-white">{selectedTime || '-'}</span>
                                </div>
                                
                                <div className="flex justify-between items-start pb-4 border-b border-gray-800">
                                    <span className="text-gray-500 mt-1">Seats</span>
                                    <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                                        {selectedSeats.length > 0 ? selectedSeats.map(seat => (
                                            <span key={seat} className="bg-gray-800 text-red-400 text-xs px-2 py-1 rounded border border-gray-700">
                                                {seat}
                                            </span>
                                        )) : <span className="text-white">-</span>}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                                    <span className="text-gray-500">Tickets ({ticketCount})</span>
                                    <span className="font-semibold text-white">${(ticketCount * ticketPrice).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-4 mb-6">
                                    <span className="text-lg text-white font-medium">Total</span>
                                    <span className="text-3xl font-extrabold text-red-500">
                                        ${(ticketCount * ticketPrice).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout} 
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                    ticketCount > 0 && selectedTime 
                                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-red-500' 
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                }`}
                                disabled={ticketCount === 0 || !selectedTime}
                            >
                                Proceed to Checkout
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
