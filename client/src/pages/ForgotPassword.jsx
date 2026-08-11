import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Reset your password</h1>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 16px' }}>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 20, textAlign: 'center' }}>
          Enter your email and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', height: 46, padding: '0 14px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 14 }}
          />
          {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
          {message && <p style={{ color: '#1e8536', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{message}</p>}
          <button type="submit" disabled={loading} style={{
            width: '100%', height: 46, background: '#1e8536', color: '#fff', border: 'none',
            borderRadius: 23, fontWeight: 'bold', cursor: 'pointer'
          }}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/login" style={{ fontSize: 13, color: '#0a58ca', textDecoration: 'underline' }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}