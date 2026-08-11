import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories?type=product'),
      api.get('/products')
    ]).then(([catRes, prodRes]) => {
      const cats = catRes.data.filter(c => !c.parentCategory);
      const prods = prodRes.data;
      
      const mapped = cats.map(cat => {
        const prod = prods.find(p => p.category === cat.name);
        return {
          name: cat.name,
          img: cat.image || (prod ? (prod.imageUrl || (prod.images && prod.images[0])) : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300')
        };
      });
      setCategories(mapped);
    }).catch(() => {
      setCategories([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="category-showcase-wrap" style={{ paddingBottom: 52 }}>
        <div className="sec-head" style={{ paddingBottom: 24 }}>
          <h2 style={{ textTransform: 'none', fontSize: 22, fontWeight: 700 }}>Shop by category</h2>
        </div>
        <div style={{ display: 'flex', gap: 12, maxWidth: 1200, margin: '0 auto', padding: '0 20px', overflowX: 'auto' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ width: 150, height: 180, background: '#f5f5f5', borderRadius: 4, flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="category-showcase-wrap" style={{ paddingBottom: 52 }}>
      <div className="sec-head" style={{ paddingBottom: 24 }}>
        <h2 style={{ textTransform: 'none', fontSize: 22, fontWeight: 700 }}>Shop by category</h2>
      </div>
      <div style={{
        display: 'flex',
        gap: 12,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 20px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {categories.map((c) => (
          <Link
            to={`/all-things-new?category=${encodeURIComponent(c.name)}`}
            key={c.name}
            style={{
              background: '#fff',
              border: '1px solid #e2e2e2',
              borderRadius: 4,
              padding: 8,
              width: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'border-color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e2e2'}
          >
            <img
              src={c.img}
              alt={c.name}
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 2 }}
            />
            <span style={{
              fontSize: 13, fontWeight: 700, color: '#111',
              marginTop: 10, textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.25,
            }}>
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}