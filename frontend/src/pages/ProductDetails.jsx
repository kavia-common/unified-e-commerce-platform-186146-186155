import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { logger } from '../utils/env';

// PUBLIC_INTERFACE
export default function ProductDetails() {
  /** Product details page with add to cart. */
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await client.get(`/products/${id}`);
        if (mounted) setProduct(data);
      } catch (e) {
        logger.error('Failed to load product', e);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  if (!product) return <p className="muted">Loading...</p>;

  return (
    <div className="product-details">
      <img className="pd-image" src={product.image || 'https://via.placeholder.com/600x400?text=Product'} alt={product.title} />
      <div className="pd-info">
        <h2>{product.title}</h2>
        <p className="pd-price">${product.price?.toFixed(2)}</p>
        <p className="pd-desc">{product.description || 'No description provided.'}</p>
        <button className="btn" onClick={() => addItem({ ...product, quantity: 1 })}>Add to cart</button>
      </div>
    </div>
  );
}
