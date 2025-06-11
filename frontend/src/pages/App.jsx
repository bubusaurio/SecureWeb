import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import TodoList from './TodoList';
import Navbar from './Navbar';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('guest');

  const handleAuthSuccess = (email, role = 'user') => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRole('guest');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            isAuthenticated ? (
              <Navigate to="/todos" />
            ) : (
              <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="w-full max-w-md p-8 bg-white rounded shadow">
                  <Login onAuthSuccess={handleAuthSuccess} />
                </div>
              </div>
            )
          } />
          <Route path="/signup" element={
            isAuthenticated ? (
              <Navigate to="/todos" />
            ) : (
              <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="w-full max-w-md p-8 bg-white rounded shadow">
                  <Signup onAuthSuccess={handleAuthSuccess} />
                </div>
              </div>
            )
          } />
          <Route path="/todos" element={<TodoList userEmail={userEmail} userRole={userRole} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

// No 2FA or password hashing logic present in this file.
