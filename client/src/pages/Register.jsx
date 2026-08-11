import React, { useState } from 'react';
import { Lock, Eye, X, Mail, Phone as PhoneIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState({
    email: null, // null, 'yes', 'no'
    post: null,
    phone: null
  });
  const { register } = useAuth();

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    setLoading(true);
    try {
      await register({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePreference = (type, val) => {
    setPreferences(prev => ({ ...prev, [type]: val }));
  };

  return (
    <div className="sb-register-page-container">
      <style>{`
        .sb-register-page-container {
          min-height: 100vh;
          background-color: #f4f4f4;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .sb-register-page-container *, .sb-register-page-container *::before, .sb-register-page-container *::after {
          box-sizing: border-box;
        }
        .sb-header {
          background-color: #ffffff;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid #e8e8e8;
        }
        .sb-logo {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1.2px;
          color: #111111;
          cursor: pointer;
        }
        .sb-lock-icon {
          color: #111111;
          display: flex;
          align-items: center;
        }
        .sb-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 36px;
          padding-bottom: 60px;
          padding-left: 16px;
          padding-right: 16px;
        }
        .sb-title {
          font-size: 28px;
          font-weight: bold;
          color: #111111;
          margin: 0 0 24px 0;
          text-align: center;
        }
        .sb-form-container {
          width: 100%;
          max-width: 440px;
        }
        .sb-form-group {
          margin-bottom: 18px;
        }
        .sb-label {
          display: block;
          font-size: 12px;
          font-weight: bold;
          color: #111111;
          margin-bottom: 6px;
          text-align: left;
        }
        .sb-sublabel-desc {
          font-size: 11px;
          color: #555555;
          margin-top: -3px;
          margin-bottom: 6px;
          text-align: left;
        }
        .sb-select {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          border: 1px solid #cccccc !important;
          border-radius: 4px !important;
          background-color: #ffffff !important;
          font-size: 14px;
          color: #555555;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
        }
        .sb-input {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          border: 1px solid #cccccc !important;
          border-radius: 4px !important;
          background-color: #ffffff !important;
          font-size: 14px;
          color: #111111;
          outline: none;
          transition: border-color 0.2s;
        }
        .sb-input:focus {
          border-color: #111111 !important;
        }
        .sb-dob-container {
          display: flex;
          gap: 12px;
        }
        .sb-dob-field {
          display: flex;
          flex-direction: column;
        }
        .sb-dob-label {
          font-size: 11px;
          color: #111111;
          margin-bottom: 4px;
          font-weight: 500;
        }
        .sb-dob-input-day, .sb-dob-input-month {
          width: 70px;
          text-align: center;
        }
        .sb-dob-input-year {
          width: 90px;
          text-align: center;
        }
        .sb-password-wrapper {
          position: relative;
        }
        .sb-password-input {
          padding-right: 85px;
        }
        .sb-show-password-btn {
          position: absolute;
          right: 2px;
          top: 2px;
          bottom: 2px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: #ffffff !important;
          border: none !important;
          cursor: pointer;
          color: #111111 !important;
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        .sb-strength-meter {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }
        .sb-strength-bar {
          flex: 1;
          height: 4px;
          background-color: #e2e8f0;
          border-radius: 2px;
        }
        .sb-contact-section {
          margin-top: 32px;
          margin-bottom: 24px;
        }
        .sb-contact-title {
          font-size: 18px;
          font-weight: bold;
          color: #111111;
          margin-bottom: 8px;
          text-align: left;
        }
        .sb-contact-desc {
          font-size: 12px;
          color: #555555;
          line-height: 1.5;
          margin-bottom: 12px;
          text-align: left;
        }
        .sb-contact-sub {
          font-size: 12px;
          font-weight: bold;
          color: #111111;
          margin-bottom: 16px;
          text-align: left;
        }
        .sb-preference-card {
          background-color: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .sb-preference-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .sb-preference-icon-circle {
          width: 36px;
          height: 36px;
          background-color: #fadbe6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cf3476;
        }
        .sb-preference-name {
          font-size: 14px;
          font-weight: bold;
          color: #111111;
        }
        .sb-preference-toggles {
          display: flex;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
        }
        .sb-toggle-btn {
          padding: 6px 18px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          background: #ffffff !important;
          border: none !important;
          color: #555555 !important;
          transition: background-color 0.2s, color 0.2s;
        }
        .sb-toggle-btn.active {
          background-color: #1e8536 !important;
          color: #ffffff !important;
        }
        .sb-toggle-btn:first-child {
          border-right: 1px solid #e2e8f0 !important;
        }
        .sb-policy-text {
          font-size: 11px;
          color: #666666;
          line-height: 1.6;
          text-align: left;
          margin-bottom: 24px;
        }
        .sb-policy-text a {
          color: #0a58ca;
          text-decoration: underline;
          font-weight: bold;
        }
        .sb-btn-primary {
          width: 100%;
          height: 46px;
          background-color: #1e8536 !important;
          border: none !important;
          color: #ffffff !important;
          border-radius: 23px !important;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .sb-btn-primary:hover {
          background-color: #19702c !important;
        }
        .sb-footer {
          margin-top: auto;
        }
        .sb-footer-help-band {
          background-color: #e9ecef;
          padding: 14px 0;
          text-align: center;
        }
        .sb-footer-help-text {
          font-size: 11px;
          color: #111111;
          margin: 0;
        }
        .sb-footer-help-link {
          color: #0a58ca;
          font-weight: bold;
          text-decoration: underline;
          text-underline-offset: 1px;
        }
        .sb-footer-help-link:hover {
          text-decoration: none;
        }
        .sb-footer-copyright-band {
          background-color: #ffffff;
          padding: 22px 0;
          text-align: center;
        }
        .sb-footer-copyright-text {
          font-size: 11px;
          color: #767676;
          margin: 0;
        }
        .sb-chat-widget {
          position: fixed;
          bottom: 24px;
          left: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
          z-index: 9999;
        }
        .sb-chat-message-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sb-chat-close-btn {
          width: 30px;
          height: 30px;
          background-color: #ffffff !important;
          border: none !important;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          cursor: pointer;
          color: #555555 !important;
          padding: 0;
        }
        .sb-chat-bubble {
          background-color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          font-size: 12px;
          color: #111111;
        }
        .sb-chat-bubble a {
          color: #0a58ca;
          text-decoration: underline;
          text-underline-offset: 1px;
        }
        .sb-chat-bubble a:hover {
          text-decoration: none;
        }
        .sb-chat-trigger-btn {
          width: 52px;
          height: 52px;
          background-color: #000000 !important;
          border: none !important;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          padding: 0;
        }
        .sb-chat-trigger-btn:hover {
          background-color: #111111 !important;
        }
      `}</style>

      {/* Header */}
      <header className="sb-header">
        <div className="sb-logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <Logo height={48} color="#000000" />
        </div>
        <div className="sb-lock-icon">
          <Lock size={18} strokeWidth={2} />
        </div>
      </header>

      {/* Main Content */}
      <main className="sb-main">
        <h1 className="sb-title">A little bit about you</h1>
        
        <div className="sb-form-container">
          <form className="sb-form" onSubmit={handleSubmit}>
            
            {/* Title */}
            <div className="sb-form-group">
              <label className="sb-label">Title</label>
              <select className="sb-select" defaultValue="">
                <option value="" disabled>Select a title</option>
                <option value="mr">Mr</option>
                <option value="mrs">Mrs</option>
                <option value="miss">Miss</option>
                <option value="ms">Ms</option>
              </select>
            </div>

            {/* First Name */}
            <div className="sb-form-group">
              <label className="sb-label">First name</label>
              <input type="text" className="sb-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            {/* Last Name */}
            <div className="sb-form-group">
              <label className="sb-label">Last name</label>
                  <input type="text" className="sb-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            {/* Date of Birth */}
            <div className="sb-form-group">
              <label className="sb-label">Date of birth</label>
              <div className="sb-dob-container">
                <div className="sb-dob-field">
                  <span className="sb-dob-label">Day</span>
                  <input type="text" placeholder="DD" className="sb-input sb-dob-input-day" maxLength={2} />
                </div>
                <div className="sb-dob-field">
                  <span className="sb-dob-label">Month</span>
                  <input type="text" placeholder="MM" className="sb-input sb-dob-input-month" maxLength={2} />
                </div>
                <div className="sb-dob-field">
                  <span className="sb-dob-label">Year</span>
                  <input type="text" placeholder="YYYY" className="sb-input sb-dob-input-year" maxLength={4} />
                </div>
              </div>
            </div>

            {/* Mobile Phone Number */}
            <div className="sb-form-group">
              <label className="sb-label">Mobile phone number</label>
              <p className="sb-sublabel-desc">We'll use this to update you about your order</p>
              <input type="tel" className="sb-input" />
            </div>

            {/* Home Address */}
            <div className="sb-form-group">
              <label className="sb-label">Home address</label>
              <input type="text" placeholder="Start typing your address" className="sb-input" />
            </div>

          {/* Email Address */}
<div className="sb-form-group">
  <label className="sb-label">Email address</label>
  <p className="sb-sublabel-desc">We'll use this to update you about your order</p>
  <input 
    type="email" 
    className="sb-input" 
    value={email} 
    onChange={(e) => {
      setEmail(e.target.value);
      if (emailError) setEmailError('');
    }}
    onBlur={() => {
      if (email && !isValidEmail(email)) setEmailError('Please enter a valid email address');
    }}
    style={emailError ? { borderColor: 'red' } : {}}
  />
  {emailError && <p style={{ color: 'red', fontSize: 11, marginTop: 4 }}>{emailError}</p>}
</div>

            {/* Password */}
            <div className="sb-form-group">
              <label className="sb-label">Password</label>
              <p className="sb-sublabel-desc">Must be at least 8 characters</p>
              <div className="sb-password-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="sb-input sb-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="sb-show-password-btn"
                >
                  <span className="text-[11px] font-bold">Show</span>
                  <Eye size={16} strokeWidth={2.5} />
                </button>
              </div>
              <div className="sb-strength-meter">
                <div className="sb-strength-bar"></div>
                <div className="sb-strength-bar"></div>
                <div className="sb-strength-bar"></div>
                <div className="sb-strength-bar"></div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="sb-contact-section">
              <h2 className="sb-contact-title">How can we contact you?</h2>
              <p className="sb-contact-desc">
                As well as contacting you about your order we can notify you about the latest styles, new arrivals and exclusive offers.
              </p>
              <p className="sb-contact-sub">Would you like to receive this information by:</p>

              {/* Preference 1: Email */}
              <div className="sb-preference-card">
                <div className="sb-preference-left">
                  <div className="sb-preference-icon-circle">
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>@</span>
                  </div>
                  <span className="sb-preference-name">Email</span>
                </div>
                <div className="sb-preference-toggles">
                  <button 
                    type="button" 
                    className={`sb-toggle-btn ${preferences.email === 'yes' ? 'active' : ''}`}
                    onClick={() => handlePreference('email', 'yes')}
                  >
                    Yes
                  </button>
                  <button 
                    type="button" 
                    className={`sb-toggle-btn ${preferences.email === 'no' ? 'active' : ''}`}
                    onClick={() => handlePreference('email', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Preference 2: Post */}
              <div className="sb-preference-card">
                <div className="sb-preference-left">
                  <div className="sb-preference-icon-circle">
                    <Mail size={16} strokeWidth={2.5} />
                  </div>
                  <span className="sb-preference-name">Post</span>
                </div>
                <div className="sb-preference-toggles">
                  <button 
                    type="button" 
                    className={`sb-toggle-btn ${preferences.post === 'yes' ? 'active' : ''}`}
                    onClick={() => handlePreference('post', 'yes')}
                  >
                    Yes
                  </button>
                  <button 
                    type="button" 
                    className={`sb-toggle-btn ${preferences.post === 'no' ? 'active' : ''}`}
                    onClick={() => handlePreference('post', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Preference 3: Phone */}
              <div className="sb-preference-card">
                <div className="sb-preference-left">
                  <div className="sb-preference-icon-circle">
                    <PhoneIcon size={16} strokeWidth={2.5} />
                  </div>
                  <span className="sb-preference-name">Phone</span>
                </div>
                <div className="sb-preference-toggles">
                  <button 
                    type="button" 
                    className={`sb-toggle-btn ${preferences.phone === 'yes' ? 'active' : ''}`}
                    onClick={() => handlePreference('phone', 'yes')}
                  >
                    Yes
                  </button>
                  <button 
                    type="button" 
                    className={`sb-toggle-btn ${preferences.phone === 'no' ? 'active' : ''}`}
                    onClick={() => handlePreference('phone', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Policy & T&C */}
            <p className="sb-policy-text">
              By selecting 'Continue' and opening an account, you agree to our <a href="#">Terms &amp; Conditions</a>. When you open an account with us, you will also be kept informed about our products &amp; promotions via social media. You can change your preferences at any time in your account. Our <a href="#">Privacy Policy</a> explains how we use your information.
            </p>

            {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}

            <button 
              type="submit" 
              className="sb-btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="sb-footer">
      
        <div className="sb-footer-copyright-band">
          <p className="sb-footer-copyright-text">© Sandreens 2026</p>
        </div>
      </footer>

   
    </div>
  );
}
