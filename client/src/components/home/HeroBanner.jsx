import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function HeroBanner() {
  const [hero, setHero] = useState(null);
  const [hotRightNow, setHotRightNow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cms/hero')
      .then(res => setHero(res.data.data)) // controller data field er vitore rakhe
      .catch(() => setHero(null)) // na thakle default hardcoded value use hobe
      .finally(() => setLoading(false));

    api.get('/cms/hotRightNow')
      .then(res => setHotRightNow(res.data.data))
      .catch(() => setHotRightNow(null));
  }, []);

  if (loading) {
    return (
      <div className="hero-section">
        <div className="hero" style={{ height: 580, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear'
          }} />
        </div>
      </div>
    );
  }

  // Admin theke set na thakle age jemon chhilo temon default
  const title = hero?.title || 'SUMMER LIVING';
  const subtitle = hero?.subtitle || 'The new you need';
  const ctaText = hero?.ctaText || "See what's new";
  const ctaLink = hero?.ctaLink || '/all-things-new';
  const heroImage = hero?.desktopImage || '/hero_banner.png';

  const defaultButtons = [
    { label: 'Shop New In', link: '/all-things-new' },
    { label: 'Shop Sandals', link: '/all-things-new?category=Footwear' },
    { label: 'Shop Tops', link: '/all-things-new?category=Tops' },
  ];

  const buttons = (hotRightNow?.buttons && hotRightNow.buttons.length > 0)
    ? hotRightNow.buttons
    : defaultButtons;

  return (
    <>
      {/* Hero contained in white-padded wrapper */}
      <div className="hero-section">
        <div className="hero">
          <Link to={ctaLink}>
            <img src={heroImage} alt={title} style={{ cursor: 'pointer' }} />
          </Link>
          <div className="hero-overlay">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-sub">{subtitle}</p>
            <Link to={ctaLink} className="hero-btn" style={{ textDecoration: 'none' }}>
              {ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Yellow "Hot Right Now" strip immediately below hero */}
      <div className="hot-strip">
        <h2 style={{ marginBottom: 12 }}>Hot Right Now</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {buttons.map((item, idx) => (
            <Link key={idx} to={item.link || item.to || '/all-things-new'} style={{
              display: 'inline-block',
              background: '#fff',
              color: '#111',
              fontSize: 12,
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: 30,
              textDecoration: 'none',
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f3f3f3'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}