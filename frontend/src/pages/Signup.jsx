import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function validatePassword(password) {
  return /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length >= 8;
}

export default function Signup({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg('');
    if (password !== repeatPassword) {
      setMsg('Passwords do not match.');
      return;
    }
    if (!validatePassword(password)) {
      setMsg('Password must be at least 8 characters, include an uppercase letter, a number, and a symbol.');
      return;
    }
    try {
      // Default to 'user' role, but allow admin registration if email contains 'admin' (for demo)
      const role = email.includes('admin') ? 'admin' : 'user';
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        setMsg('Server error. Please try again later.');
        return;
      }
      if (res.ok) {
        setMsg('Signup complete! You can now login.');
        setTimeout(() => navigate('/login'), 1200); // Redirect to login after short delay
      } else {
        setMsg(data.error || 'Signup failed');
      }
    } catch (err) {
      setMsg('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <div>
        <label className="block text-gray-700">Email</label>
        <input type="email" required className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input type="password" required className="mt-1 w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
        <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 number, 1 symbol</p>
      </div>
      <div>
        <label className="block text-gray-700">Repeat Password</label>
        <input
          type="password"
          required
          className="mt-1 w-full border rounded px-3 py-2"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Signup</button>
      {msg && <div className="text-center text-sm text-red-500">{msg}</div>}
    </form>
  );
}
