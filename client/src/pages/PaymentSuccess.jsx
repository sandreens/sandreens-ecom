import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { verifySession } from '../services/paymentService';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { removeSelectedItems } = useCart();

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(3);
  const hasRun = useRef(false); // prevent double-run in StrictMode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No payment session found.');
      return;
    }

    const verify = async () => {
      try {
        const data = await verifySession(sessionId);
        setOrder(data);
        setStatus('success');
        removeSelectedItems(); // empty the bag after a successful order
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.response?.data?.message || 'Could not verify your payment.');
      }
    };
    verify();
  }, [sessionId]);

  useEffect(() => {
    if (status !== 'success') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/account');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: '40px 24px', textAlign: 'center' }}>

          {status === 'verifying' && (
            <>
              <p style={{ fontSize: 16, color: '#555' }}>Verifying your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              {/* Green check */}
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#008037" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>Payment successful!</h1>
              <p style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>Thank you for your order.</p>
              {order && (
                <p style={{ fontSize: 13, color: '#767676', marginBottom: 12 }}>
                  Order ID: <strong>{order._id.slice(-8).toUpperCase()}</strong> · Total: <strong>£{order.totalPrice?.toFixed(2)}</strong>
                </p>
              )}
              <p style={{ fontSize: 13, color: '#008037', fontWeight: 600, marginBottom: 24 }}>
                Redirecting to your orders in {countdown} seconds...
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/account" style={{ background: '#008037', color: '#fff', padding: '12px 28px', borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  View my orders
                </Link>
                <Link to="/all-things-new" style={{ background: '#fff', color: '#111', border: '1.5px solid #111', padding: '12px 28px', borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Continue shopping
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fdeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d00" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>Something went wrong</h1>
              <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>{errorMsg}</p>
              <Link to="/cart" style={{ background: '#008037', color: '#fff', padding: '12px 28px', borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Back to bag
              </Link>
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}