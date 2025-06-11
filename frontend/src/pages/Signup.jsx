import React, { useState } from 'react';

// Hash password using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function validatePassword(password) {
  return /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length >= 8;
}

export default function Signup({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState(''); // New state
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');

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
      const hashedPassword = await hashPassword(password);
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: hashedPassword })
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        setMsg('Server error. Please try again later.');
        return;
      }
      if (res.ok) {
        setStep(2);
        setMsg('2FA code sent to your email.');
      } else {
        setMsg(data.error || 'Signup failed');
      }
    } catch (err) {
      setMsg('Network error. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:3000/verify-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Signup complete! You can now login.');
      if (onAuthSuccess) onAuthSuccess();
    } else {
      setMsg(data.error || '2FA failed');
    }
  };

  return (
    <form onSubmit={step === 1 ? handleSignup : handleVerify} className="space-y-6">
      {step === 1 ? (
        <>
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
        </>
      ) : (
        <>
          <div>
            <label className="block text-gray-700">2FA Code</label>
            <input type="text" required className="mt-1 w-full border rounded px-3 py-2" value={code} onChange={e => setCode(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Verify</button>
        </>
      )}
      {msg && <div className="text-center text-sm text-red-500">{msg}</div>}
    </form>
  );
}
