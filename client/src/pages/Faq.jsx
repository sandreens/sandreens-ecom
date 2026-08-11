import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faqs')
      .then(res => {
        // shudhu active gula, order onujayi (backend already sort kore pathay)
        setFaqs(res.data.filter(f => f.isActive));
      })
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px 72px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#767676', marginBottom: 8 }}>
            Help Centre
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 14, color: '#767676', marginTop: 10 }}>
            Everything you need to know. Can't find an answer? Chat with us anytime.
          </p>
        </div>

        {/* FAQ list */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 14 }}>Loading...</p>
        ) : faqs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 14 }}>No FAQs available right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(faq => {
              const isOpen = openId === faq._id;
              return (
                <div key={faq._id} style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: isOpen ? '#f9f5f0' : '#fff',
                  transition: 'background 0.2s',
                }}>
                  <button
                    onClick={() => toggle(faq._id)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', gap: 16, padding: '18px 22px',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{faq.question}</span>
                    <span style={{
                      fontSize: 20, color: '#111', flexShrink: 0,
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 22px 20px' }}>
                      <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}