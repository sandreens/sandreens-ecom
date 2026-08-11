import React, { useState } from 'react';
import { Lock, Eye, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sb-login-page-container">
      <style>{`
        .sb-login-page-container {
          min-height: 100vh;
          background-color: #f4f4f4;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .sb-login-page-container *, .sb-login-page-container *::before, .sb-login-page-container *::after {
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
          margin: 0 0 20px 0;
          text-align: center;
        }
        .sb-form-container {
          width: 100%;
          max-width: 440px;
        }
        .sb-new-customer-section {
          text-align: center;
          margin-bottom: 28px;
        }
        .sb-new-customer-text {
          font-size: 12px;
          color: #111111;
          margin: 0 0 10px 0;
        }
        .sb-btn-outline {
          width: 100%;
          height: 46px;
          border: 1px solid #111111 !important;
          background-color: #ffffff !important;
          border-radius: 23px !important;
          font-size: 13px;
          font-weight: bold;
          color: #111111 !important;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .sb-btn-outline:hover {
          background-color: #f9f9f9 !important;
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
        .sb-remember-row {
          display: flex;
          align-items: center;
          margin-top: 16px;
          margin-bottom: 20px;
        }
        .sb-checkbox-container {
          position: relative;
          display: inline-block;
          width: 22px;
          height: 22px;
          cursor: pointer;
        }
        .sb-real-checkbox {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }
        .sb-custom-checkbox {
          position: absolute;
          top: 0;
          left: 0;
          height: 22px;
          width: 22px;
          background-color: #ffffff;
          border: 1px solid #cccccc;
          border-radius: 2px;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .sb-real-checkbox:checked ~ .sb-custom-checkbox {
          background-color: #1e8536;
          border-color: #1e8536;
        }
        .sb-custom-checkbox::after {
          content: "";
          position: absolute;
          display: none;
          left: 7px;
          top: 3px;
          width: 6px;
          height: 11px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .sb-real-checkbox:checked ~ .sb-custom-checkbox::after {
          display: block;
        }
        .sb-checkbox-label {
          margin-left: 10px;
          font-size: 13px;
          color: #111111;
          cursor: pointer;
          user-select: none;
          font-weight: 500;
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
        .sb-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .sb-forgot-link {
          text-align: center;
          margin-top: 16px;
        }
        .sb-forgot-link a {
          font-size: 13px;
          font-weight: bold;
          color: #0a58ca;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .sb-forgot-link a:hover {
          text-decoration: none;
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
        <h1 className="sb-title">Sign in</h1>
        
        <div className="sb-form-container">
          {/* New Customer Section */}
          <div className="sb-new-customer-section">
            <p className="sb-new-customer-text">No account? No problem</p>
            <button className="sb-btn-outline" onClick={() => navigate('/register')}>
              I'm a new customer
            </button>
          </div>

          {/* Form */}
          <form className="sb-form" onSubmit={handleSubmit}>
            <div className="sb-form-group">
              <label className="sb-label">
                Email or account number
              </label>
              <input 
                type="text" 
                className="sb-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="sb-form-group">
              <label className="sb-label">
                Password
              </label>
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
            </div>

            <div className="sb-remember-row">
              <label className="sb-checkbox-container">
                <input 
                  type="checkbox" 
                  className="sb-real-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="sb-custom-checkbox"></span>
              </label>
              <span 
                className="sb-checkbox-label"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </span>
            </div>

            {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}

            <button 
              type="submit" 
              className="sb-btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="sb-forgot-link">
  <Link to="/forgot-password">
    Forgot your password?
  </Link>
</div>
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