import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:3005/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Login successful!');
      // Fetch user role after login
      let role = 'user';
      try {
        const usersRes = await fetch('http://localhost:3005/users');
        const users = await usersRes.json();
        const user = users.find(u => u.email === email);
        if (user && user.role) role = user.role;
      } catch {}
      if (onAuthSuccess) onAuthSuccess(email, role);
    } else {
      setMsg(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label className="block text-gray-700">Email</label>
        <input type="email" required className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            className="mt-1 w-full border rounded px-3 py-2 pr-10"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      {msg && <div className="text-center text-sm text-red-500">{msg}</div>}
    </form>
  );
}
