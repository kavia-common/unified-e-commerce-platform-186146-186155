import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Cart() {
  /** Full cart page, mirrors drawer functionality with larger layout. */
  const { items, updateItem, removeItem, total } = useCart();

  return (
    <div>
      <h1 className="title">Your Cart</h1>
      {items.length === 0 ? (
        <p className="muted">Cart is empty. <Link to="/">Go shopping</Link></p>
      ) : (
        <>
          <div className="cart-list">
            {items.map(item => (
              <div key={item.id} className="cart-row">
                <div className="cart-cell">
                  <strong>{item.title}</strong>
                  <span className="muted">${item.price.toFixed(2)}</span>
                </div>
                <div className="cart-cell qty-controls">
                  <button className="icon-btn" onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>−</button>
                  <span className="qty">{item.quantity}</span>
                  <button className="icon-btn" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-cell">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="cart-cell">
                  <button className="icon-btn danger" onClick={() => removeItem(item.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total-row">
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className="btn btn-block">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}
