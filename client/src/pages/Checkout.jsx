import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession } from '../services/paymentService';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import { X, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

const COUNTRIES = [
  { name: 'United Kingdom', code: 'GB', phoneCode: '+44' },
  { name: 'United States', code: 'US', phoneCode: '+1' },
  { name: 'Bangladesh', code: 'BD', phoneCode: '+880' },
  { name: 'Canada', code: 'CA', phoneCode: '+1' },
  { name: 'Australia', code: 'AU', phoneCode: '+61' },
  { name: 'Germany', code: 'DE', phoneCode: '+49' },
  { name: 'France', code: 'FR', phoneCode: '+33' },
  { name: 'Italy', code: 'IT', phoneCode: '+39' },
  { name: 'Spain', code: 'ES', phoneCode: '+34' },
  { name: 'Netherlands', code: 'NL', phoneCode: '+31' },
  { name: 'Sweden', code: 'SE', phoneCode: '+46' },
  { name: 'Norway', code: 'NO', phoneCode: '+47' },
  { name: 'Denmark', code: 'DK', phoneCode: '+45' },
  { name: 'Finland', code: 'FI', phoneCode: '+358' },
  { name: 'Ireland', code: 'IE', phoneCode: '+353' },
  { name: 'Switzerland', code: 'CH', phoneCode: '+41' },
  { name: 'Austria', code: 'AT', phoneCode: '+43' },
  { name: 'Belgium', code: 'BE', phoneCode: '+32' },
  { name: 'Portugal', code: 'PT', phoneCode: '+351' },
  { name: 'Poland', code: 'PL', phoneCode: '+48' },
  { name: 'India', code: 'IN', phoneCode: '+91' },
  { name: 'Pakistan', code: 'PK', phoneCode: '+92' },
  { name: 'United Arab Emirates', code: 'AE', phoneCode: '+971' },
  { name: 'Saudi Arabia', code: 'SA', phoneCode: '+966' },
  { name: 'Qatar', code: 'QA', phoneCode: '+974' },
  { name: 'Singapore', code: 'SG', phoneCode: '+65' },
  { name: 'Malaysia', code: 'MY', phoneCode: '+60' },
  { name: 'Japan', code: 'JP', phoneCode: '+81' },
  { name: 'South Korea', code: 'KR', phoneCode: '+82' },
  { name: 'China', code: 'CN', phoneCode: '+86' },
  { name: 'Brazil', code: 'BR', phoneCode: '+55' },
  { name: 'Mexico', code: 'MX', phoneCode: '+52' },
  { name: 'South Africa', code: 'ZA', phoneCode: '+27' },
  { name: 'New Zealand', code: 'NZ', phoneCode: '+64' },
  { name: 'Nigeria', code: 'NG', phoneCode: '+234' },
  { name: 'Egypt', code: 'EG', phoneCode: '+20' },
  { name: 'Turkey', code: 'TR', phoneCode: '+90' },
  { name: 'Greece', code: 'GR', phoneCode: '+30' },
  { name: 'Indonesia', code: 'ID', phoneCode: '+62' },
  { name: 'Philippines', code: 'PH', phoneCode: '+63' },
  { name: 'Vietnam', code: 'VN', phoneCode: '+84' },
  { name: 'Argentina', code: 'AR', phoneCode: '+54' },
  { name: 'Chile', code: 'CL', phoneCode: '+56' },
  { name: 'Colombia', code: 'CO', phoneCode: '+57' }
];

export default function Checkout() {
  const navigate = useNavigate();
  const { selectedItems, selectedTotalPrice } = useCart();
  const cartItems = selectedItems;
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic shipping config
  const [shippingFee, setShippingFee] = useState(3.99);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(50.00);

  // Country Search Dropdown State
  const [countrySearch, setCountrySearch] = useState('United Kingdom');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryRef = useRef(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Payment Method Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, customerName: f.customerName || user.name || '' }));
    }
  }, [user]);

  // Fetch Shipping Configuration from single source of truth endpoint
  useEffect(() => {
    api.get('/config/shipping')
      .then(res => {
        setShippingFee(Number(res.data.shippingFee));
        setFreeShippingThreshold(Number(res.data.freeShippingThreshold));
      })
      .catch(err => console.error('Failed to load shipping config', err));
  }, []);

  // Click outside country dropdown handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleCountrySearchChange = (e) => {
    const val = e.target.value;
    setCountrySearch(val);
    setForm({ ...form, country: val });
    setShowCountryDropdown(true);
    if (formErrors.country) {
      setFormErrors({ ...formErrors, country: '' });
    }
  };

  const handleSelectCountry = (countryObj) => {
    setForm({ ...form, country: countryObj.name });
    setCountrySearch(countryObj.name);
    setShowCountryDropdown(false);
    if (formErrors.country) {
      setFormErrors({ ...formErrors, country: '' });
    }
  };

  const selectedCountryObj = COUNTRIES.find(
    (c) => c.name.toLowerCase() === form.country.trim().toLowerCase()
  );

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.trim().toLowerCase())
  );

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) { setCouponError('Please enter a code'); return; }

    setApplyingCoupon(true);
    try {
      const res = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        subTotal: selectedTotalPrice,
      });
      setAppliedCoupon({ code: res.data.code, discount: res.data.discount });
      setCouponInput('');
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const subTotal = selectedTotalPrice;
  const discount = appliedCoupon?.discount || 0;
  const subTotalAfterDiscount = Math.max(subTotal - discount, 0);
  const calculatedShippingPrice = cartItems.length > 0 && subTotalAfterDiscount >= freeShippingThreshold ? 0 : shippingFee;
  const grandTotal = cartItems.length > 0 ? subTotalAfterDiscount + calculatedShippingPrice : 0;
  const nudgeAmount = freeShippingThreshold - subTotalAfterDiscount;

  const validateForm = () => {
    const errors = {};
    if (!form.customerName.trim()) errors.customerName = 'Full name is required';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    if (!form.addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required';
    if (!form.city.trim()) errors.city = 'City / Town is required';
    if (!form.postcode.trim()) {
      errors.postcode = 'Postcode is required';
    } else if (selectedCountryObj?.code === 'GB') {
      const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
      if (!ukPostcodeRegex.test(form.postcode.trim())) {
        errors.postcode = 'Please enter a valid UK postcode (e.g., EC1A 1BB)';
      }
    }
    if (!form.country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Triggered when user clicks main Pay button on Checkout page
  const handleOpenPaymentModal = () => {
    setError('');

    if (cartItems.length === 0) {
      setError('Your bag is empty');
      return;
    }

    if (!validateForm()) {
      setError('Please fill in all mandatory delivery details marked with (*)');
      return;
    }

    // Form is valid -> Open Payment Method Modal
    setShowPaymentModal(true);
  };

  // Triggered when user clicks "Proceed with Payment" inside Modal
  const handleProceedPayment = async () => {
    if (selectedPaymentMethod === 'paypal') {
      alert('PayPal payment is currently unavailable. Please select Credit / Debit Card, Google Pay, Apple Pay or Klarna.');
      return;
    }
    setSubmitting(true);
    try {
      const { url } = await createCheckoutSession({
        cartItems,
        couponCode: appliedCoupon?.code || null,
        paymentMethod: selectedPaymentMethod,
        customerName: form.customerName,
        phone: form.phone,
        shippingAddress: {
          fullName: form.customerName,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || '',
          city: form.city,
          postcode: form.postcode,
          countryCode: selectedCountryObj?.code || 'GB',
        },
      });
      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment. Please try again.');
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    height: 46,
    padding: '0 14px',
    border: formErrors[fieldName] ? '1.5px solid #d00' : '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color 0.2s',
  });

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#111',
    marginBottom: 6,
  };

  const requiredTag = (
    <span style={{ color: '#d00', marginLeft: 4 }}>*</span>
  );

  if (authLoading || !user) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', fontFamily: 'Inter, Arial, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 20 }}>Checkout</h1>

        {/* ── ORDER SUMMARY ── */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>Your order</h2>

          {cartItems.length === 0 ? (
            <p style={{ fontSize: 14, color: '#777' }}>Your bag is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} style={{ display: 'flex', gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: 60, height: 78, flexShrink: 0, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 4px' }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: '#767676', margin: 0 }}>
                      {item.size ? `Size: ${item.size} · ` : ''}Qty: {item.qty}
                    </p>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
                    £{(Number(item.price) * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* ── PROMO CODE ── */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: 14, marginBottom: 14 }}>
                {appliedCoupon ? (
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#e8f5ed', border: '1px solid #008037', borderRadius: 6, padding: '10px 12px',
                  }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#008037', fontFamily: 'monospace' }}>
                        {appliedCoupon.code}
                      </span>
                      <span style={{ fontSize: 12, color: '#555', marginLeft: 8 }}>applied</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#d00', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 6 }}>
                      Promo code
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter code"
                        style={{
                          flex: 1, height: 42, padding: '0 12px', border: '1px solid #ccc',
                          borderRadius: 4, fontSize: 14, fontWeight: 700, outline: 'none',
                          textTransform: 'uppercase', boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                        style={{
                          background: '#111', color: '#fff', border: 'none',
                          padding: '0 20px', borderRadius: 4, fontSize: 13, fontWeight: 700,
                          cursor: applyingCoupon ? 'not-allowed' : 'pointer', height: 42,
                        }}
                      >
                        {applyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p style={{ color: '#d00', fontSize: 12, margin: '6px 0 0' }}>{couponError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Totals */}
              {cartItems.length > 0 && nudgeAmount > 0 && (
                <div style={{
                  background: '#f9f9f9', borderLeft: '3px solid #008037', padding: '10px 14px',
                  borderRadius: 6, marginBottom: 14, fontSize: 12, color: '#333', fontWeight: 500,
                  textAlign: 'left'
                }}>
                  Add <strong>£{nudgeAmount.toFixed(2)}</strong> more to get <strong>FREE delivery</strong>!
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#111', marginBottom: 8 }}>
                <span>Sub-total</span><span>£{subTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#008037', fontWeight: 700, marginBottom: 8 }}>
                  <span>Discount ({appliedCoupon.code})</span><span>− £{discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#111', marginBottom: 8 }}>
                <span>Delivery</span><span>{calculatedShippingPrice === 0 ? 'FREE' : `+ £${calculatedShippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#111', borderTop: '1px solid #eee', paddingTop: 10, marginTop: 4 }}>
                <span>Total</span><span>£{grandTotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* ── SHIPPING FORM (DELIVERY DETAILS) ── */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Delivery details</h2>
            <span style={{ fontSize: 11, color: '#d00', fontWeight: 600 }}>* Mandatory fields</span>
          </div>

          {/* Account Email (Read-only) */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Account email (Read-only)
            </label>
            <input
              value={user.email}
              readOnly
              style={{
                ...getInputStyle(''),
                background: '#f5f5f5',
                color: '#666',
                cursor: 'not-allowed'
              }}
            />
            <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>
              Order confirmation and tracking details will be sent here.
            </p>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Full name {requiredTag}
            </label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
              style={getInputStyle('customerName')}
            />
            {formErrors.customerName && (
              <p style={{ color: '#d00', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{formErrors.customerName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Phone number {requiredTag}
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +44 7123 456789"
              style={getInputStyle('phone')}
            />
            {formErrors.phone && (
              <p style={{ color: '#d00', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{formErrors.phone}</p>
            )}
          </div>

          {/* Address Line 1 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Address Line 1 {requiredTag}
            </label>
            <input
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              placeholder="e.g. 12 Baker Street"
              style={getInputStyle('addressLine1')}
            />
            {formErrors.addressLine1 && (
              <p style={{ color: '#d00', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{formErrors.addressLine1}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Address Line 2 / Flat / Apt (Optional)
            </label>
            <input
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              placeholder="e.g. Flat 3B, Baker House"
              style={getInputStyle('addressLine2')}
            />
          </div>

          {/* City & Postcode */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                City / Town {requiredTag}
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. London"
                style={getInputStyle('city')}
              />
              {formErrors.city && (
                <p style={{ color: '#d00', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{formErrors.city}</p>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                Postcode {requiredTag}
              </label>
              <input
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                placeholder="e.g. EC1A 1BB"
                style={getInputStyle('postcode')}
              />
              {formErrors.postcode && (
                <p style={{ color: '#d00', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{formErrors.postcode}</p>
              )}
            </div>
          </div>

          {/* Searchable Country Dropdown with Flag Image */}
          <div style={{ position: 'relative', marginBottom: 4 }} ref={countryRef}>
            <label style={labelStyle}>
              Country {requiredTag}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {selectedCountryObj && (
                <span style={{ position: 'absolute', left: 12, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountryObj.code.toLowerCase()}.png`}
                    alt={selectedCountryObj.name}
                    style={{ width: 22, height: 15, borderRadius: 2, objectFit: 'cover', border: '1px solid #e0e0e0' }}
                  />
                </span>
              )}
              <input
                name="countrySearch"
                value={countrySearch}
                onChange={handleCountrySearchChange}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Type or select a country..."
                style={{
                  ...getInputStyle('country'),
                  paddingLeft: selectedCountryObj ? 44 : 14,
                }}
              />
              <span style={{ position: 'absolute', right: 14, fontSize: 10, color: '#888', pointerEvents: 'none' }}>
                ▼
              </span>
            </div>

            {formErrors.country && (
              <p style={{ color: '#d00', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{formErrors.country}</p>
            )}

            {/* Country Suggestions List */}
            {showCountryDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 220,
                  overflowY: 'auto',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 300,
                  marginTop: 4,
                }}
              >
                {filteredCountries.length === 0 ? (
                  <div style={{ padding: '12px 16px', fontSize: 13, color: '#888', textAlign: 'center' }}>
                    No country found matching "{countrySearch}"
                  </div>
                ) : (
                  filteredCountries.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => handleSelectCountry(c)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: c.name.toLowerCase() === form.country.toLowerCase() ? 700 : 500,
                        background: c.name.toLowerCase() === form.country.toLowerCase() ? '#f0f7f2' : '#fff',
                        borderBottom: '1px solid #f5f5f5',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f7f7')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          c.name.toLowerCase() === form.country.toLowerCase() ? '#f0f7f2' : '#fff')
                      }
                    >
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt={c.name}
                        style={{ width: 22, height: 15, borderRadius: 2, objectFit: 'cover', border: '1px solid #e0e0e0', flexShrink: 0 }}
                      />
                      <span style={{ color: '#111' }}>{c.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div style={{
            background: '#fdf2f2', border: '1px solid #f8b4b4', borderRadius: 8,
            padding: '12px 16px', marginBottom: 16, color: '#d00', fontSize: 13,
            fontWeight: 700, textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Main Pay button -> Opens Select Payment Method Modal */}
        <button
          onClick={handleOpenPaymentModal}
          disabled={submitting || cartItems.length === 0}
          style={{
            width: '100%', background: submitting ? '#6ba97f' : '#008037', color: '#fff', border: 'none',
            padding: '16px', borderRadius: 30, fontSize: 15, fontWeight: 800,
            cursor: submitting || cartItems.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,128,55,0.25)'
          }}
        >
          Pay £{grandTotal.toFixed(2)}
        </button>

        <p style={{ fontSize: 11, color: '#767676', textAlign: 'center', marginTop: 12 }}>
          🔒 Secure 256-bit encrypted checkout powered by Sandreens
        </p>
      </div>

      {/* ── SELECT PAYMENT METHOD MODAL ── */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 16,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: 480, borderRadius: 20,
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px', borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>
                  Select Payment Method
                </h3>
                <p style={{ fontSize: 12, color: '#777', margin: '2px 0 0' }}>
                  Total to pay: <strong style={{ color: '#008037', fontSize: 13 }}>£{grandTotal.toFixed(2)}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  background: '#f5f5f5', border: 'none', width: 32, height: 32,
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: '#555'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Payment Options List */}
            <div style={{ padding: '20px 24px', spaceY: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              {/* Option 1: Credit / Debit Card */}
              <div
                onClick={() => setSelectedPaymentMethod('card')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 14, border: selectedPaymentMethod === 'card' ? '2px solid #008037' : '1px solid #e0e0e0',
                  background: selectedPaymentMethod === 'card' ? '#f0f7f2' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 34, borderRadius: 8, background: '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    <CreditCard size={22} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Credit / Debit Card</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Visa, Mastercard, American Express</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => setSelectedPaymentMethod('card')}
                  style={{ width: 18, height: 18, accentColor: '#008037', cursor: 'pointer' }}
                />
              </div>

              {/* Option 2: PayPal */}
              <div
                onClick={() => setSelectedPaymentMethod('paypal')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 14, border: selectedPaymentMethod === 'paypal' ? '2px solid #008037' : '1px solid #e0e0e0',
                  background: selectedPaymentMethod === 'paypal' ? '#f0f7f2' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 34, borderRadius: 8, background: '#003087',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 2px 6px rgba(0,48,135,0.2)'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <path d="M26.9 8.6c-.7-2.6-3-4.1-7.2-4.1H8.3c-.7 0-1.3.5-1.4 1.2L2.1 27c-.1.5.3 1 .8 1h5.1c.7 0 1.3-.5 1.4-1.2l1.6-10.2h4.5c4.7 0 8.4-2.1 9.4-7.2.4-2 0-3.7-1-4.8z" fill="#003087"/>
                      <path d="M26.9 8.6c-.7-2.6-3-4.1-7.2-4.1H8.3c-.7 0-1.3.5-1.4 1.2L2.1 27c-.1.5.3 1 .8 1h5.1c.7 0 1.3-.5 1.4-1.2l1.6-10.2h4.5c4.7 0 8.4-2.1 9.4-7.2.4-2 0-3.7-1-4.8z" fill="#0079C1" opacity="0.5"/>
                      <path d="M12.8 15.6l-1.9 12c-.1.5.3 1 .8 1h4.4c.6 0 1.2-.5 1.3-1.1l1.5-9.3h2.6c3.9 0 7-1.7 7.8-6 0 0 .1-.5 0-.7-1.1 3.5-4.1 5.1-8.7 5.1h-4.3c-.6 0-1.2.5-1.3 1.1z" fill="#00457C"/>
                      <path d="M14.6 8.5h6.1c3.9 0 7 1.6 6.2 6-1 5.1-4.7 7.2-9.4 7.2h-4.5c-.7 0-1.3.5-1.4 1.2l-1.6 10.2" fill="#0079C1"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>PayPal</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Pay via PayPal account or Pay in 3</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={() => setSelectedPaymentMethod('paypal')}
                  style={{ width: 18, height: 18, accentColor: '#008037', cursor: 'pointer' }}
                />
              </div>

              {/* Option 3: Google Pay (GPay) */}
              <div
                onClick={() => setSelectedPaymentMethod('gpay')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 14, border: selectedPaymentMethod === 'gpay' ? '2px solid #008037' : '1px solid #e0e0e0',
                  background: selectedPaymentMethod === 'gpay' ? '#f0f7f2' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 34, borderRadius: 8, background: '#fff',
                    border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}>
                    <svg width="34" height="20" viewBox="0 0 60 36" fill="none">
                      <path d="M24.2 17.5v4.9h-1.6v-13h4.4c1.4 0 2.6.5 3.5 1.4.9.9 1.4 2 1.4 3.3s-.5 2.4-1.4 3.3c-.9.9-2.1 1.4-3.5 1.4h-2.8zm0-6.6v5.2h2.9c.9 0 1.7-.3 2.3-.9.6-.6.9-1.3.9-2.2 0-.9-.3-1.6-.9-2.2-.6-.6-1.4-.9-2.3-.9h-2.9z" fill="#5F6368"/>
                      <path d="M37.3 15.2c1.1 0 2 .3 2.6.9.6.6 1 1.4 1 2.5v5.3h-1.5v-1.2h-.1c-.7 1-1.6 1.5-2.7 1.5-1 0-1.8-.3-2.4-.8-.6-.5-.9-1.2-.9-2 0-.9.4-1.6 1.1-2.1.7-.5 1.7-.8 2.9-.8 1 0 1.9.2 2.5.6v-.4c0-.6-.2-1.1-.7-1.5-.5-.4-1.1-.6-1.8-.6-.9 0-1.7.4-2.2 1.1l-1.3-.8c.8-1.1 2.1-1.7 3.5-1.7zm-2.2 6.1c0 .4.2.7.5 1 .3.2.7.4 1.2.4.7 0 1.3-.3 1.8-.8.5-.5.8-1.1.8-1.8-.5-.4-1.3-.6-2.2-.6-.7 0-1.3.2-1.7.5-.3.3-.4.7-.4 1.3z" fill="#5F6368"/>
                      <path d="M48.8 15.5l-5.3 12.2h-1.7l2-4.3-3.5-7.9h1.8l2.5 6.1h.1l2.4-6.1h1.7z" fill="#5F6368"/>
                      <path d="M15.5 15.6c0-.5 0-1-.1-1.5H9v2.8h3.7c-.2.9-.7 1.7-1.5 2.2v1.8h2.4c1.4-1.3 2.2-3.3 2.2-5.3z" fill="#4285F4"/>
                      <path d="M9 22.2c2 0 3.6-.7 4.8-1.8l-2.4-1.8c-.6.4-1.4.7-2.4.7-1.9 0-3.4-1.3-4-3H2.5v1.9C3.8 20.7 6.2 22.2 9 22.2z" fill="#34A853"/>
                      <path d="M5 16.1c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6V11H2.5C2 12 1.7 13.1 1.7 14.5s.3 2.5.8 3.5l2.5-1.9z" fill="#FBBC04"/>
                      <path d="M9 6.8c1.1 0 2 .4 2.8 1.1l2.1-2.1C12.6 4.6 10.9 4 9 4 6.2 4 3.8 5.5 2.5 8.1l2.5 1.9c.6-1.7 2.1-3.2 4-3.2z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Google Pay (GPay)</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Fast 1-tap checkout via Google</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'gpay'}
                  onChange={() => setSelectedPaymentMethod('gpay')}
                  style={{ width: 18, height: 18, accentColor: '#008037', cursor: 'pointer' }}
                />
              </div>

              {/* Option 4: Apple Pay */}
              <div
                onClick={() => setSelectedPaymentMethod('applepay')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 14, border: selectedPaymentMethod === 'applepay' ? '2px solid #008037' : '1px solid #e0e0e0',
                  background: selectedPaymentMethod === 'applepay' ? '#f0f7f2' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 34, borderRadius: 8, background: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    <svg width="36" height="20" viewBox="0 0 64 36" fill="none">
                      <path d="M24.2 13.2c.4-.5.7-1.2.6-1.9-.6 0-1.4.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.8zm.6 1c-.9-.1-1.7.5-2.2.5-.5 0-1.2-.5-1.9-.5-1 0-1.9.6-2.4 1.5-1.1 1.9-.3 4.7.7 6.2.5.7 1.1 1.5 1.9 1.5.7 0 1-.4 1.9-.4.9 0 1.1.4 1.9.4.8 0 1.3-.7 1.8-1.4.6-.8.8-1.6.8-1.7 0 0-1.6-.6-1.6-2.4 0-1.5 1.2-2.2 1.3-2.3-1.1-1.6-2.6-1.7-2.8-1.8z" fill="#FFFFFF"/>
                      <path d="M33 13h-3.4v10.5h1.9v-3.7H33c2.4 0 4.1-1.6 4.1-3.4C37.1 14.6 35.4 13 33 13zm0 5h-1.5v-3.3H33c1.3 0 2.2.8 2.2 1.7s-.9 1.6-2.2 1.6z" fill="#FFFFFF"/>
                      <path d="M41.7 17.5c-1.3 0-2.3.9-2.4 2.1h4.6c0-1.2-1-2.1-2.2-2.1zm-4.3 2.2c0-2.3 1.7-4 4.3-4 2.5 0 4.1 1.6 4.1 4v.6h-6.5c.1 1.1 1 1.9 2.4 1.9 1 0 1.8-.4 2.3-1l1.3 1c-.9 1.2-2.1 1.8-3.7 1.8-2.6 0-4.2-1.7-4.2-4.3z" fill="#FFFFFF"/>
                      <path d="M46.7 15.7h1.9v1.2h.1c.4-.8 1.4-1.3 2.3-1.3.4 0 .7.1 1 .2l-.4 1.8c-.3-.1-.6-.2-1-.2-1 0-1.9.8-1.9 2.1v4h-2V15.7z" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Apple Pay</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Quick Touch ID / Face ID payment</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'applepay'}
                  onChange={() => setSelectedPaymentMethod('applepay')}
                  style={{ width: 18, height: 18, accentColor: '#008037', cursor: 'pointer' }}
                />
              </div>

              {/* Option 5: Klarna */}
              <div
                onClick={() => setSelectedPaymentMethod('klarna')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 14, border: selectedPaymentMethod === 'klarna' ? '2px solid #008037' : '1px solid #e0e0e0',
                  background: selectedPaymentMethod === 'klarna' ? '#f0f7f2' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 34, borderRadius: 8, background: '#FFB3C7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 2px 6px rgba(255,179,199,0.4)'
                  }}>
                    <svg width="38" height="20" viewBox="0 0 64 36" fill="none">
                      <path d="M18 12h2.8v12H18V12zm4.5 0h2.8v4.9l4.5-4.9h3.6l-5.3 5.7L29.2 24h-3.6l-4.5-5.6V24h-2.8V12zm14.3 5.4c0-1.8 1.4-2.8 3.2-2.8 1.8 0 3 .9 3.3 2.2h-6.5zm6.5 1.7c0 1.9-1.4 3.1-3.3 3.1-1.4 0-2.8-.7-3.1-2.1h-2.7c.4 2.8 2.7 4.5 5.8 4.5 3.6 0 6.1-2.1 6.1-5.7v-6.4h-2.7v1.1c-.6-.8-1.7-1.4-3.3-1.4-3.2 0-5.8 2.4-5.8 5.7 0 3.3 2.6 5.7 5.8 5.7 1.6 0 2.7-.6 3.2-1.4v.9zM48 24a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#0D0D0D"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Klarna</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Pay in 3 installments or 30 days later</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'klarna'}
                  onChange={() => setSelectedPaymentMethod('klarna')}
                  style={{ width: 18, height: 18, accentColor: '#008037', cursor: 'pointer' }}
                />
              </div>

            </div>

            {/* Modal Footer Action */}
            <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #eee', background: '#fafafa' }}>
              <button
                onClick={handleProceedPayment}
                disabled={submitting}
                style={{
                  width: '100%', background: submitting ? '#6ba97f' : '#008037',
                  color: '#fff', border: 'none', padding: '14px', borderRadius: 30,
                  fontSize: 15, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0,128,55,0.25)'
                }}
              >
                {submitting ? 'Connecting...' : `Proceed with ${selectedPaymentMethod.toUpperCase()} (£${grandTotal.toFixed(2)})`}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, color: '#777', fontSize: 11 }}>
                <ShieldCheck size={14} color="#008037" /> Guaranteed 256-bit Secure Encryption
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}