import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/check_session.php`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.loggedIn) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
    </AuthContext.Provider>
  );
};
