import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile({user ,setUser}) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('movieBookings')) || [];
    setBookings(savedBookings);
  }, [user]); 

  const handleLogout = () => {
    localStorage.removeItem("movieUser");
    setUser(null);
    navigate("/");
  };

  const handleDeleteBooking = (bookingId) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('movieBookings', JSON.stringify(updatedBookings));
  };

  const handleClearAllBookings = () => {
    if (window.confirm("Are you sure you want to delete all your bookings?")) {
      setBookings([]);
      localStorage.removeItem('movieBookings');
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col">
        <div className="flex flex-row items-center mt-10 gap-6 justify-around">
      <div className="w-24 h-24 bg-red-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold">{user.name}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition"
      >
        Log out
      </button>
    </div>
    <div className="flex justify-between items-center mt-10 px-10">
        <h2 className="text-red-700 text-4xl">Your bookings</h2>
        {bookings.length > 0 && (
            <button
                onClick={handleClearAllBookings}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition text-sm"
            >
                Clear All
            </button>
        )}
    </div>
    <div className="flex flex-col items-center mt-10 gap-6">
        
      
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-gray-900 p-4 rounded-lg shadow-md w-full max-w-2xl flex justify-between items-start gap-4">
              <img src={booking.movie.posterUrl} alt={booking.movie.title} className="w-24 h-36 rounded-md" />
              <div className="flex-grow">
                <h3 className="text-xl text-red-700 font-bold">{booking.movie.title}</h3>
                <p className="text-white">Date: {booking.date}</p>
                <p className="text-white">Time: {booking.time}</p>
                <p className="text-white">Seats: {booking.seats.join(", ")}</p>
              </div>
              <button onClick={() => handleDeleteBooking(booking.id)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
          ))
        ) : (
          <p>You have no bookings yet.</p>
        )}
    </div>
    </div>
    
  );
}
