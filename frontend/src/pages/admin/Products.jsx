import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/env';

// PUBLIC_INTERFACE
export default function AdminProducts() {
  /** Admin product management list (basic CRUD UI skeleton). */
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  const load = async () => {
    try {
      const { data } = await client.get('/admin/products', { headers: { Authorization: `Bearer ${token}` } });
      setProducts(data || []);
    } catch (e) {
      logger.error('Admin products fetch failed', e);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <div className="list-header">
        <h2>Products</h2>
        <button className="btn">+ Add Product</button>
      </div>
      <div className="list">
        {products.map(p => (
          <div className="card list-row" key={p.id}>
            <span>{p.title}</span>
            <span>${p.price?.toFixed(2)}</span>
            <div className="row-actions">
              <button className="btn btn-secondary">Edit</button>
              <button className="btn danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
