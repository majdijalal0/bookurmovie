import React from 'react';
import { initialSeatMap } from './seatMap';
import  SeatDiv  from './seatDiv';
 

export default  function SeatPicker({ selectedSeats, toggleSeat }) {

    
    const getSeatStatus = (seat) => {
        if (seat.status === 'aisle') {
            return 'aisle'; 
        }
        if (seat.status === 'booked') {
            return 'booked'; 
        }
        return selectedSeats.includes(seat.id) ? 'selected' : 'available';
    };
   

    return (
        <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-2xl">
            
            <div className="w-full text-center mb-8">
                <div className="bg-gray-700 h-2 rounded-t-full shadow-lg"></div>
                <p className="text-gray-400 mt-2 text-sm italic">SCREEN THIS WAY</p>
            </div>

            
            <div className="space-y-2">
                
                {initialSeatMap.map((rowObj) => (
                    <div 
                        key={rowObj.row} 
                        className="grid gap-1 items-center"
                        style={{ gridTemplateColumns: '1.5rem repeat(9, 1fr)' }} 
                    >
                        <div className="text-gray-400 font-bold text-sm justify-self-center">
                            {rowObj.row}
                        </div>

                        {rowObj.seats.map((seat) => {
                            const status = getSeatStatus(seat);

                            if (status === 'aisle') {
                                return <div key={seat.id} className="w-full h-8"></div>;
                            }
                            
                            return (
                                <SeatDiv
                                    key={seat.id}
                                    seatId={seat.id}
                                    status={status}
                                    toggleSeat={toggleSeat}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            
<div className="flex gap-4 mt-8 text-sm">
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <span className="text-gray-300">Available</span>
    </div>
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-600 rounded"></div>
        <span className="text-gray-300">Selected</span>
    </div>
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-600 rounded"></div>
        <span className="text-gray-300">Booked</span>
    </div>
</div>

        </div>
    );
}