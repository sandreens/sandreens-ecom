import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import CategoryShowcase from '../components/home/CategoryShowcase';
import TrendingNow from '../components/home/TrendingNow';
import Newsletter from '../components/home/TrustBadges';
import ProductGrid from '../components/product/ProductGrid';
import Testimonials from '../components/home/Testimonials';
import { Link } from 'react-router-dom';
import api from '../services/api';
/* ── Inline styles so each section exactly matches reference ── */

export default function Home() {
  const [instagramImages, setInstagramImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [userCounts, setUserCounts] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [reelLink, setReelLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [promoCards, setPromoCards] = useState([]);
  const [brandCollabData, setBrandCollabData] = useState({
    brandText: 'Nike',
    headingLine1: 'Designed by Nike',
    headingLine2: 'Loved by Sandreens YaY.',
    description: 'The ultimate collaboration is here. Shop our exclusive range of adidas styles, designed to fit and flatter every body. Because sport truly is for everyone YaY.',
    buttonText: 'Shop Nike',
    buttonLink: '/all-things-new?brand=Nike',
    image: '/adidas_shoe.png'
  });
  const [loadingCollab, setLoadingCollab] = useState(true);
  useEffect(() => {
    api.get('/products')
      .then(res => {
        const prods = res.data;
        const imgs = prods.slice(0, 4).map(p => p.imageUrl || (p.images && p.images[0])).filter(Boolean);
        while (imgs.length < 4) {
          imgs.push('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600');
        }
        setInstagramImages(imgs);
      })
      .catch(() => {
        setInstagramImages([
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600'
        ]);
      });

    api.get('/categories?type=brand')
      .then(res => setBrands(res.data))
      .catch(() => setBrands([]))
      .finally(() => setLoadingBrands(false));

    api.get('/promo-cards')
      .then(res => setPromoCards(Array.isArray(res.data) ? res.data : (res.data?.cards || res.data?.data || [])))
      .catch(() => {});

    api.get('/instagram-posts?limit=8')
      .then(async res => {
        const posts = Array.isArray(res.data) ? res.data : (res.data?.posts || res.data?.data || []);
        setInstagramPosts(posts);
        const uniqueUserIds = [...new Set(posts.map(p => p.user?._id).filter(Boolean))];
        const counts = {};
        await Promise.all(uniqueUserIds.map(async (id) => {
          try {
            const r = await api.get(`/instagram-posts/count/${id}`);
            counts[id] = r.data.count;
          } catch { counts[id] = 0; }
        }));
        setUserCounts(counts);
      })
      .catch(() => setInstagramPosts([]));
    api.get('/cms/brandCollab')
      .then(res => {
        if (res.data?.data) setBrandCollabData(prev => ({ ...prev, ...res.data.data }));
      })
      .catch(() => {})
      .finally(() => {
        setLoadingCollab(false);
      });

  }, []);



   

  const handleUpload = async () => {
    if (!imageFile || !reelLink.trim()) return alert('Please add both a photo and a Reel link');
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('reelLink', reelLink.trim());
    try {
      await api.post('/instagram-posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowUploadModal(false);
      setImageFile(null);
      setReelLink('');
      const res = await api.get('/instagram-posts?limit=8');
      setInstagramPosts(Array.isArray(res.data) ? res.data : (res.data?.posts || res.data?.data || []));
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };


  return (
    <div style={{ background: '#fff' }}>
      <Navbar />
      <HeroBanner />

      {/* ── NOT TO BE MISSED — Dynamic 3-Card Grid ── */}
      <div className="sec-head" style={{ paddingBottom: 24 }}>
        <h2 style={{ textTransform: 'none', fontSize: 22, fontWeight: 700 }}>Not to be missed</h2>
      </div>

      {(() => {
        const leftCard = promoCards.find(c => c.position === 'left');
        const rightTopCard = promoCards.find(c => c.position === 'right-top');
        const rightBottomCard = promoCards.find(c => c.position === 'right-bottom');

        if (promoCards.length === 0) {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '0 20px 52px' }} className="not-to-miss-grid">
              <div className="skeleton-announce-bar" style={{ height: 480, borderRadius: 8, opacity: 0.5 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="skeleton-announce-bar" style={{ height: 228, borderRadius: 8, opacity: 0.5 }} />
                <div className="skeleton-announce-bar" style={{ height: 228, borderRadius: 8, opacity: 0.5 }} />
              </div>
            </div>
          );
        }

        return (
          <div className="not-to-miss-grid-layout" style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px 24px',
          }}>

            {/* Main Grid */}
            <div style={{ display: 'grid', gap: 24 }} className="not-to-miss-grid">

              {/* LEFT TALL CARD */}
              {leftCard && (
                <Link
                  to={leftCard.linkType === 'product' && leftCard.productLink ? `/products/${leftCard.productLink._id || leftCard.productLink}` : (leftCard.categoryLink ? `/all-things-new?category=${encodeURIComponent(leftCard.categoryLink)}` : '/all-things-new')}
                  className="not-to-miss-left-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: '#111',
                    background: '#f5f5f5',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}
                >
                  <img
                    src={leftCard.imageUrl || leftCard.image || '/promo_card1.png'}
                    alt={leftCard.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {/* Text Content Overlay */}
                  <div style={{
                    position: 'absolute',
                    left: '8%',
                    bottom: '8%',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    maxWidth: '75%',
                  }}>
                    {leftCard.subtitle && (
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#111', letterSpacing: '1px', marginBottom: 4 }}>
                        {leftCard.subtitle}
                      </span>
                    )}
                    <h3 style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#111', lineHeight: 1.05, margin: '0 0 6px', letterSpacing: '-1.2px' }}>
                      {leftCard.title}
                    </h3>
                    {leftCard.highlight && (
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#d99e00', marginBottom: 18, letterSpacing: '-0.3px' }}>
                        {leftCard.highlight}
                      </span>
                    )}
                    <span style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#111',
                      textTransform: 'uppercase',
                      borderBottom: '2.5px solid #111',
                      paddingBottom: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}>
                      SHOP NOW
                    </span>
                  </div>
                </Link>
              )}

              {/* RIGHT COLUMN STACK */}
              <div className="not-to-miss-right-container" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>

                {/* RIGHT TOP CARD */}
                {rightTopCard && (
                  <Link
                    to={rightTopCard.linkType === 'product' && rightTopCard.productLink ? `/products/${rightTopCard.productLink._id || rightTopCard.productLink}` : (rightTopCard.categoryLink ? `/all-things-new?category=${encodeURIComponent(rightTopCard.categoryLink)}` : '/all-things-new')}
                    className="not-to-miss-right-card"
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      color: '#111',
                      background: '#f2f2f2',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      flex: 1
                    }}
                  >
                    <div className="rc-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                      {rightTopCard.subtitle && (
                        <span style={{ fontSize: 10, fontWeight: 850, textTransform: 'uppercase', color: '#767676', letterSpacing: '1px', marginBottom: 4 }}>
                          {rightTopCard.subtitle}
                        </span>
                      )}
                      <h3 style={{ fontSize: 24, fontWeight: 900, color: '#111', lineHeight: 1.1, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
                        {rightTopCard.title}
                      </h3>
                      {rightTopCard.highlight && (
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 14 }}>
                          {rightTopCard.highlight}
                        </span>
                      )}
                      <button style={{
                        background: '#111', color: '#fff', fontSize: 10, fontWeight: 800,
                        textTransform: 'uppercase', padding: '10px 22px', border: 'none',
                        borderRadius: 0, cursor: 'pointer', letterSpacing: '0.5px'
                      }}>
                        SHOP NOW
                      </button>
                    </div>
                    <div className="rc-img">
                      <img
                        src={rightTopCard.imageUrl || rightTopCard.image || '/promo_card2.png'}
                        alt={rightTopCard.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  </Link>
                )}

                {/* RIGHT BOTTOM CARD */}
                {rightBottomCard && (
                  <Link
                    to={rightBottomCard.linkType === 'product' && rightBottomCard.productLink ? `/products/${rightBottomCard.productLink._id || rightBottomCard.productLink}` : (rightBottomCard.categoryLink ? `/all-things-new?category=${encodeURIComponent(rightBottomCard.categoryLink)}` : '/all-things-new')}
                    className="not-to-miss-right-card"
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      color: '#111',
                      background: '#f2f2f2',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      flex: 1
                    }}
                  >
                    <div className="rc-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                      {rightBottomCard.subtitle && (
                        <span style={{ fontSize: 10, fontWeight: 850, textTransform: 'uppercase', color: '#767676', letterSpacing: '1px', marginBottom: 4 }}>
                          {rightBottomCard.subtitle}
                        </span>
                      )}
                      <h3 style={{ fontSize: 24, fontWeight: 900, color: '#111', lineHeight: 1.1, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
                        {rightBottomCard.title}
                      </h3>
                      {rightBottomCard.highlight && (
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#111', marginBottom: 14, letterSpacing: '-0.5px' }}>
                          {rightBottomCard.highlight}
                        </span>
                      )}
                      <button style={{
                        background: '#111', color: '#fff', fontSize: 10, fontWeight: 800,
                        textTransform: 'uppercase', padding: '10px 22px', border: 'none',
                        borderRadius: 0, cursor: 'pointer', letterSpacing: '0.5px'
                      }}>
                        SHOP NOW
                      </button>
                    </div>
                    <div className="rc-img">
                      <img
                        src={rightBottomCard.imageUrl || rightBottomCard.image || '/promo_card_pay.png'}
                        alt={rightBottomCard.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  </Link>
                )}

              </div>

            </div>



          </div>
        );
      })()}

      <style>{`
        /* ── MOBILE ONLY (< 768px) ── */
        @media (max-width: 767px) {
          .not-to-miss-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 16px;
          }

          /* Big left card — portrait/tall so overlay text never collides with the image's own text */
          .not-to-miss-left-card {
            aspect-ratio: 3/4;
            width: 100%;
            border-radius: 12px;
          }
          .not-to-miss-left-card img {
            object-position: center 20%;
          }

          /* Right two cards — stack ONE below the other, full width, NOT side-by-side */
          .not-to-miss-right-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px;
          }

          .not-to-miss-right-card {
            display: flex !important;
            flex-direction: column !important;
            min-height: unset;
            border-radius: 12px;
            overflow: hidden;
          }
          .not-to-miss-right-card .rc-img {
            order: 1;
            aspect-ratio: 16/9;
            height: auto !important;
            overflow: hidden;
            flex-shrink: 0;
          }
          .not-to-miss-right-card .rc-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 25%;
          }
          .not-to-miss-right-card .rc-text {
            order: 2;
            padding: 16px 18px !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .not-to-miss-right-card .rc-text h3 {
            font-size: 17px !important;
            margin: 0 0 6px !important;
          }
          .not-to-miss-right-card .rc-text span {
            display: inline !important;
            font-size: 10.5px !important;
          }
          .not-to-miss-right-card .rc-text button {
            font-size: 10.5px !important;
            padding: 9px 18px !important;
            margin-top: 8px;
          }
        }

        /* ── DESKTOP ONLY (≥ 768px) ── */
        @media (min-width: 768px) {
          .not-to-miss-grid {
            display: grid !important;
            grid-template-columns: 1.15fr 1fr !important;
            gap: 24px;
          }
          .not-to-miss-left-card {
            aspect-ratio: 1/1.12 !important;
            height: 100%;
            border-radius: 16px;
            overflow: hidden;
          }
          .not-to-miss-left-card img {
            object-fit: cover;
            object-position: center 25%;
          }
          /* Right column: stacked vertically */
          .not-to-miss-right-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px;
            height: 100%;
          }
          /* Each right card: text left, image right */
          .not-to-miss-right-card {
            display: grid !important;
            grid-template-columns: 1.25fr 1fr !important;
            flex: 1;
            min-height: unset;
            border-radius: 16px;
            overflow: hidden;
          }
          .not-to-miss-right-card .rc-img {
            order: 2 !important;
            height: 100% !important;
            aspect-ratio: unset !important;
          }
          .not-to-miss-right-card .rc-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 25%;
          }
          .not-to-miss-right-card .rc-text {
            order: 1 !important;
            padding: 24px 20px 24px 32px !important;
          }
          .not-to-miss-right-card .rc-text h3 {
            font-size: 22px !important;
            margin: 0 0 10px !important;
          }
          .not-to-miss-right-card .rc-text span {
            display: inline !important;
            font-size: 11px !important;
          }
          .not-to-miss-right-card .rc-text button {
            font-size: 10px !important;
            padding: 10px 22px !important;
            margin-top: 12px;
          }
        }
      `}</style>

      {/* ── EXTRA MOBILE-RESPONSIVE RULES (added — no colors / logic touched) ── */}
      <style>{`
        /* section head + product grid spacing tighten on small screens */
        @media (max-width: 767px) {
          .sec-head h2 { font-size: 19px !important; }
        }

        /* ── ADIDAS COLLAB ── */
        .adidas-collab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 52px;
        }
        @media (max-width: 767px) {
          .adidas-collab-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 40px !important;
          }
          .adidas-collab-img { height: 260px !important; }
          .adidas-collab-brand { font-size: 26px !important; margin-bottom: 10px !important; }
          .adidas-collab-heading { font-size: 20px !important; margin-bottom: 12px !important; }
          .adidas-collab-desc { font-size: 12.5px !important; max-width: 100% !important; margin-bottom: 18px !important; }
          .adidas-collab-btn { width: 100%; text-align: center; }
        }

        /* ── DISCOVER OUR BRANDS ── */
        @media (max-width: 767px) {
          .brands-section { padding: 28px 16px !important; }
          .brands-section p { font-size: 11px !important; letter-spacing: 1.5px !important; margin-bottom: 16px !important; }
          .brands-row { gap: 10px !important; }
          .brand-tile { width: calc(50% - 6px) !important; height: 56px !important; }
          .brands-arrow-btn { display: none !important; }
        }

        /* ── INSTAGRAM SECTION ── */
        @media (max-width: 767px) {
          .insta-heading { font-size: 19px !important; }
          .insta-desc { font-size: 13px !important; padding: 0 16px !important; }
          .insta-upload-btn { padding: 9px 22px !important; font-size: 12px !important; }
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
            padding: 0 12px !important;
          }
          .instagram-grid img { height: 200px !important; }
          .insta-nav-btn { display: none !important; }
        }

        /* ── UPLOAD MODAL ── */
        @media (max-width: 480px) {
          .upload-modal-box { width: 90vw !important; max-width: 340px !important; }
        }
      `}</style>


      {/* ── NEW IN — LIVE PRODUCTS FROM BACKEND ── */}

      <div className="sec-head" style={{ paddingBottom: 24 }}>
        <h2 style={{ textTransform: 'none', fontSize: 22, fontWeight: 700 }}>New in</h2>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 52px' }}>
        <ProductGrid limit={4} />
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link to="/all-things-new" className="btn-black" style={{ textDecoration: 'none' }}>
            View all
          </Link>
        </div>
      </div>

      {/* ── TRENDING NOW ── */}
      {/* ── SHOP BY CATEGORY ── */}
<CategoryShowcase />

{/* ── TRENDING NOW ── */}
<TrendingNow />
{/* ── CUSTOMER TESTIMONIALS ── */}
      <Testimonials />
    

      {/* ── BRAND COLLAB SECTION ── */}
      {loadingCollab ? (
        /* Skeleton loading layout when data is fetching */
        <div className="adidas-collab-grid" style={{
          maxWidth: 1260, margin: '0 auto',
          padding: '0 20px 52px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 52,
          alignItems: 'center',
        }}>
          {/* Image placeholder skeleton */}
          <div style={{
            width: '100%',
            height: 380,
            background: '#eee',
            borderRadius: 4,
            animation: 'pulse 1.5s infinite'
          }} />
          {/* Content text placeholder skeletons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: '40%', height: 38, background: '#eee', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '80%', height: 60, background: '#eee', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '100%', height: 80, background: '#eee', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '120px', height: 40, background: '#eee', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
      ) : (
        /* Actual loaded collab banner content */
        <div className="adidas-collab-grid" style={{
          maxWidth: 1260, margin: '0 auto',
          padding: '0 20px 52px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 52,
          alignItems: 'center',
        }}>
          {/* Image LEFT */}
          <Link to={brandCollabData.buttonLink} style={{ overflow: 'hidden', display: 'block' }}>
            <img
              className="adidas-collab-img"
              src={brandCollabData.image || '/adidas_shoe.png'}
              alt={`${brandCollabData.brandText} x Sandreens`}
              style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>
          {/* Text RIGHT */}
          <div>
            <span className="adidas-collab-brand" style={{
              fontSize: 38, fontWeight: 900, letterSpacing: '-2px',
              lineHeight: 1, display: 'block', marginBottom: 14,
            }}>{brandCollabData.brandText}</span>
            <h2 className="adidas-collab-heading" style={{
              fontSize: 28, fontWeight: 800, textTransform: 'uppercase',
              lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.3px',
            }}>{brandCollabData.headingLine1}<br />{brandCollabData.headingLine2}</h2>
            <p className="adidas-collab-desc" style={{ fontSize: 13, color: '#767676', lineHeight: 1.7, marginBottom: 24, maxWidth: 420 }}>
              {brandCollabData.description}
            </p>
            <Link to={brandCollabData.buttonLink} className="adidas-collab-btn" style={{
              display: 'inline-block', background: '#111', color: '#fff',
              fontSize: 11.5, fontWeight: 800, padding: '13px 28px',
              textTransform: 'uppercase', letterSpacing: '0.8px', textDecoration: 'none',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
            >{brandCollabData.buttonText}</Link>
          </div>
        </div>
      )}

      {/* ── DISCOVER OUR BRANDS (with arrow) ── */}
      <div className="brands-section" style={{
        background: '#f9f5f0',
        padding: '36px 20px',
        textAlign: 'center',
        borderTop: '1px solid #e8e8e8',
        borderBottom: '1px solid #e8e8e8',
      }}>
        <p style={{
          fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '2.5px', color: '#111', marginBottom: 20,
        }}>Discover our brands</p>
        <div className="brands-row" style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 16, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto'
        }}>
          {loadingBrands ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="skeleton-announce-bar brand-tile"
                style={{
                  width: 170,
                  height: 64,
                  border: '1px solid #e0e0e0',
                  background: '#fff',
                  opacity: 0.5
                }}
              />
            ))
          ) : brands.length === 0 ? (
            <p style={{ fontSize: 13, color: '#767676' }}>No brands added yet.</p>
          ) : (
            brands.map(b => (
              <Link to={`/all-things-new?brand=${encodeURIComponent(b.name)}`} key={b._id} className="brand-tile" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                border: '1px solid #e0e0e0',
                width: 170,
                height: 64,
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                {b.image ? (
                  <img src={b.image} alt={b.name} style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: '#111', letterSpacing: '1px' }}>
                    {b.name}
                  </span>
                )}
              </Link>
            ))
          )}
          {/* Arrow */}
          <button className="brands-arrow-btn" style={{
            width: 36, height: 36, border: '1.5px solid #111',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', background: '#fff',
            marginLeft: 8,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f3f3'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
<div style={{ padding: '0 0 52px' }}>
  <div className="sec-head" style={{ paddingBottom: 16, textAlign: 'center' }}>
    <h2 className="insta-heading" style={{ fontSize: 22, fontWeight: 800, textTransform: 'none', color: '#111' }}>
      Follow @sandreensuk on Instagram
    </h2>
    <p className="insta-desc" style={{ fontSize: 14, color: '#111', marginTop: 12, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
      We love to see how our community styles their Sandreens looks. Share your newest haul on Instagram, tag @sandreensuk in your caption or hashtag #mysandreensstyle
    </p>
    <button onClick={() => setShowUploadModal(true)} className="insta-upload-btn" style={{
      marginTop: 20,
      background: '#fff', border: '1.5px solid #111', borderRadius: 30,
      padding: '10px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
    }}>
      Upload your photo
    </button>
  </div>

  <div style={{ position: 'relative', maxWidth: 1260, margin: '0 auto' }}>
    <div className="instagram-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 3,
      padding: '0 20px',
    }}>
      {instagramPosts.map((post) => (
        <a
          href={post.reelLink}
          target="_blank"
          rel="noopener noreferrer"
          key={post._id}
          style={{ position: 'relative', overflow: 'hidden', display: 'block' }}
        >
          <img src={post.image} alt="Community look" style={{
            width: '100%', height: 320, objectFit: 'cover',
            objectPosition: 'top', display: 'block',
            transition: 'transform .4s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
          }}>
            {post.user?.name || 'User'} · {userCounts[post.user?._id] ?? 0} posts
          </div>
        </a>
      ))}
    </div>

    <button className="insta-nav-btn" style={{
      position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
      width: 36, height: 36, borderRadius: '50%', background: '#fff',
      border: '1.5px solid #111', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
      zIndex: 10,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button className="insta-nav-btn" style={{
      position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
      width: 36, height: 36, borderRadius: '50%', background: '#fff',
      border: '1.5px solid #111', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
      zIndex: 10,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>

  {showUploadModal && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div className="upload-modal-box" style={{ background: '#fff', padding: 24, width: 320, borderRadius: 8 }}>
        <h3 style={{ marginBottom: 16 }}>Upload your photo</h3>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ marginBottom: 12, display: 'block' }} />
        <input type="text" placeholder="Instagram Reel link" value={reelLink} onChange={e => setReelLink(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleUpload} disabled={uploading} style={{ flex: 1, background: '#111', color: '#fff', padding: 10, border: 'none', borderRadius: 4 }}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: 10, border: '1px solid #ccc', background: '#fff', borderRadius: 4 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>


      <Footer />
    </div>
  );
}