import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => {
        // shudhu active gula dekhabo
        setTestimonials(res.data.filter(t => t.isActive));
      })
      .catch(() => setTestimonials([]));
  }, []);

  // Kono testimonial na thakle section tai dekhabo na
  if (testimonials.length === 0) return null;

  return (
    <div style={{ background: '#fff', padding: '52px 20px', borderTop: '1px solid #e8e8e8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#767676', marginBottom: 8 }}>
            What our customers say
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>
            Loved by thousands
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {testimonials.map(t => (
            <div key={t._id} style={{
              background: '#f9f5f0',
              borderRadius: 12,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ fontSize: 18, color: s <= t.rating ? '#ffb400' : '#ddd' }}>
                    {s <= t.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>

              {/* Content */}
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>
                "{t.content}"
              </p>

              {/* Customer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', background: '#111',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16, flexShrink: 0,
                }}>
                  {t.customerName?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#111', margin: 0 }}>{t.customerName}</p>
                  <p style={{ fontSize: 12, color: '#767676', margin: 0 }}>{t.designation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}