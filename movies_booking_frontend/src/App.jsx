import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './Components/Header';

const HomePage = lazy(() => import('./Components/HomePage'));
const MovieList = lazy(() => import('./Components/movielistsections/MovieList'));
const Booking = lazy(() => import('./Components/Booking'));
const MovieDetails = lazy(() => import('./Components/MovieDetails'));
const Profile = lazy(() => import('./Components/Login/Profile'));
const Login = lazy(() => import('./Components/Login/Login'));
const NotFound = lazy(() => import('./Components/NotFound'));
const Watchlist = lazy(() => import('./Components/Watchlist'));

const PageLoader = () => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
    <h2 className="text-xl font-bold text-white tracking-widest uppercase">Loading Movies...</h2>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<MovieList />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/book/:id" element={<Booking />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
