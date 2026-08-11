import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
export default function ProductCard({ product }) {
  const { isSaved, toggleWishlist } = useWishlist();
  const liked = isSaved(product._id);
  const [hovered, setHovered] = useState(false);

  const image = product.images?.[0] || product.imageUrl || '/product1.png';
  // 2nd chhobi thakle hover er jonno, na thakle 1st tai
  const hoverImage = product.images?.[1] || image;
  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice != null && product.salePrice < product.price;

  return (
    <Link
      to={`/products/${product._id}`}
      style={{ display: 'flex', flexDirection: 'column', position: 'relative', textDecoration: 'none', color: 'inherit' }}
    >
      {/* Image box */}
      <div
        className="prod-card-img-wrap"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 1st image */}
        <img
          src={image}
          alt={product.name}
          className="prod-card-img"
          style={{
            transition: 'opacity 0.4s ease',
            opacity: hovered && hoverImage !== image ? 0 : 1,
          }}
        />
        {/* 2nd image (hover e dekhabe) — shudhu 2nd chhobi thakle */}
        {hoverImage !== image && (
          <img
            src={hoverImage}
            alt={product.name}
            className="prod-card-img"
            style={{
              position: 'absolute', top: 0, left: 0,
              transition: 'opacity 0.4s ease',
              opacity: hovered ? 1 : 0,
            }}
          />
        )}

        {/* Badge (New In / Sale / 40% OFF etc) */}
        {product.badge && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: '#111', color: '#fff',
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.5px', padding: '5px 10px', borderRadius: 20,
          }}>
            {product.badge}
          </span>
        )}

        {/* Heart / like button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          style={{
            position: 'absolute', bottom: 12, right: 12, width: 34, height: 34, borderRadius: '50%',
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? '#111' : 'none'} stroke="#111" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div style={{ padding: '12px 0' }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 6 }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: hasSale ? '#c0392b' : '#111' }}>
            £{Number(displayPrice).toFixed(2)}
          </span>
          {hasSale && (
            <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
              £{Number(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}