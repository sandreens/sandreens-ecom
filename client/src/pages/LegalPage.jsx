import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// type prop diye thik korbo Terms na Privacy dekhabo
export default function LegalPage({ type = 'terms' }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings')
      .then(res => setSettings(res.data))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
  const content = type === 'privacy'
    ? settings?.privacyPolicy
    : settings?.termsConditions;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px 72px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111', letterSpacing: '-0.5px', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #e8e8e8' }}>
          {title}
        </h1>

        {loading ? (
          <p style={{ color: '#999', fontSize: 14 }}>Loading...</p>
        ) : !content || content.trim() === '' ? (
          <p style={{ color: '#767676', fontSize: 15, lineHeight: 1.7 }}>
            This page hasn't been set up yet. Please check back later.
          </p>
        ) : (
          // whiteSpace pre-line diye admin er line break rakhi
          <div style={{ fontSize: 15, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {content}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}