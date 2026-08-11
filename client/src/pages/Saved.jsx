import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Saved() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, totalSaved } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToBag = (product) => {
    // No size chosen from this page, so default to empty; user can adjust in bag/detail
    addToCart(product, '', 1);
    navigate('/cart');
  };

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        {/* Page Heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0 }}>Saved Items</h1>
          <span style={{ fontSize: 14, fontWeight: 400, color: '#767676' }}>
            ({totalSaved} item{totalSaved !== 1 ? 's' : ''})
          </span>
        </div>

        {wishlist.length === 0 ? (
          /* Empty */
          <div style={{ background: '#fff', borderRadius: 8, padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <p style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>You haven't saved any items yet.</p>
            <Link to="/all-things-new" style={{
              display: 'inline-block', background: '#008037', color: '#fff',
              padding: '12px 32px', borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: 'none'
            }}>
              Start shopping
            </Link>
          </div>
        ) : (
          /* Grid of saved products */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20
          }}>
            {wishlist.map((product) => {
              const image = product.images?.[0] || product.imageUrl || '/product1.png';
              const displayPrice = product.salePrice ?? product.price;
              const hasSale = product.salePrice != null && product.salePrice < product.price;

              return (
                <div key={product._id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  {/* Remove (X) button */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    style={{
                      position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%',
                      background: '#fff', border: 'none', cursor: 'pointer', zIndex: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                    }}
                    title="Remove from saved"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>

                  {/* Image (click to view detail) */}
                  <Link to={`/products/${product._id}`}>
                    <img src={image} alt={product.name} style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '12px 14px 16px' }}>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 6px', minHeight: 34 }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: hasSale ? '#c0392b' : '#111' }}>
                        £{Number(displayPrice).toFixed(2)}
                      </span>
                      {hasSale && (
                        <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
                          £{Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToBag(product)}
                      style={{
                        width: '100%', background: '#008037', color: '#fff', border: 'none',
                        padding: '10px', borderRadius: 30, fontSize: 12, fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}