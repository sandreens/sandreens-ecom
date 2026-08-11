import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs')
      .then(res => {
        setBlogs(res.data.filter(b => b.isActive)); // shudhu active
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  // Content theke ekta chhoto excerpt banai
  const excerpt = (text = '') =>
    text.length > 120 ? text.slice(0, 120).trim() + '...' : text;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 72px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#767676', marginBottom: 8 }}>
            The Sandreens Journal
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>
            Latest Stories & Style Tips
          </h1>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 14 }}>Loading...</p>
        ) : blogs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 14 }}>No articles published yet.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28,
          }}>
            {blogs.map(blog => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: 12,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Cream header band (no image field in model, tai text-based cover) */}
                  <div style={{
                    background: '#f9f5f0', padding: '28px 22px',
                    borderBottom: '1px solid #e8e8e8',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#008037' }}>
                      Article
                    </span>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginTop: 8, lineHeight: 1.3 }}>
                      {blog.title}
                    </h2>
                  </div>
                  {/* Body */}
                  <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, flex: 1 }}>
                      {excerpt(blog.content)}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <span style={{ fontSize: 12, color: '#999' }}>By {blog.author}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#008037' }}>Read more →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}