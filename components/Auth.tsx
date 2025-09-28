import React, { useState } from 'react';
import * as authService from '../services/authService.ts';
import { MusicNoteIcon, SpinnerIcon } from './icons.tsx';

interface AuthProps {
  onLoginSuccess: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Hardcoded bypass for test user
      if (isLoginView && email === 'test@test.com' && password === 'test') {
        onLoginSuccess('hardcoded-fake-token');
        return;
      }

      if (isLoginView) {
        const res = await authService.login({ email, password });
        onLoginSuccess(res.token);
      } else {
        await authService.register({ email, password, name });
        const res = await authService.login({ email, password });
        onLoginSuccess(res.token);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <MusicNoteIcon className="w-16 h-16 text-teal-400" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2 text-white">Musicbox</h1>
        <p className="text-center text-gray-400 mb-8">Your personal music library.</p>
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => { setIsLoginView(true); setError(null); }}
              className={`flex-1 py-2 text-center font-semibold transition-colors duration-300 ${isLoginView ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLoginView(false); setError(null); }}
              className={`flex-1 py-2 text-center font-semibold transition-colors duration-300 ${!isLoginView ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                placeholder="test@test.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                placeholder="test"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-500"
            >
              {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
              {isLoading ? 'Processing...' : (isLoginView ? 'Login' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;