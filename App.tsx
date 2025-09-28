import React, { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth.tsx';
import Dashboard from './components/Dashboard.tsx';
import { User } from './types.ts';
import * as authService from './services/authService.ts';
import { SpinnerIcon } from './components/icons.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Bypass API call for hardcoded user
      if (storedToken === 'hardcoded-fake-token') {
        setUser({ id: 1, name: 'Test User', email: 'test@test.com' });
        setToken(storedToken);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Token verification failed', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoading(true); // show spinner while fetching user data
    verifyToken();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  const handleUserUpdate = (newUserData?: { name?: string; email?: string }) => {
    // For hardcoded user, just update state locally
    if (token === 'hardcoded-fake-token' && newUserData && user) {
        setUser({ ...user, ...newUserData });
        return;
    }
    
    // Original logic for real API
    setIsLoading(true);
    verifyToken();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <SpinnerIcon className="w-16 h-16 text-teal-400" />
      </div>
    );
  }

  return (
    <>
      {token && user ? (
        <Dashboard user={user} logout={handleLogout} onUserUpdate={handleUserUpdate} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default App;