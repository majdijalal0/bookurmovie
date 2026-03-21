import { motion } from 'framer-motion';

const SeatPicker = ({ selectedSeats, toggleSeat, bookedSeats }) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;

    return (
        <div className="flex flex-col gap-5 items-center bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-inner">
            <div className="w-full max-w-md h-12 bg-gradient-to-b from-blue-500/20 to-transparent mt-2 rounded-t-[50%] opacity-80 backdrop-blur-sm border-t border-blue-400/30 flex items-start justify-center pt-2 mb-8 relative">
                <span className="text-blue-300 text-xs tracking-[0.3em] font-medium absolute -top-4 bg-gray-950 px-4">SCREEN</span>
            </div>

            <div className="flex flex-col gap-3 items-center">
                {rows.map(row => (
                    <div key={row} className="flex items-center gap-4">
                        <span className="w-6 text-center text-gray-500 font-bold">{row}</span>
                        <div className="flex gap-2 sm:gap-3">
                            {Array.from({ length: seatsPerRow }, (_, i) => {
                                const seatId = `${row}${i + 1}`;
                                const isBooked = bookedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                let seatClass = "bg-gray-700/80 hover:bg-gray-600 border-b-4 border-gray-900 text-gray-300";
                                if (isBooked) {
                                    seatClass = "bg-gray-900 border-b-4 border-gray-950 opacity-40 cursor-not-allowed text-transparent";
                                } else if (isSelected) {
                                    seatClass = "bg-red-600 text-white border-b-4 border-red-800 shadow-[0_0_10px_rgba(220,38,38,0.5)]";
                                }

                                return (
                                    <motion.button
                                        whileHover={!isBooked ? { scale: 1.1, y: -2 } : {}}
                                        whileTap={!isBooked ? { scale: 0.95 } : {}}
                                        key={seatId}
                                        onClick={() => !isBooked && toggleSeat(seatId)}
                                        disabled={isBooked}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-bold transition-colors ${seatClass}`}
                                        title={isBooked ? "Already Booked" : `Seat ${seatId}`}
                                    >
                                        {!isBooked && (i + 1)}
                                    </motion.button>
                                );
                            })}
                        </div>
                        <span className="w-6 text-center text-gray-500 font-bold">{row}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatPicker;