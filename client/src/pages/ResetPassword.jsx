import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      alert('Password reset successful, please sign in');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Set a new password</h1>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 16px' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', height: 46, padding: '0 14px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 14 }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', height: 46, padding: '0 14px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 14 }}
          />
          {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            width: '100%', height: 46, background: '#1e8536', color: '#fff', border: 'none',
            borderRadius: 23, fontWeight: 'bold', cursor: 'pointer'
          }}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/login" style={{ fontSize: 13, color: '#0a58ca', textDecoration: 'underline' }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}