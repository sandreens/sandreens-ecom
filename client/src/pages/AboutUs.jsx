import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { MapPin, Phone, Mail, Award, Heart, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: 'Inter, Arial, sans-serif' }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{ background: '#111', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 12 }}>
          About Sandreens
        </h1>
        <p style={{ fontSize: 16, color: '#ccc', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
          Empowering style, comfort, and elegance. Welcome to Sandreens — your premier destination for curated fashion, footwear, and home collections.
        </p>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px' }}>
        {/* Our Story Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32, marginBottom: 56, alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 16 }}>
              Our Story & Mission
            </h2>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 16 }}>
              At Sandreens, we believe that fashion should be inclusive, flattering, and effortlessly stylish. Designed with attention to fit and premium quality, our collections bring together the latest trends and timeless wardrobe essentials.
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
              Whether you are shopping for everyday essentials, activewear collaborations, or unique home accents, Sandreens offers exceptional value and dedicated customer care.
            </p>
          </div>

          <div style={{
            background: '#fff', padding: 32, borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eee'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 20 }}>
              Why Choose Sandreens?
            </h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 10, height: 'fit-content' }}>
                <Award size={22} color="#111" />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>Premium Quality</h4>
                <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Crafted with long-lasting materials designed for comfort.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 10, height: 'fit-content' }}>
                <Heart size={22} color="#111" />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>Customer First</h4>
                <p style={{ fontSize: 13, color: '#666', margin: 0 }}>30-day returns and dedicated support team at your service.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 10, height: 'fit-content' }}>
                <ShieldCheck size={22} color="#111" />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>Secure Shopping</h4>
                <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Encrypted checkout and safe global payment options.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 36,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #eaeaea'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 8, textAlign: 'center' }}>
            Get in Touch
          </h2>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 }}>
            Have questions or need assistance? Reach out to our customer care team.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24
          }}>
            {/* Address */}
            <div style={{
              background: '#fafafa', padding: 24, borderRadius: 12, border: '1px solid #eee',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}>
              <div style={{ background: '#111', color: '#fff', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <MapPin size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>Address</h3>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5, margin: 0 }}>
                Nicks News, 5/6 Union Street,<br />
                Wednesbury, West Midlands WS10 7HD,<br />
                United Kingdom
              </p>
            </div>

            {/* Phone */}
            <div style={{
              background: '#fafafa', padding: 24, borderRadius: 12, border: '1px solid #eee',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}>
              <div style={{ background: '#111', color: '#fff', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Phone size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>Phone</h3>
              <a href="tel:+447882425764" style={{ fontSize: 14, fontWeight: 700, color: '#111', textDecoration: 'none' }}>
                +44 7882 425764
              </a>
              <p style={{ fontSize: 12, color: '#777', marginTop: 4 }}>Mon - Fri (9am - 6pm GMT)</p>
            </div>

            {/* Email */}
            <div style={{
              background: '#fafafa', padding: 24, borderRadius: 12, border: '1px solid #eee',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}>
              <div style={{ background: '#111', color: '#fff', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Mail size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>Email</h3>
              <a href="mailto:sandreens.26@gmail.com" style={{ fontSize: 14, fontWeight: 700, color: '#111', textDecoration: 'none' }}>
                sandreens.26@gmail.com
              </a>
              <p style={{ fontSize: 12, color: '#777', marginTop: 4 }}>Fast 24/7 Support Response</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
