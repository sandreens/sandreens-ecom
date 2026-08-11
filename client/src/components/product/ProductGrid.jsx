
import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/productService';
import ProductCard from './ProductCard';

export default function ProductGrid({
  category = '',
  subcategory = '',
  minDiscount = '',
  search = '',
  brand = '',
  isTrending = false,
  sort = '',
  minPrice = '',
  maxPrice = '',
  sizes = [],
  inStockOnly = false,
  limit = null,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Array gulo dependency te thakle protibar notun reference hoy, tai string e convert kori
  const sizesKey = sizes.join(',');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const params = {};
    if (category) params.category = category;
    if (subcategory) params.subcategory = subcategory;
    if (minDiscount) params.minDiscount = minDiscount;
    if (search) params.search = search;
    if (brand) params.brand = brand;
    if (isTrending) params.isTrending = 'true';
    if (sort) params.sort = sort;
    if (minPrice !== '' && minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== '' && maxPrice !== undefined) params.maxPrice = maxPrice;
    if (sizesKey) params.sizes = sizesKey;
    if (inStockOnly) params.inStock = 'true';

    getProducts(params)
      .then(data => {
        if (!cancelled) setProducts(limit ? data.slice(0, limit) : data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, subcategory, minDiscount, search, brand, isTrending, sort, minPrice, maxPrice, sizesKey, inStockOnly, limit]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676', fontSize: 14 }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#c0392b', fontSize: 14 }}>
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676', fontSize: 14 }}>
        No products found
      </div>
    );
  }

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
      className="listing-prod-grid"
    >
      {products.map(p => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}