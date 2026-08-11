import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const DELIVERY_FEE = 4.99;

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty, totalItems,
          isSelected, toggleSelect, selectAll, deselectAll,
          selectedItems, selectedItemsCount, selectedTotalPrice } = useCart();

  const subTotal = selectedTotalPrice;
  const grandTotal = selectedItems.length > 0 ? subTotal + DELIVERY_FEE : 0;
  const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        {/* Page Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0 }}>
            Bag <span style={{ fontSize: 14, fontWeight: 400, color: '#767676' }}>({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div style={{ background: '#fff', borderRadius: 8, padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>Your bag is empty.</p>
            <Link to="/all-things-new" style={{
              display: 'inline-block', background: '#008037', color: '#fff',
              padding: '12px 32px', borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: 'none'
            }}>
              Continue shopping
            </Link>
          </div>
        ) : (
          /* Cart with items: two-column layout */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="cart-grid">

            {/* LEFT: Items */}
            <div>
              {/* Select all bar */}
              <div style={{ background: '#fff', borderRadius: 8, padding: '12px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => allSelected ? deselectAll() : selectAll()}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#008037' }}
                />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>
                  Select all ({selectedItems.length}/{cartItems.length})
                </span>
              </div>

              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {/* Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 4 }}>
                      <input
                        type="checkbox"
                        checked={isSelected(item.product, item.size)}
                        onChange={() => toggleSelect(item.product, item.size)}
                        style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#008037' }}
                      />
                    </div>
                    {/* Image */}
                    <div style={{ width: 90, height: 120, flexShrink: 0, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>{item.name}</h3>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>£{Number(item.price).toFixed(2)}</p>
                      <p style={{ fontSize: 12, color: '#767676', margin: 0 }}>
                        {item.size ? `Size: ${item.size}` : ''} &nbsp;|&nbsp; Qty: {item.qty}
                      </p>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 14 }}>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => updateQty(item.product, item.size, item.qty - 1)}
                        style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
                      >−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product, item.size, item.qty + 1)}
                        style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
                      >+</button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product, item.size)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#111', fontSize: 13, fontWeight: 700, marginLeft: 'auto' }}
                    >
                      Remove
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Summary */}
            <div style={{ alignSelf: 'start' }}>
              <div style={{ background: '#fff', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Sub-total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>£{subTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #eee' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Delivery</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>+ £{DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>£{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  disabled={selectedItems.length === 0}
                  style={{
                    width: '100%',
                    background: selectedItems.length === 0 ? '#a5cbb3' : '#008037',
                    color: '#fff', border: 'none',
                    padding: '14px', borderRadius: 30, fontSize: 14, fontWeight: 800,
                    cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {selectedItems.length === 0 ? 'Select items to checkout' : `Go to checkout (${selectedItemsCount})`}
                </button>

                <p style={{ fontSize: 11, color: '#767676', marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
                  Delivery options are available during checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}