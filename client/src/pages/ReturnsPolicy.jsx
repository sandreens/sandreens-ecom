import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { RotateCcw, Clock, ShieldCheck, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnsPolicy() {
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: 'Inter, Arial, sans-serif' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: '#111', color: '#fff', padding: '50px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>
          Returns & Refunds Policy
        </h1>
        <p style={{ fontSize: 15, color: '#ccc', maxWidth: 580, margin: '0 auto' }}>
          Easy, transparent, and hassle-free 30-day returns policy for Sandreens customers.
        </p>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px' }}>
        {/* Highlight Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20, marginBottom: 40
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #eee' }}>
            <RotateCcw size={28} color="#111" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px' }}>30-Day Return Window</h3>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Return any unworn or unused items within 30 days of delivery.</p>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #eee' }}>
            <Clock size={28} color="#111" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px' }}>Fast Refunds</h3>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Refunds processed back to original payment within 3-5 working days.</p>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #eee' }}>
            <ShieldCheck size={28} color="#111" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px' }}>Hassle-Free Process</h3>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Initiate returns directly from your Customer Account dashboard.</p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid #eee', marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 20 }}>
            How to Return an Item
          </h2>

          <ol style={{ paddingLeft: 20, margin: 0, color: '#444', fontSize: 14, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 12 }}>
              <strong>Log in to your account:</strong> Go to <Link to="/account" style={{ color: '#008037', fontWeight: 700 }}>My Account</Link> and select the order containing the item you wish to return.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Select Return Item:</strong> Click on "Request Return", choose the reason for return, and confirm.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Package the Item:</strong> Pack the product securely in its original packaging with tags intact.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Post the Return:</strong> Send the package back to our Wednesbury fulfillment center.
            </li>
          </ol>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '24px 0' }} />

          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 12 }}>
            Return Conditions & Eligibility
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#555' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#008037" /> Items must be unworn, unwashed, and undamaged with original tags.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#008037" /> Footwear must be returned in the original shoe box undamaged.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#008037" /> Earrings, swimwear, and hygiene items can only be returned if sealed.
            </li>
          </ul>
        </div>

        {/* Need Help Box */}
        <div style={{ background: '#f0f7f2', padding: 28, borderRadius: 16, border: '1px solid #c8e6d2', textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#008037', marginBottom: 8 }}>
            Need help with a return or exchange?
          </h3>
          <p style={{ fontSize: 14, color: '#444', marginBottom: 16 }}>
            Our support team is happy to assist you with any questions regarding your refund status.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <a href="mailto:sandreens.26@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#111', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              <Mail size={16} /> sandreens.26@gmail.com
            </a>
            <a href="tel:+447882425764" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#111', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              <Phone size={16} /> +44 7882 425764
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
