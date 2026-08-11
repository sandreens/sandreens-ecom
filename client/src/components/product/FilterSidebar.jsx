import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const SIZES = ['10','12','14','16','18','20','22','24','26','28','30','32'];

export default function FilterSidebar({ open, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);
  const [brands, setBrands] = useState([]);

  useEffect(() => setLocal(filters), [filters, open]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setBrands(res.data.filter(c => c.type === 'brand').map(b => b.name)))
      .catch(() => setBrands([]));
  }, []);

  if (!open) return null;

  const toggleSize = (s) => {
    const list = local.sizes || [];
    setLocal({ ...local, sizes: list.includes(s) ? list.filter(x => x !== s) : [...list, s] });
  };

  const toggleBrand = (b) => {
    const list = local.brands || [];
    setLocal({ ...local, brands: list.includes(b) ? list.filter(x => x !== b) : [...list, b] });
  };

  const handleClear = () => {
    const empty = { minPrice: '', maxPrice: '', sizes: [], brands: [], inStockOnly: false };
    setLocal(empty);
    onApply(empty);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 400 }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 340, maxWidth: '90vw',
        background: '#fff', zIndex: 401, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#111' }}>Filter</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#767676' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* Price */}
          <div style={{ marginBottom: 26 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 12 }}>Price (£)</h4>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="number" min="0" placeholder="Min"
                value={local.minPrice || ''}
                onChange={e => setLocal({ ...local, minPrice: e.target.value })}
                style={{ flex: 1, height: 40, padding: '0 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ color: '#999' }}>–</span>
              <input
                type="number" min="0" placeholder="Max"
                value={local.maxPrice || ''}
                onChange={e => setLocal({ ...local, maxPrice: e.target.value })}
                style={{ flex: 1, height: 40, padding: '0 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Sizes */}
          <div style={{ marginBottom: 26 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 12 }}>Size</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {SIZES.map(s => {
                const active = (local.sizes || []).includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    style={{
                      padding: '9px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      borderRadius: 6, transition: 'all 0.15s',
                      border: active ? '2px solid #111' : '1.5px solid #ddd',
                      background: active ? '#111' : '#fff',
                      color: active ? '#fff' : '#555',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          {brands.length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 12 }}>Brand</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {brands.map(b => (
                  <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#333' }}>
                    <input
                      type="checkbox"
                      checked={(local.brands || []).includes(b)}
                      onChange={() => toggleBrand(b)}
                      style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#111' }}
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* In stock */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#111' }}>
            <input
              type="checkbox"
              checked={local.inStockOnly || false}
              onChange={e => setLocal({ ...local, inStockOnly: e.target.checked })}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#008037' }}
            />
            In stock only
          </label>
        </div>

        {/* Footer */}
        <div style={{ padding: 16, borderTop: '1px solid #eee', display: 'flex', gap: 10 }}>
          <button
            onClick={handleClear}
            style={{ flex: 1, padding: '13px', border: '1.5px solid #111', background: '#fff', color: '#111', borderRadius: 30, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Clear all
          </button>
          <button
            onClick={() => { onApply(local); onClose(); }}
            style={{ flex: 1, padding: '13px', border: 'none', background: '#111', color: '#fff', borderRadius: 30, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}