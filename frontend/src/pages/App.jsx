import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';

export default function App() {
  const [page, setPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <Home />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold ${page === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setPage('login')}
          >
            Login
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold ${page === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setPage('signup')}
          >
            Signup
          </button>
        </div>
        {page === 'login' ? <Login onAuthSuccess={handleAuthSuccess} /> : <Signup onAuthSuccess={handleAuthSuccess} />}
      </div>
    </div>
  );
}
