import React, { useState } from 'react';

export default function Login({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setStep(2);
      setMsg('2FA code sent to your email.');
    } else {
      setMsg(data.error || 'Login failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:3000/verify-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Login successful!');
      if (onAuthSuccess) onAuthSuccess();
    } else {
      setMsg(data.error || '2FA failed');
    }
  };

  return (
    <form onSubmit={step === 1 ? handleLogin : handleVerify} className="space-y-6">
      {step === 1 ? (
        <>
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" required className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" required className="mt-1 w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
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
