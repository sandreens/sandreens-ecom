import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchBar from './SearchBar';
import Logo from '../common/Logo';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null); // mobile accordion
  const [hoveredCategory, setHoveredCategory] = useState(null); // desktop hover
  const navigate = useNavigate();
  const catNavRef = useRef(null);
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);
  const currentCategory = currentParams.get('category') || '';
  const isNewInActive = location.pathname === '/all-things-new' && !currentCategory;

  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalSaved } = useWishlist();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [loadingAnnounce, setLoadingAnnounce] = useState(true);
  const [tcOpen, setTcOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error('Failed to fetch categories:', err))
      .finally(() => setLoadingCats(false));

    api.get('/cms/announcement')
      .then(res => {
        if (res.data && res.data.data) {
          setAnnouncement(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAnnounce(false));
  }, []);

  useEffect(() => {
    if (!hoveredCategory) return;
    const handleOutside = (e) => {
      if (catNavRef.current && !catNavRef.current.contains(e.target)) {
        setHoveredCategory(null);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, [hoveredCategory]);

  const parseAnnouncement = (fullText) => {
    if (!fullText) return { mainText: '', codeText: '' };
    const codeIndex = fullText.toLowerCase().indexOf('use code:');
    if (codeIndex !== -1) {
      const mainText = fullText.substring(0, codeIndex).trim();
      const codeText = fullText.substring(codeIndex).trim();
      return { mainText, codeText };
    }
    return { mainText: fullText, codeText: '' };
  };

  const announceText = announcement?.text;
  const announceLinkText = announcement?.linkText;
  const { mainText, codeText } = parseAnnouncement(announceText);

  const mainCategories = categories.filter(c => c.type === 'product' && !c.parentCategory);
  
  const getSubcategories = (parentId) => {
    return categories.filter(c => c.type === 'product' && c.parentCategory && (c.parentCategory._id === parentId || c.parentCategory === parentId));
  };

  const handleCategoryClick = (catName, parentId, e) => {
    const subs = getSubcategories(parentId);
    if (subs.length > 0) {
      e.preventDefault();
      setExpandedCategory(expandedCategory === parentId ? null : parentId);
    } else {
      setOpen(false);
      navigate(`/all-things-new?category=${encodeURIComponent(catName)}`);
    }
  };

  return (
    <>
    <style>{`
        @keyframes navDropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* ── TOP NAVBAR ── */}
      <div className="navbar-sticky">
        <div className="navbar-row">
          {/* LEFT */}
          <div className="navbar-left">
            <button className="nav-icon-btn" onClick={() => setOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
              <span>Menu</span>
            </button>
            {searchOpen ? (
              <SearchBar onClose={() => setSearchOpen(false)} />
            ) : (
              <button className="nav-icon-btn" onClick={() => setSearchOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>Search</span>
              </button>
            )}
          </div>

          {/* CENTER LOGO */}
          <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}><Logo height={46} color="#000000" /></Link>

          {/* RIGHT */}
          <div className="navbar-right">
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="nav-icon-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    borderRadius: 6,
                    zIndex: 200,
                    minWidth: 160,
                    padding: '6px 0',
                    marginTop: 4
                  }}>
                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/account'); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 16px', fontSize: 13, fontWeight: 600,
                        color: '#111', background: 'none', border: 'none', cursor: 'pointer'
                      }}
                    >
                      My Account
                    </button>
                 
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 16px', fontSize: 13, fontWeight: 600,
                        color: '#d00', background: 'none', border: 'none', cursor: 'pointer'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Sign in</span>
              </Link>
            )}
            <Link to="/saved" className="nav-icon-btn">
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {totalSaved > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#008037',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1
                  }}>
                    {totalSaved}
                  </span>
                )}
              </span>
              <span>Saved</span>
            </Link>
            <Link to="/cart" className="nav-icon-btn">
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#008037',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1
                  }}>
                    {totalItems}
                  </span>
                )}
              </span>
              <span>Bag</span>
            </Link>
            
          </div>
        </div>
      </div>

      {/* ── PROMO STRIP (cream) ── */}
      {loadingAnnounce ? (
        <div className="promo-strip" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 24px 12px' }}>
          <span className="skeleton-announce-bar" style={{ width: 240, height: 18, display: 'block' }} />
          <span className="skeleton-announce-bar" style={{ width: 140, height: 12, display: 'block', animationDelay: '0.2s' }} />
        </div>
      ) : announcement && announceText ? (
        <div className="promo-strip">
          <h2>{mainText}</h2>
          {codeText && <span className="promo-code">{codeText}</span>}
          {announceLinkText && (
            <button
              onClick={() => setTcOpen(true)}
              className="promo-tc"
              style={{ background: 'none', border: 'none', fontInherit: 'inherit', margin: '5px auto 0', display: 'block' }}
            >
              {announceLinkText}
            </button>
          )}
        </div>
      ) : null}

        {/* ── CATEGORY NAV (black bar with hover dropdowns) ── */}
        <div className="cat-nav-wrap" ref={catNavRef}>
        <nav className="cat-nav" style={{ position: 'relative' }}>          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
            {loadingCats ? (
              <li style={{ display: 'flex', gap: 20, padding: '12px 20px', alignItems: 'center' }}>
                <div style={{ width: 60, height: 14, background: '#333', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: 70, height: 14, background: '#333', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: 85, height: 14, background: '#333', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: 65, height: 14, background: '#333', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
              </li>
            ) : (
              <>
               <li>
  <Link to="/all-things-new" className={isNewInActive ? 'active' : ''}>New In</Link>
</li>
                {mainCategories.map(cat => {
                  const subs = getSubcategories(cat._id);
                  const hasSubs = subs.length > 0;
                  return (
                    <li
                      key={cat._id}
                      style={{ position: 'relative', zIndex: hoveredCategory === cat._id ? 9999 : 'auto' }}
                      onMouseEnter={() => hasSubs && setHoveredCategory(cat._id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <Link
                        to={`/all-things-new?category=${encodeURIComponent(cat.name)}`}
                        className={currentCategory === cat.name ? 'active' : ''}
                        onClick={(e) => {
                          if (hasSubs && hoveredCategory !== cat._id) {
                            e.preventDefault();
                            setHoveredCategory(cat._id);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {cat.name}
                        {hasSubs && (
                          <span style={{ fontSize: 9, opacity: 0.7 }}>▼</span>
                        )}
                      </Link>

                      {/* Hover Dropdown */}
                      {hasSubs && hoveredCategory === cat._id && (
                        <div className="cat-dropdown-desktop" style={{
                          position: 'absolute',
                          top: '100%',                          left: 0,
                          background: '#111',
                          borderTop: '1.5px solid #ffd500',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                          zIndex: 9999,
                          minWidth: 200,
                          padding: '8px 0',
                          borderRadius: '0 0 6px 6px',
                          animation: 'navDropdownFade 0.18s ease-out',
                        }}>
                          <Link
                            to={`/all-things-new?category=${encodeURIComponent(cat.name)}`}
                            style={{
                              display: 'block',
                              padding: '10px 16px',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              textDecoration: 'none',
                              borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}
                            className="dropdown-item"
                          >
                            Shop All {cat.name}
                          </Link>
                          {subs.map(sub => (
                            <Link
                              key={sub._id}
                              to={`/all-things-new?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                              style={{
                                display: 'block',
                                padding: '10px 16px',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: 12,
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                              className="dropdown-item"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
                <li>
                  <Link to="/all-things-new?minDiscount=40" className="highlight">Up to 40% off</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

          {(() => {
            const activeCat = mainCategories.find(c => c._id === hoveredCategory);
            if (!activeCat) return null;
            const subs = getSubcategories(activeCat._id);
            if (subs.length === 0) return null;
            return (
              <div className="cat-dropdown-mobile">
                <Link
                  to={`/all-things-new?category=${encodeURIComponent(activeCat.name)}`}
                  onClick={() => setHoveredCategory(null)}
                  className="dropdown-item"
                  style={{ display:'block', padding:'12px 20px', color:'#fff', fontSize:13, fontWeight:700, borderBottom:'1px solid rgba(255,255,255,0.1)' }}
                >
                  Shop All {activeCat.name}
                </Link>
                {subs.map(sub => (
                  <Link
                    key={sub._id}
                    to={`/all-things-new?category=${encodeURIComponent(activeCat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                    onClick={() => setHoveredCategory(null)}
                    className="dropdown-item"
                    style={{ display:'block', padding:'12px 20px', color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600 }}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>

      {/* ── MOBILE DRAWER (with accordions) ── */}
      <div className={`drawer${open ? ' open' : ''}`}>
        <div className="drawer-bd" onClick={() => setOpen(false)} />
        <button className="drawer-close-float" onClick={() => setOpen(false)}>✕</button>

        <div className="drawer-pn">
          <div className="drawer-signin-row">
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Sign In</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          <ul className="drawer-menu-list">
            {loadingCats ? (
              <li style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: '80%', height: 16, background: '#f5f5f5', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '60%', height: 16, background: '#f5f5f5', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '70%', height: 16, background: '#f5f5f5', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '50%', height: 16, background: '#f5f5f5', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
              </li>
            ) : (
              <>
                <li>
                  <Link to="/all-things-new" onClick={() => setOpen(false)}>
                    <span>New In</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                </li>
            {mainCategories.map(cat => {
              const subs = getSubcategories(cat._id);
              const hasSubs = subs.length > 0;
              const isExpanded = expandedCategory === cat._id;
              return (
                <li key={cat._id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <a
                    href="#"
                    onClick={(e) => handleCategoryClick(cat.name, cat._id, e)}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                  >
                    <span>{cat.name}</span>
                    {hasSubs ? (
                      <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', fontSize: 10, color: '#767676' }}>▶</span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </a>

                  {/* Accordion Subcategories */}
                  {hasSubs && isExpanded && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: 20,
                      background: '#fcfcfc',
                      borderLeft: '2px solid #ffd500',
                      margin: '4px 0 8px 16px'
                    }}>
                      <li>
                        <Link
                          to={`/all-things-new?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => setOpen(false)}
                          style={{ padding: '8px 0', fontSize: 13, fontWeight: 700, color: '#111' }}
                        >
                          Shop All {cat.name}
                        </Link>
                      </li>
                      {subs.map(sub => (
                        <li key={sub._id}>
                          <Link
                            to={`/all-things-new?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                            onClick={() => setOpen(false)}
                            style={{ padding: '8px 0', fontSize: 13, color: '#444' }}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </>
        )}
      </ul>
        </div>
      </div>

      {/* ── TERMS & CONDITIONS DRAWER (RIGHT SLIDE) ── */}
      <div className={`drawer-right${tcOpen ? ' open' : ''}`}>
        <div className="drawer-bd" onClick={() => setTcOpen(false)} />
        <button className="drawer-right-close" onClick={() => setTcOpen(false)}>✕</button>
        <div className="drawer-pn-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{announceLinkText}</h3>
            <button onClick={() => setTcOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#767676' }}>✕</button>
          </div>
          <div style={{ padding: 24, fontSize: 14, color: '#444', lineHeight: 1.6, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
            {announcement?.tcContent || 'No terms and conditions specified.'}
          </div>
        </div>
      </div>

    </>
  );
}
