import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function TrendingNow() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trending-cards')
      .then(res => setCards(res.data))
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  // Build URL from card object
  const buildUrl = (card) => {
    const categories = card.categories || [];
    const titleParam = card.title ? `&title=${encodeURIComponent(card.title)}` : '';
    if (categories.length === 0) return `/all-things-new?${titleParam.slice(1)}`;
    if (categories.length === 1) return `/all-things-new?category=${encodeURIComponent(categories[0])}${titleParam}`;
    return `/all-things-new?category=${categories.map(encodeURIComponent).join(',')}${titleParam}`;
  };

  if (loading) {
    return (
      <div className="trending-wrap" style={{ paddingBottom: 52 }}>
        <div className="sec-head" style={{ paddingBottom: 24 }}>
          <h2 style={{ textTransform: 'none', fontSize: 28, fontWeight: 800, textAlign: 'center', margin: 0 }}>Trending now</h2>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ aspectRatio: '3/4', background: '#f0f0f0', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className="trending-wrap" style={{ paddingBottom: 52, background: '#fff' }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', padding: '40px 20px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.5px' }}>
          Trending now
        </h2>
      </div>

      {/* 4-column card grid */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}
      className="trending-grid"
      >
        {cards.map(card => (
          <Link
            key={card._id}
            to={buildUrl(card)}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.querySelector('img') && (e.currentTarget.querySelector('img').style.transform = 'scale(1.04)')}
              onMouseLeave={e => e.currentTarget.querySelector('img') && (e.currentTarget.querySelector('img').style.transform = 'scale(1)')}
            >
              {/* Image */}
              <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.35s ease',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Title below image */}
            <p style={{
              margin: '10px 0 0',
              fontSize: 14,
              fontWeight: 700,
              color: '#111',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {card.title}
            </p>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trending-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}