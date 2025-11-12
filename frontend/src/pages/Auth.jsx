import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/env';

// PUBLIC_INTERFACE
export default function Auth() {
  /** Authentication page for email/password login and registration. */
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const path = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister ? { email, password, name } : { email, password };
      const { data } = await client.post(path, body);
      if (data?.token) {
        setUserAndToken(data.user || { email, role: data.role || 'user', name: data.user?.name || name }, data.token);
        navigate('/');
      } else {
        setErr('Invalid response from server.');
      }
    } catch (e) {
      logger.error('Auth error', e);
      setErr('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <form className="card form" onSubmit={submit}>
        <h2>{isRegister ? 'Create account' : 'Sign in'}</h2>
        {isRegister && (
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="jane@example.com" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        {err && <p className="error-text">{err}</p>}
        <button className="btn" type="submit">{isRegister ? 'Register' : 'Login'}</button>
        <button type="button" className="link-btn" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Have an account? Sign in' : 'No account? Register'}
        </button>
      </form>
    </div>
  );
}
