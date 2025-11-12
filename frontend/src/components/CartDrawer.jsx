import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CartDrawer() {
  /** Slide-over drawer that shows cart items, total, and checkout link. */
  const { drawerOpen, toggleDrawer, items, updateItem, removeItem, total } = useCart();

  return (
    <div className={`drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
      <div className="drawer-overlay" onClick={toggleDrawer} />
      <div className="drawer-panel">
        <div className="drawer-header">
          <h3>Your Cart</h3>
          <button className="icon-btn" aria-label="Close" onClick={toggleDrawer}>✕</button>
        </div>
        <div className="drawer-content">
          {items.length === 0 && <p className="muted">Your cart is empty.</p>}
          {items.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-info">
                <strong>{item.title}</strong>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="cart-item-actions">
                <button className="icon-btn" onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>−</button>
                <span className="qty">{item.quantity}</span>
                <button className="icon-btn" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                <button className="icon-btn danger" onClick={() => removeItem(item.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-footer">
          <div className="total-row">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <Link className="btn btn-block" to="/checkout" onClick={toggleDrawer}>Checkout</Link>
        </div>
      </div>
    </div>
  );
}
