import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useChat } from '../context/ChatContext';


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
const { user } = useAuth();
const navigate = useNavigate();
const { addToCart } = useCart();
const { isSaved, toggleWishlist } = useWishlist();
const { openChat } = useChat();
  const [addedMsg, setAddedMsg] = useState('');
  const [announcement, setAnnouncement] = useState(null);
  const [loadingAnnounce, setLoadingAnnounce] = useState(true);
  const [tcOpen, setTcOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sizeGuide, setSizeGuide] = useState({ text: '', image: '' });

  useEffect(() => {
    api.get('/cms/announcement')
      .then(res => {
        if (res.data && res.data.data) {
          setAnnouncement(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAnnounce(false));

    api.get('/settings')
      .then(res => {
        if (res.data) {
          setSizeGuide({
            text: res.data.sizeGuideText || '',
            image: res.data.sizeGuideImage || ''
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleAddToBag = () => {
    if (product.sizesEnabled !== false && !selectedSize) {
      setAddedMsg('Please select a size first');
      setTimeout(() => setAddedMsg(''), 2500);
      return;
    }
    const sizeToSelect = product.sizesEnabled !== false ? selectedSize : '';
    addToCart(product, sizeToSelect, 1);
    setAddedMsg('Added to bag!');
    setTimeout(() => setAddedMsg(''), 2500);
  };
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews for this product
  useEffect(() => {
    api.get(`/products/${id}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [id]);

  const handleSubmitReview = async () => {
    setReviewError('');
    if (newRating === 0) { setReviewError('Please select a star rating'); return; }
    if (!newComment.trim()) { setReviewError('Please write your review'); return; }
    setSubmitting(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, { rating: newRating, comment: newComment });
      setReviews(prev => [res.data, ...prev]);
      setShowReviewForm(false);
      setNewRating(0);
      setNewComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  useEffect(() => {
    // Reset active image on id change
    setActiveImageIndex(0);
    // Fetch product details
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
        // Fetch related products belonging to the same category
        if (res.data && res.data.category) {
          api.get(`/products?category=${encodeURIComponent(res.data.category)}`)
            .then((r) => {
              setRelatedProducts(r.data.filter((p) => p._id !== res.data._id).slice(0, 5));
            })
            .catch((e) => console.error(e));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 600 }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 600 }}>Product not found.</p>
        <Link to="/" style={{ marginTop: 12, textDecoration: 'underline' }}>Back to Home</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500']);
  const originalPrice = product.price;
  const salePrice = product.salePrice;
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['10', '12', '14', '16', '18', '20', '22'];

  const specs = [];
  if (product.dimensions) {
    specs.push({ key: 'Dimensions', value: product.dimensions });
  }
  if (product.materials) {
    specs.push({ key: 'Materials', value: product.materials });
  }
  if (specs.length === 0) {
    specs.push({ key: 'Materials', value: '100% Cotton' });
  }

  const care = product.careInstructions && product.careInstructions.length > 0
    ? product.careInstructions
    : [
      'Machine washable'
    ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Product Details Area */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {/* Breadcrumb Back Button */}
        <div style={{ marginBottom: 20 }}>
          <Link to="/all-things-new" style={{ fontSize: 12, fontWeight: 700, textDecoration: 'underline', color: '#111', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>←</span> Dresses
          </Link>
        </div>

        {/* Price Tag & Promo badge */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            {salePrice ? (
              <>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#111' }}>£{Number(salePrice).toFixed(0)}</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#767676', textDecoration: 'line-through' }}>£{Number(originalPrice).toFixed(0)}</span>
              </>
            ) : (
              <span style={{ fontSize: 32, fontWeight: 800, color: '#111' }}>£{Number(originalPrice).toFixed(0)}</span>
            )}
            {loadingAnnounce ? (
              <span className="skeleton-announce-bar" style={{
                width: '180px',
                height: '24px',
                borderRadius: '20px',
                marginLeft: '12px',
                verticalAlign: 'middle'
              }} />
            ) : announcement && announcement.text ? (
              <span 
                onClick={() => setTcOpen(true)}
                style={{
                  background: '#fcf0e6',
                  color: '#111',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  verticalAlign: 'middle',
                  cursor: 'pointer'
                }}
              >
                {announcement.text} &gt;
              </span>
            ) : null}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 24px', letterSpacing: '-0.3px' }}>
          {product.name}
        </h1>

        {/* Main Grid: Left Side Image Gallery, Right Side Info Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="prod-detail-grid">

          {/* LEFT: Image Gallery with Thumbnails (with next image peek & slide animation) */}
          <div style={{ position: 'relative', width: '100%' }}>
            
            {/* Viewport container with rounded corners and overflow hidden */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', background: '#f5f5f5', overflow: 'hidden', borderRadius: '16px' }}>
              
              {/* Flex Slider Track */}
              <div style={{
                display: 'flex',
                gap: images.length > 1 ? '1.5%' : '0%',
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: images.length > 1 ? `translate3d(-${activeImageIndex * 83.5}%, 0, 0)` : 'none',
                width: '100%',
                height: '100%'
              }}>
                {images.map((img, i) => (
                  <div key={i} style={{
                    width: images.length > 1 ? '82%' : '100%',
                    flexShrink: 0,
                    height: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '16px'
                  }}>
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Zoom Button inside the active slide bottom corner */}
                    <button
                      style={{
                        position: 'absolute',
                        right: '16px',
                        bottom: '16px',
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                        border: 'none',
                        zIndex: 10,
                      }}
                      title="Zoom Image"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Next arrow overlaid on the slide transition boundary */}
              {images.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                  style={{
                    position: 'absolute',
                    left: '82%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    border: 'none',
                    zIndex: 10,
                  }}
                  title="Next Image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>

            {/* Thumbnail row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    style={{
                      flex: '0 0 auto',
                      width: 70,
                      height: 92,
                      padding: 0,
                      cursor: 'pointer',
                      border: activeImageIndex === i ? '2px solid #111' : '1px solid #e0e0e0',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: '#f5f5f5',
                      opacity: activeImageIndex === i ? 1 : 0.65,
                      transition: 'opacity 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => { if (activeImageIndex !== i) e.currentTarget.style.opacity = 0.65; }}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Ordering & Selection widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            
            {/* Need size help? */}
            {product.sizesEnabled !== false && (
              <div style={{
                background: '#fff',
                border: '1px solid #e8e8e8',
                padding: '12px 20px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '12px',
                fontWeight: 700,
                color: '#111',
                marginBottom: '16px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <rect x="2" y="7" width="20" height="10" rx="2" />
                  <line x1="6" y1="7" x2="6" y2="12" />
                  <line x1="10" y1="7" x2="10" y2="12" />
                  <line x1="14" y1="7" x2="14" y2="12" />
                  <line x1="18" y1="7" x2="18" y2="12" />
                </svg>
                <span>Need size help? <span onClick={() => setSizeOpen(true)} style={{ textDecoration: 'underline', color: '#0052cc', cursor: 'pointer' }}>View size guides</span></span>
              </div>
            )}

            {/* Colour and size selector */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#767676', textTransform: 'uppercase', fontWeight: 600 }}>Colour</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#111' }}>{product.category === 'Dresses' ? 'CHOCOLATE SPOT' : 'COLOURFUL'}</span>
              </div>

              {product.sizesEnabled !== false && (
                <div style={{ position: 'relative', width: '50%', minWidth: 160 }}>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      border: '1px solid #ccc',
                      borderRadius: '30px',
                      background: '#fff',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3'%3E%3Cpolyline points='9 18 15 12 9 6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 20px center',
                      backgroundSize: '12px',
                      paddingRight: '40px'
                    }}
                  >
                    <option value="">Select size</option>
                    {sizes.map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

{/* Add to Bag and Wishlist Row */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <button
                onClick={handleAddToBag}
                style={{
                  flex: 1,
                  background: '#1d7f43',
                  color: '#fff',
                  padding: '14px 24px',
                  fontSize: '13px',
                  fontWeight: 800,
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Add to bag
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: 48, height: 48, borderRadius: '50%', border: '1.5px solid #111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: '#fff'
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved(product._id) ? '#111' : 'none'} stroke="#111" strokeWidth="2.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => {
                if (!user) { navigate('/login'); return; }
                openChat({
                  productId: product._id,
                  name: product.name,
                  image: images[0],
                  link: `/products/${product._id}`,
                });
              }}
              style={{
                width: '100%',
                marginTop: 12,
                background: '#fff',
                color: '#111',
                border: '1.5px solid #111',
                padding: '12px 20px',
                borderRadius: 30,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              💬 Ask about this product
            </button>

            {addedMsg && (
              <p style={{
                marginTop: 10, fontSize: 13, fontWeight: 700,
                color: addedMsg.includes('select') ? '#d00' : '#1d7f43',
                textAlign: 'center'
              }}>
                {addedMsg}
              </p>
            )}
            {addedMsg && (
              <p style={{
                marginTop: 10, fontSize: 13, fontWeight: 700,
                color: addedMsg.includes('select') ? '#d00' : '#1d7f43',
                textAlign: 'center'
              }}>
                {addedMsg}
              </p>
            )}

           

          </div>
        </div>

        {/* About this product heading */}
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginTop: 44, marginBottom: 16 }}>
          About this product
        </h2>

        {/* Description Tabs & Text block */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr' }} className="about-prod-layout">
          {/* Left panel buttons */}
          <div style={{ borderRight: '1px solid #e8e8e8', background: '#fafafa' }}>
            <button style={{
              width: '100%', padding: '20px', display: 'flex', flexDirection: 'column',
              borderBottom: '1px solid #e8e8e8', background: '#fff',
              fontSize: 13, fontWeight: 800, color: '#111', textAlign: 'left', cursor: 'default'
            }}>
              <span>Product Details</span>
              <span style={{ display: 'block', fontSize: 10, color: '#767676', fontWeight: 500, marginTop: 2 }}>Description, material contents, care details etc</span>
            </button>
            <button style={{
              width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid #e8e8e8', background: 'none',
              fontSize: 13, fontWeight: 800, color: '#111', textAlign: 'left', cursor: 'pointer'
            }}>
              <div>
                <span>Delivery &amp; Returns</span>
                <span style={{ display: 'block', fontSize: 10, color: '#767676', fontWeight: 500, marginTop: 2 }}>Delivery cost and return options for this product</span>
              </div>
            </button>

            {/* Ratings & Reviews */}
            <div style={{ padding: 24, textAlign: 'center' }}>
              {/* Average star display */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: 20, color: s <= Math.round(avgRating) ? '#ffb400' : '#ccc' }}>
                    {s <= Math.round(avgRating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              {reviews.length > 0 ? (
                <p style={{ fontSize: 12, color: '#111', fontWeight: 700, marginBottom: 16 }}>
                  {avgRating} out of 5 · {reviews.length} review{reviews.length > 1 ? 's' : ''}
                </p>
              ) : (
                <p style={{ fontSize: 12, color: '#767676', lineHeight: 1.5, marginBottom: 16 }}>
                  No one has reviewed this product yet. Be the first to share your thoughts and help others make a choice.
                </p>
              )}

              {/* Write review button / form */}
              {!showReviewForm ? (
                <button
                  onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    setShowReviewForm(true);
                  }}
                  style={{
                    background: '#fff', color: '#111', border: '1.5px solid #111',
                    padding: '10px 24px', borderRadius: 30, fontSize: 12, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Write a review
                </button>
              ) : (
                <div style={{ textAlign: 'left', marginTop: 8 }}>
                  {/* Star picker */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        onClick={() => setNewRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ fontSize: 28, cursor: 'pointer', color: s <= (hoverRating || newRating) ? '#ffb400' : '#ccc' }}
                      >
                        {s <= (hoverRating || newRating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  {reviewError && <p style={{ color: 'red', fontSize: 12, margin: '8px 0 0' }}>{reviewError}</p>}
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      style={{ flex: 1, background: '#008037', color: '#fff', border: 'none', padding: '10px', borderRadius: 30, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      {submitting ? 'Submitting...' : 'Submit review'}
                    </button>
                    <button
                      onClick={() => { setShowReviewForm(false); setReviewError(''); }}
                      style={{ flex: 1, background: '#fff', color: '#111', border: '1.5px solid #111', padding: '10px', borderRadius: 30, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Existing reviews list */}
              {reviews.length > 0 && (
                <div style={{ marginTop: 24, textAlign: 'left' }}>
                  {reviews.map((r) => (
                    <div key={r._id} style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{r.name}</span>
                        <span style={{ fontSize: 11, color: '#999' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ fontSize: 13, color: s <= r.rating ? '#ffb400' : '#ccc' }}>
                            {s <= r.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5, margin: 0 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel specifications and descriptions */}
          <div style={{ padding: '24px 32px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 12 }}>Description</h3>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 28 }}>
              {product.description}
            </p>

            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 12 }}>Specifications</h3>
            <div style={{ marginBottom: 28 }}>
              {specs.map((sp) => (
                <div key={sp.key} style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#767676', display: 'block', textTransform: 'uppercase', marginBottom: 2 }}>{sp.key}</span>
                  <span style={{ fontSize: 13, color: '#111', fontWeight: 600 }}>{sp.value}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 12 }}>Care Instructions</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: 16, marginBottom: 28 }}>
              {care.map((item, index) => (
                <li key={index} style={{ fontSize: 13, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 4 }}>Product Code</h3>
            <span style={{ fontSize: 13, color: '#767676', fontFamily: 'monospace', fontWeight: 600 }}>
              {product.sku || 'SB-PD-092'}
            </span>
          </div>
        </div>

        {/* More from our collection heading */}
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginTop: 52, marginBottom: 12 }}>
          More from our collection
        </h2>
        <p style={{ fontSize: 12, color: '#767676', margin: '0 0 20px' }}>
          Products often viewed with this item and items like this
        </p>

        {/* Related Products horizontal list */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 12 }}>
              {relatedProducts.map((p) => {
                const pImg = p.images && p.images.length > 0 ? p.images[0] : p.imageUrl;
                return (
                  <Link to={`/products/${p._id || p.id}`} key={p._id || p.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: 220, flexShrink: 0 }}>
                    <div style={{ width: '100%', aspectRatio: '2/3', background: '#f5f5f5', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                      <img src={pImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                      {/* Heart icon on top-right of image */}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }}
                        style={{
                          position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%',
                          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer'
                        }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved(p._id) ? '#111' : 'none'} stroke="#111" strokeWidth="2.5">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ padding: '12px 0 0' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#111', display: 'block', marginBottom: 4 }}>
                        £{typeof p.price === 'number' ? p.price.toFixed(0) : p.price}
                      </span>
                      <h3 style={{ fontSize: 12, fontWeight: 600, color: '#555', margin: 0, height: 32, overflow: 'hidden' }}>
                        {p.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (min-width: 768px) {
          .prod-detail-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
          .about-prod-layout {
            grid-template-columns: 320px 1fr !important;
          }
        }
      `}</style>

      {/* ── TERMS & CONDITIONS DRAWER (RIGHT SLIDE) ── */}
      <div className={`drawer-right${tcOpen ? ' open' : ''}`}>
        <div className="drawer-bd" onClick={() => setTcOpen(false)} />
        <button className="drawer-right-close" onClick={() => setTcOpen(false)}>✕</button>
        <div className="drawer-pn-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{announcement?.linkText || '*T&Cs apply'}</h3>
            <button onClick={() => setTcOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#767676' }}>✕</button>
          </div>
          <div style={{ padding: 24, fontSize: 14, color: '#444', lineHeight: 1.6, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
            {announcement?.tcContent || 'No terms and conditions specified.'}
          </div>
        </div>
      </div>

      {/* ── SIZE GUIDE DRAWER (RIGHT SLIDE) ── */}
      <div className={`drawer-right${sizeOpen ? ' open' : ''}`}>
        <div className="drawer-bd" onClick={() => setSizeOpen(false)} />
        <button className="drawer-right-close" onClick={() => setSizeOpen(false)}>✕</button>
        <div className="drawer-pn-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Size Guide</h3>
            <button onClick={() => setSizeOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#767676' }}>✕</button>
          </div>
          <div style={{ padding: 24, fontSize: 14, color: '#444', lineHeight: 1.6, overflowY: 'auto' }}>
            {sizeGuide.text && (
              <div style={{ whiteSpace: 'pre-wrap', marginBottom: 24 }}>
                {sizeGuide.text}
              </div>
            )}
            {sizeGuide.image && (
              <img
                src={sizeGuide.image}
                alt="Size Guide Chart"
                style={{ width: '100%', height: 'auto', borderRadius: 4, border: '1px solid #eee' }}
              />
            )}
            {!sizeGuide.text && !sizeGuide.image && (
              <p style={{ color: '#767676', textAlign: 'center' }}>No size guide configured.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}