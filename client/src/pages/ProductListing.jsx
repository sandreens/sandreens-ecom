


import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import api from '../services/api';

export default function ProductListing() {
   const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategoryRaw = searchParams.get('category') || '';
  const activeCategory = activeCategoryRaw;
  const activeCategoryList = activeCategoryRaw ? activeCategoryRaw.split(',').map(c => c.trim()).filter(Boolean) : [];
  const isMultiCategory = activeCategoryList.length > 1;
  const categoryLabel = activeCategoryList.length > 0 ? activeCategoryList.join(' & ') : '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeMinDiscount = searchParams.get('minDiscount') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeTitle = searchParams.get('title') || '';
  const [tab, setTab] = useState('shop');
  const [subcats, setSubcats] = useState([]);
  const [products, setProducts] = useState([]);
const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    Promise.all([
      api.get('/categories?type=product'),
      api.get('/products')
    ]).then(([catRes, prodRes]) => {
      const allCats = catRes.data;
      const prods = prodRes.data;
      setProducts(prods);
       setAllCategories(allCats);

      let displayCats;
      if (activeCategory) {
        displayCats = allCats.filter(
          c => c.parentCategory && c.parentCategory.name === activeCategory
        );
      } else {
        displayCats = allCats.filter(c => !c.parentCategory);
      }

      const mapped = displayCats.map(cat => {
        const prod = prods.find(p => p.category === cat.name || p.subcategory === cat.name);
        return {
          name: cat.name,
          img: cat.image
            || (prod ? (prod.imageUrl || (prod.images && prod.images[0])) : null)
            || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300'
        };
      });
      setSubcats(mapped);
    }).catch(() => {
      setSubcats([]);
    });
  }, [activeCategory]);

;

  // Sort + Filter state
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '', sizes: [], brands: [], inStockOnly: false,
  });

  // Discover tab er blog
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    if (tab === 'discover' && blogs.length === 0) {
      api.get('/blogs').then(res => setBlogs(res.data.filter(b => b.isActive))).catch(() => setBlogs([]));
    }
  }, [tab, blogs.length]);

  const SORT_OPTIONS = [
    { value: '', label: 'Newest first' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A–Z' },
    { value: 'oldest', label: 'Newest first' },
  ];

  // URL er brand + filter er brand ek sathe merge kori
  const allBrands = [activeBrand, ...(filters.brands || [])].filter(Boolean).join(',');
  const activeFilterCount =
    (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) +
    (filters.sizes?.length || 0) + (filters.brands?.length || 0) +
    (filters.inStockOnly ? 1 : 0);

  const bannerImg = (() => {
    if (activeSubcategory) {
      const sc = allCategories.find(c => c.name === activeSubcategory);
      if (sc && sc.image) return sc.image;
    }
    if (activeCategory) {
      const pc = allCategories.find(c => c.name === activeCategory && !c.parentCategory);
      if (pc && pc.image) return pc.image;
    }
    const match = products.find(p =>
      (activeSubcategory && p.subcategory === activeSubcategory) ||
      (activeCategory && p.category === activeCategory)
    );
    if (match) return match.imageUrl || (match.images && match.images[0]);
    return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500';
  })();

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* ── BREADCRUMBS & HEADER BLOCK ── */}
      <div style={{ background: '#f6ede6', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 20,
        }}>
          {/* Left Text Content */}
          <div style={{ paddingBottom: 24, alignSelf: 'center' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#767676', marginBottom: 16 }}>
              <Link to="/" style={{ color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>←</span> <span style={{ textDecoration: 'underline' }}>Home</span>
              </Link>
              <span>/</span>
              {activeCategory ? (
                <>
                  {activeSubcategory ? (
                    <>
                      <Link to={`/all-things-new?category=${encodeURIComponent(activeCategory)}`} style={{ color: '#111', textDecoration: 'underline' }}>
                        {activeTitle || categoryLabel}
                      </Link>
                      <span>/</span>
                      <span style={{ fontWeight: 600, color: '#111' }}>{activeSubcategory}</span>
                    </>
                  ) : (
                    <span style={{ fontWeight: 600, color: '#111' }}>{activeTitle || categoryLabel}</span>
                  )}
                </>
              ) : activeSearch ? (
                <span style={{ fontWeight: 600, color: '#111' }}>Search</span>
              ) : (
                <span style={{ fontWeight: 600, color: '#111' }}>New In</span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 20px', textTransform: 'capitalize' }}>
              {activeSearch
                ? `Search results for "${activeSearch}"`
                : activeTitle
                ? activeTitle
                : activeSubcategory
                ? activeSubcategory
                : categoryLabel
                ? categoryLabel
                : activeMinDiscount
                ? `Up to ${activeMinDiscount}% Off`
                : 'All things new'}
            </h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 28 }}>
              <button
                onClick={() => setTab('shop')}
                style={{
                  background: 'none', border: 'none', padding: '0 0 10px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  color: tab === 'shop' ? '#111' : '#767676',
                  borderBottom: tab === 'shop' ? '2.5px solid #111' : '2.5px solid transparent',
                }}
              >
                Shop {activeTitle || categoryLabel || 'new in'}
              </button>
              <button
                onClick={() => setTab('discover')}
                style={{
                  background: 'none', border: 'none', padding: '0 0 10px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  color: tab === 'discover' ? '#111' : '#767676',
                  borderBottom: tab === 'discover' ? '2.5px solid #111' : '2.5px solid transparent',
                }}
              >
                Discover
              </button>
            </div>
          </div>

          <div style={{ width: 440, height: 160, overflow: 'hidden', display: 'none' }} className="listing-banner-img">
            <img src={bannerImg} alt={activeSubcategory || activeCategory || 'Featured'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .listing-banner-img { display: block !important; }
        }
      `}</style>

      {/* ── SUBCATEGORIES BOXES ── */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 20px',
        overflowX: 'auto',
        display: 'flex',
        gap: 12,
        scrollbarWidth: 'none',
      }}>
        {subcats.map((c, i) => (
          <Link to={`/all-things-new?category=${encodeURIComponent(activeCategory)}&subcategory=${encodeURIComponent(c.name)}`} key={i} style={{
            background: '#fff',
            border: '1px solid #e2e2e2',
            borderRadius: 4,
            padding: 8,
            width: 110,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'border-color 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e2e2'}
          >
            <img src={c.img} alt={c.name} style={{ width: '100%', height: 96, objectFit: 'cover', borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#111', marginTop: 8, textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.25 }}>
              {c.name}
            </span>
          </Link>
        ))}
      </div>
{/* 
    {/* ── SORT & FILTER BLACK PILL ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px 8px', position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#111',
          borderRadius: 30,
          padding: '2px',
          position: 'relative',
        }}>
          {/* Sort Button */}
          <button
            onClick={() => setSortOpen(!sortOpen)}
            style={{
              background: 'none', border: 'none', color: '#fff',
              padding: '10px 24px', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}
          >
            Sort
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="17 11 12 6 7 11"/>
              <polyline points="17 13 12 18 7 13"/>
            </svg>
          </button>

          {/* Sort dropdown */}
          {sortOpen && (
            <>
              <div onClick={() => setSortOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                background: '#fff', borderRadius: 8, minWidth: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 100, padding: '6px 0',
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 16px', fontSize: 13, cursor: 'pointer',
                      background: sort === opt.value ? '#f5f5f5' : 'none',
                      border: 'none',
                      fontWeight: sort === opt.value ? 800 : 600,
                      color: '#111',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Separator line */}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />

          {/* Filter Button */}
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              background: 'none', border: 'none', color: '#fff',
              padding: '10px 24px', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}
          >
            Filter
            {activeFilterCount > 0 && (
              <span style={{
                background: '#ffd500', color: '#111', fontSize: 10, fontWeight: 800,
                minWidth: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>
                {activeFilterCount}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter drawer */}
      <FilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      {/* ── PRODUCT GRID / DISCOVER ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 52px' }}>
        {tab === 'shop' ? (
          <ProductGrid
            category={activeCategory}
            subcategory={activeSubcategory}
            minDiscount={activeMinDiscount}
            search={activeSearch}
            brand={allBrands}
            sort={sort}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            sizes={filters.sizes || []}
            inStockOnly={filters.inStockOnly}
          />
        ) : (
          /* ── DISCOVER TAB: blogs ── */
          <div>
            {blogs.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#767676', fontSize: 14, padding: '60px 0' }}>
                No articles yet. Check back soon.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
                {blogs.map(blog => (
                  <Link key={blog._id} to={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article style={{
                      border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden',
                      height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <div style={{ background: '#f9f5f0', padding: '28px 22px', borderBottom: '1px solid #e8e8e8' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#008037' }}>
                          Article
                        </span>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginTop: 8, lineHeight: 1.3 }}>
                          {blog.title}
                        </h2>
                      </div>
                      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, flex: 1 }}>
                          {blog.content.length > 120 ? blog.content.slice(0, 120).trim() + '...' : blog.content}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                          <span style={{ fontSize: 12, color: '#999' }}>By {blog.author}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#008037' }}>Read more →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>


    

      <Footer />
    </div>
  );
}