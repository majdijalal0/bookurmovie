
export default function SeatDiv({ seatId, status, toggleSeat }) {
    
    let baseStyle = "w-8 h-8 m-0.5 rounded-md flex items-center justify-center text-xs font-semibold transition-colors";
    
    let interactionStyle = '';
    
    switch (status) {
        case 'available':
            interactionStyle = 'bg-gray-700 hover:bg-gray-600 cursor-pointer';
            break;
        case 'booked':
            interactionStyle = 'bg-gray-900 text-gray-500 line-through cursor-not-allowed';
            break;
        case 'selected':
            interactionStyle = 'bg-red-600 hover:bg-red-700 cursor-pointer';
            break;
        default:
            interactionStyle = 'bg-transparent'; 
    }
    
    const handleClick = () => {
        if (status === 'available' || status === 'selected') {
            toggleSeat(seatId);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`${baseStyle} ${interactionStyle}`}
        >
            {seatId.substring(1)} 
        </div>
    );
}