import { Link } from 'react-router-dom'
export default function HomePage(){
 const destination = '/explore'
    return(
        <div className='flex flex-col fixed  bg-center bg-linear-to-r from-gray-900 to-red-900  inset-0 -z-5 items-center' >
        <h1 className='pt-60 mr-7 ml-7 mb-8 inset-0 text-white Inter font-bold text-5xl '>Book your ticket for the movies <span>Now</span></h1>
        <h3 className='mt-3 inset-0 text-white text-3xl Inter font-bold '>All your favorite movies available at the best prices</h3>
        <div className='flex gap-8 mt-12 text-white text-center'>
        <div className='flex items-center gap-2'>
        <span className="text-2xl">🎬</span>
        <span className="Inter text-xl">10,000+ Movies</span>
    </div>
    <div className='flex items-center gap-2'>
        <span className="text-2xl">💰</span>
        <span className="Inter text-xl">Best Prices</span>
    </div>
    <div className='flex items-center gap-2'>
        <span className="text-2xl">⚡</span>
        <span className="Inter text-xl">Instant Booking</span>
    </div>
    </div>
        <Link to={destination} className=' bg-red-500 mt-10 rounded-full p-5 text-xl font-bold text-white hover:bg-red-600 shadow-xl transition duration-300'>
        Start exploring
        </Link>
        </div>
    )
}