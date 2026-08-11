import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  // Khulei input e focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape chaple bondho + bairе click korle bondho
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api.get(`/products?search=${encodeURIComponent(query.trim())}`)
        .then(res => setResults(res.data.slice(0, 6)))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const goToResults = () => {
    if (!query.trim()) return;
    navigate(`/all-things-new?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const goToProduct = (id) => {
    navigate(`/products/${id}`);
    onClose();
  };

  const showDropdown = query.trim().length >= 2;

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Expanded input — Search button er jaygay boshbe */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#f4f4f4', border: '1.5px solid #111',
        borderRadius: 30, padding: '7px 14px',
        width: 280, maxWidth: '60vw',
        animation: 'searchExpand 0.25s ease',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && goToResults()}
          placeholder="Search products..."
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, fontWeight: 600, color: '#111', minWidth: 0,
          }}
        />
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#767676', lineHeight: 1, flexShrink: 0, padding: 0 }}
        >
          ✕
        </button>
      </div>

      {/* Dropdown — input er thik niche */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          width: 380, maxWidth: '85vw',
          background: '#fff', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: '1px solid #eee',
          zIndex: 500,
          maxHeight: '60vh', overflowY: 'auto',
        }}>
          {loading ? (
            <p style={{ fontSize: 13, color: '#999', padding: '18px', textAlign: 'center', margin: 0 }}>
              Searching...
            </p>
          ) : results.length === 0 ? (
            <p style={{ fontSize: 13, color: '#999', padding: '18px', textAlign: 'center', margin: 0 }}>
              No products found for "{query}"
            </p>
          ) : (
            <>
              {results.map(p => {
                const img = p.images?.[0] || p.imageUrl || '/product1.png';
                const price = p.salePrice ?? p.price;
                const hasSale = p.salePrice != null && p.salePrice < p.price;
                return (
                  <button
                    key={p._id}
                    onClick={() => goToProduct(p._id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', background: 'none', border: 'none',
                      borderBottom: '1px solid #f5f5f5', cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <img
                      src={img}
                      alt={p.name}
                      style={{ width: 42, height: 54, objectFit: 'cover', borderRadius: 4, background: '#f5f5f5', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: 11, color: '#767676', margin: '2px 0 0' }}>
                        {p.category}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: hasSale ? '#c0392b' : '#111' }}>
                        £{Number(price).toFixed(2)}
                      </span>
                      {hasSale && (
                        <span style={{ fontSize: 10, color: '#999', textDecoration: 'line-through' }}>
                          £{Number(p.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              <button
                onClick={goToResults}
                style={{
                  width: '100%', padding: '12px 0', background: 'none', border: 'none',
                  fontSize: 12, fontWeight: 700, color: '#008037', cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                View all results →
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes searchExpand {
          from { width: 40px; opacity: 0.5; }
          to { width: 280px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}