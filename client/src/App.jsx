import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import ManageProducts from './pages/admin/ManageProducts';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ScrollToTop from './components/common/ScrollToTop';
import Profile from './pages/Account/Profile';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import { WishlistProvider } from './context/WishlistContext';
import Saved from './pages/Saved';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import { ChatProvider } from './context/ChatContext';
import ChatWidget from './components/chat/ChatWidget';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Faq from './pages/Faq';
import LegalPage from './pages/LegalPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AboutUs from './pages/AboutUs';
import ReturnsPolicy from './pages/ReturnsPolicy';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ChatProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/all-things-new" element={<ProductListing />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/admin/manage-products" element={<ManageProducts />} />
                <Route path="/account" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/returns-policy" element={<ReturnsPolicy />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/terms" element={<LegalPage type="terms" />} />
                <Route path="/privacy" element={<LegalPage type="privacy" />} />
              </Routes>
              <MobileBottomNav />
              <ChatWidget />
            </Router>
          </ChatProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;