import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PaymentCancel() {
  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: '40px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>Payment cancelled</h1>
          <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
            No worries — your bag is still saved. You can try again whenever you're ready.
          </p>
          <Link to="/cart" style={{ background: '#008037', color: '#fff', padding: '12px 28px', borderRadius: 30, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Back to bag
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}