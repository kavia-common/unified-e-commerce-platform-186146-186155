import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// PUBLIC_INTERFACE
export default function ProductCard({ product }) {
  /** Product card showing image, title, price and add-to-cart action. */
  const { addItem } = useCart();
  const addToCart = () => addItem({ ...product, quantity: 1 });

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="card-media">
        <img src={product.image || 'https://via.placeholder.com/400x300?text=Product'} alt={product.title} />
      </Link>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-price">${product.price?.toFixed(2)}</p>
        <div className="card-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary">Details</Link>
          <button className="btn" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
