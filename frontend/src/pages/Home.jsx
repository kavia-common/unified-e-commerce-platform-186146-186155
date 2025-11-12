import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import client from '../api/client';
import { getFeatureFlags, logger } from '../utils/env';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page showing product grid and optional experimental banner via feature flag. */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const flags = getFeatureFlags();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await client.get('/products');
        if (mounted) setProducts(data || []);
      } catch (e) {
        logger.error('Failed to load products', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      {flags.EXPERIMENTS_ENABLED && (
        <div className="notice">🚀 Experimental features are enabled.</div>
      )}
      <h1 className="title">Featured Products</h1>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
