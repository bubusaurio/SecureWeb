import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated, userRole, onLogout }) {
  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="font-bold text-xl">
        <Link to="/">SecureWeb</Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/todos" className="hover:underline">To-Do List</Link>
        {!isAuthenticated && <Link to="/login" className="hover:underline">Login</Link>}
        {!isAuthenticated && <Link to="/signup" className="hover:underline">Signup</Link>}
        <span className="text-sm ml-2">{userRole === 'admin' ? 'Administrador' : userRole === 'user' ? 'Usuario' : 'Invitado'}</span>
        {isAuthenticated ? (
          <button
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100 font-semibold ml-2"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        ) : null}
      </div>
    </nav>
  );
}
