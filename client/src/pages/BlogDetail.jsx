import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/${slug}`)
      .then(res => setBlog(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 72px' }}>
        {/* Back link */}
        <Link to="/blog" style={{ fontSize: 13, fontWeight: 700, color: '#111', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          <span>←</span> Back to all articles
        </Link>

        {loading ? (
          <p style={{ color: '#999', fontSize: 14 }}>Loading...</p>
        ) : notFound || !blog ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>Article not found.</p>
            <Link to="/blog" style={{ marginTop: 12, display: 'inline-block', textDecoration: 'underline' }}>Back to Journal</Link>
          </div>
        ) : (
          <article>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#008037' }}>
              Article
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', lineHeight: 1.2, letterSpacing: '-0.5px', margin: '10px 0 14px' }}>
              {blog.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 24, borderBottom: '1px solid #e8e8e8', marginBottom: 28 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: '#111',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15,
              }}>
                {blog.author?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>{blog.author}</p>
                <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
                  {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Content — whiteSpace pre-line diye line break rakhi */}
            <div style={{ fontSize: 16, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {blog.content}
            </div>
          </article>
        )}
      </div>

      <Footer />
    </div>
  );
}