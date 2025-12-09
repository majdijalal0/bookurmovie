import './App.css'
import Header from './Components/Header';
import HomePage from './Components/HomePage';
import MovieList from './Components/movielistsections/MovieList';
import Booking from './Components/Booking';
import MovieDetails from './Components/MovieDetails'
import Profile from './Components/Login/Profile'
import { useState  } from 'react'

import { BrowserRouter , Routes , Route } from 'react-router-dom'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('movieUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  return (
    <BrowserRouter>
     <Header  user={user} setUser={setUser} />
      <Routes>
        <Route path = "/" element={<HomePage />} />
        <Route path = "/explore" element={<MovieList />} />
        <Route path = "/movie/:id" element={<MovieDetails />} />
        <Route path = "/book/:id" element={<Booking />} />
        <Route path = "/profile" element = {<Profile user={user} setUser={setUser} />} />

      </Routes>
     


    </BrowserRouter>
  )
}

export default App;
