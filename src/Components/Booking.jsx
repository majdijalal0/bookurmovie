import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SeatPicker from './SEAT/SeatPicker'; 

export default function BookingPage() {
    const location = useLocation();
    const movieTitle = location.state?.movieTitle || 'Movie Not Found';
    const movieImage = location.state?.movieImage || 'Image Not Found';
    const [selectedSeats, setSelectedSeats] = useState([]); 
    const [selectedTime, setSelectedTime] = useState(null);
    
    const showtimes = ["13:00", "16:00", "19:00", "22:00"];
    const [ticketCount, setTicketCount] = useState(0); 
    const ticketPrice = 12.00; 

    const toggleSeat = (seatId) => {
        console.log(`Toggling seat: ${seatId}`);
        setSelectedSeats(prevSeats => 
            prevSeats.includes(seatId)
                ? prevSeats.filter(id => id !== seatId) 
                : [...prevSeats, seatId] 
        );
    };
    

    useEffect(() => {
        setTicketCount(selectedSeats.length);
    }, [selectedSeats]);

    const handleCheckout = () => {
        const existingBookings = JSON.parse(localStorage.getItem('movieBookings')) || [];

        const newBooking = {
            id: Date.now(), 
            movie: {
                title: movieTitle,
                posterUrl: movieImage,
            },
            date: new Date().toLocaleDateString(), 
            time: selectedTime,
            seats: selectedSeats,
        };

        localStorage.setItem('movieBookings', JSON.stringify([...existingBookings, newBooking]));

        alert(`Booking successful for ${movieTitle}!`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
            
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-bold mb-2">{movieTitle}</h1>
                <p className="text-gray-400">Megarama</p>
                <hr className="my-4 border-gray-700" />
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold mb-4">Choose a time</h2>
                <div className="flex gap-4">
                    {showtimes.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`px-4 py-2 rounded-lg transition ${selectedTime === time ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-red-700'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                <div className="lg:w-3/4">
                    <div className="bg-gray-800 p-6 rounded-lg h-[60vh] flex items-center justify-center">
                   <SeatPicker 
                        selectedSeats={selectedSeats}
                        toggleSeat={toggleSeat}
                    />
                                   
                 </div>
                </div>
                
                <div className="lg:w-1/4">
                    <div className="sticky top-12"> 
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                            <p>Time: {selectedTime || 'Not Selected'}</p>
                            <p>Seats Selected: {selectedSeats.join(', ')}</p>
                            <p>Tickets: {ticketCount}</p>
                            <p className="text-xl font-bold mt-4">Total: ${(ticketCount * ticketPrice).toFixed(2)}</p>
                            
                            <button 
                                onClick={handleCheckout} 
                                className="w-full mt-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                disabled={ticketCount === 0 || !selectedTime}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}