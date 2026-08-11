import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/sandreens',
    instagram: 'https://instagram.com/sandreens',
    tiktok: 'https://tiktok.com/@sandreens',
    youtube: 'https://youtube.com/@sandreens'
  });

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        setSettings(res.data);
        if (res.data?.socialLinks) {
          const validLinks = {};
          Object.keys(res.data.socialLinks).forEach(k => {
            if (res.data.socialLinks[k]) validLinks[k] = res.data.socialLinks[k];
          });
          setSocialLinks(prev => ({ ...prev, ...validLinks }));
        }
      })
      .catch(() => setSettings(null));

    api.get('/cms/socialLinks')
      .then(res => {
        if (res.data?.data) {
          const validLinks = {};
          Object.keys(res.data.data).forEach(k => {
            if (res.data.data[k]) validLinks[k] = res.data.data[k];
          });
          setSocialLinks(prev => ({ ...prev, ...validLinks }));
        }
      })
      .catch(() => {});
  }, []);
  const [openCols, setOpenCols] = useState({
    account: false,
    help: false,
    about: false,
    delivery: false,
  });

  const toggleCol = (col) => {
    setOpenCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <>
      {/* ── MAIN FOOTER (WHITE) ── */}
      <style>{`
        @media (max-width: 768px) {
          .footer-cols-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .footer-col-header { display: flex !important; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #e8e8e8; padding: 16px 0; margin-bottom: 0 !important; }
          .footer-col-list { display: none; padding: 16px 0 !important; }
          .footer-col-list.open { display: block; }
          .footer-col-arrow { transition: transform 0.3s; font-size: 10px; }
          .footer-col-arrow.open { transform: rotate(180deg); }
        }
        @media (min-width: 769px) {
          .footer-col-arrow { display: none; }
          .footer-col-header { cursor: default; }
        }
      `}</style>
      <footer style={{
        background: '#fff',
        borderTop: '1px solid #e8e8e8',
        padding: '40px 40px 0',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {/* Sign up to receive our emails Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            padding: '24px 0',
            borderBottom: '1px solid #e8e8e8',
            marginBottom: 36,
          }} className="footer-signup-banner">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }} className="footer-signup-text">
              Sign up to receive our emails
            </span>
            <Link to="/register" style={{
              display: 'inline-block',
              background: '#fff',
              color: '#111',
              border: '1.5px solid #111',
              fontSize: 12,
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: 30,
              textDecoration: 'none',
              marginLeft: 12,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f3f3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              Sign up for emails
            </Link>
          </div>

          {/* 4 COLUMNS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '32px',
            paddingBottom: 40,
          }} className="footer-cols-grid">
            {/* MY ACCOUNT */}
            <div>
              <h4 
                className="footer-col-header" 
                style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16 }}
                onClick={() => toggleCol('account')}
              >
                <span>My Account</span>
                <span className={`footer-col-arrow${openCols.account ? ' open' : ''}`}>▼</span>
              </h4>
              <ul className={`footer-col-list${openCols.account ? ' open' : ''}`} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'My Account', to: '/account' },
                  { label: 'My Orders', to: '/account' },
                  { label: 'Saved items', to: '/saved' },
                ].map(item => (
                  <li key={item.label} style={{ marginBottom: 12 }}>
                    <Link to={item.to} style={{
                      fontSize: 13,
                      color: '#111',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* HELP */}
            <div>
              <h4 
                className="footer-col-header" 
                style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16 }}
                onClick={() => toggleCol('help')}
              >
                <span>Help & Support</span>
                <span className={`footer-col-arrow${openCols.help ? ' open' : ''}`}>▼</span>
              </h4>
              <ul className={`footer-col-list${openCols.help ? ' open' : ''}`} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Help Centre & FAQ', to: '/faq' },
                  { label: 'Contact Support', to: '/faq' },
                  { label: 'Terms & Conditions', to: '/terms' },
                  { label: 'Privacy Policy', to: '/privacy' },
                ].map(item => (
                  <li key={item.label} style={{ marginBottom: 12 }}>
                    <Link to={item.to} style={{
                      fontSize: 13,
                      color: '#111',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ABOUT US */}
            <div>
              <h4 
                className="footer-col-header" 
                style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16 }}
                onClick={() => toggleCol('about')}
              >
                <span>About Us</span>
                <span className={`footer-col-arrow${openCols.about ? ' open' : ''}`}>▼</span>
              </h4>
              <ul className={`footer-col-list${openCols.about ? ' open' : ''}`} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'About Sandreens', to: '/about' },
                  { label: 'Sandreens Journal & Blog', to: '/blog' },
                  { label: 'Shop Collections', to: '/all-things-new' },
                  { label: 'Our Brands', to: '/all-things-new' },
                ].map(item => (
                  <li key={item.label} style={{ marginBottom: 10 }}>
                    <Link to={item.to} style={{
                      fontSize: 13,
                      color: '#111',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* DELIVERY AND RETURNS */}
            <div>
              <h4 
                className="footer-col-header" 
                style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16 }}
                onClick={() => toggleCol('delivery')}
              >
                <span>Delivery and Returns</span>
                <span className={`footer-col-arrow${openCols.delivery ? ' open' : ''}`}>▼</span>
              </h4>
              <ul className={`footer-col-list${openCols.delivery ? ' open' : ''}`} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Standard Delivery (£4.99)', to: '/faq' },
                  { label: 'Delivery Information', to: '/faq' },
                  { label: 'Returns & Refunds Policy', to: '/returns-policy' },
                  { label: 'Track & Manage Returns', to: '/account' },
                ].map(item => (
                  <li key={item.label} style={{ marginBottom: 10 }}>
                    <Link to={item.to} style={{
                      fontSize: 13,
                      color: '#111',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BOTTOM 3 SECTION ROW */}
          <div style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: 28,
            paddingBottom: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 32,
            alignItems: 'center',
          }} className="footer-bottom-grid">
            {/* Download our App */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                Download our App
              </p>
              <div className="footer-bottom-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {/* App Store Button */}
                <a href="#" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#000',
                  color: '#fff',
                  padding: '7px 14px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  minWidth: 120,
                }}>
                  <svg width="18" height="22" viewBox="0 0 24 29" fill="white">
                    <path d="M17.05 20.28c-.98 2.37-2.01 4.41-3.43 4.44-1.42.03-1.87-.84-3.5-.84-1.62 0-2.13.81-3.46.87-1.39.05-2.44-2.12-3.44-4.48C1.5 16.98.5 12.07 2.35 8.76c.92-1.64 2.57-2.68 4.36-2.71 1.36-.03 2.65.91 3.48.91.83 0 2.4-1.13 4.03-.97.69.03 2.62.28 3.85 2.1-.1.06-2.3 1.34-2.28 4 .03 3.17 2.78 4.22 2.81 4.23-.03.07-.44 1.53-1.55 3.96zM13 3.5C13.73 2.67 14 1.33 14 .5c-1 .07-2.2.67-2.9 1.5C10.43 2.77 10 4 10 5c1.1 0 2.22-.5 3-1.5z"/>
                  </svg>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>Download on the</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>App Store</div>
                  </div>
                </a>
                {/* Google Play Button */}
                <a href="#" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#000',
                  color: '#fff',
                  padding: '7px 14px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  minWidth: 130,
                }}>
                  <svg width="18" height="20" viewBox="0 0 512 512" fill="white">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l232.6-233L47 0zm425.6 225.6l-58.9-34-68.1 68 68.1 68 60.1-34c17-9.5 17-35.6-.2-45.6v-2.4zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>GET IT ON</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Sandreens Social */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                Sandreens Social
              </p>
              <div className="footer-bottom-row" style={{ display: 'flex', gap: 12 }}>
                {/* Instagram */}
                <a href={socialLinks.instagram || 'https://instagram.com/sandreens'} target="_blank" rel="noreferrer" aria-label="Instagram" style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'opacity .2s',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href={socialLinks.tiktok || 'https://tiktok.com/@sandreens'} target="_blank" rel="noreferrer" aria-label="TikTok" style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'opacity .2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.72a8.17 8.17 0 004.77 1.52V6.79a4.84 4.84 0 01-1-.1z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href={socialLinks.facebook || 'https://facebook.com/sandreens'} target="_blank" rel="noreferrer" aria-label="Facebook" style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'opacity .2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href={socialLinks.youtube || 'https://youtube.com/@sandreens'} target="_blank" rel="noreferrer" aria-label="YouTube" style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'opacity .2s',
                }}>
                  <svg width="18" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#111"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Pay by */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 12 }}>
                Pay by
              </p>
              <div className="footer-bottom-row" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Mastercard */}
                <svg width="40" height="26" viewBox="0 0 48 32">
                  <rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
                  <circle cx="18" cy="16" r="9" fill="#EB001B"/>
                  <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
                  <path d="M24 9.5a9 9 0 0 1 0 13A9 9 0 0 1 24 9.5z" fill="#FF5F00"/>
                </svg>
                {/* Visa */}
                <svg width="40" height="26" viewBox="0 0 48 32">
                  <rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
                  <text x="7" y="22" fontFamily="Arial" fontWeight="900" fontSize="14" fill="#1A1F71">VISA</text>
                </svg>
                {/* Apple Pay */}
                <svg width="50" height="26" viewBox="0 0 60 32">
                  <rect width="60" height="32" rx="4" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
                  <text x="6" y="21" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#000">Apple Pay</text>
                </svg>
                {/* Google Pay */}
                <svg width="50" height="26" viewBox="0 0 62 32">
                  <rect width="62" height="32" rx="4" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
                  <text x="5" y="21" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#000">G Pay</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* LEGAL TEXT */}
        <div style={{
          borderTop: '1px solid #e8e8e8',
          padding: '16px 40px',
          background: '#fff',
          maxWidth: '100%',
        }}>
          <p style={{
            fontSize: 11,
            color: '#999',
            lineHeight: 1.6,
            textAlign: 'center',
            maxWidth: 1200,
            margin: '0 auto',
          }}>
            Pay Sandreens credit provided, subject to credit and account status, by{' '}
            <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>
              J D Williams &amp; Company Limited trading as Sandreens.
            </a>
            {' '}Registered Office: Griffin House, 40 Lever Street, Manchester, M60 6ES. Registered
            number: 178367.{' '}
            <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>
              Authorised and regulated by the Financial Conduct Authority.
            </a>
            {' '}Statements are issued on a 28 day cycle.{' '}
            <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>
              Over 18's only.
            </a>
          </p>

          {/* Terms / Privacy links */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap',
            marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0',
          }}>
            <Link to="/terms" style={{ fontSize: 12, fontWeight: 600, color: '#767676', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
            >
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" style={{ fontSize: 12, fontWeight: 600, color: '#767676', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
            >
              Privacy Policy
            </Link>
            <Link to="/faq" style={{ fontSize: 12, fontWeight: 600, color: '#767676', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
            >
              Help Centre
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
