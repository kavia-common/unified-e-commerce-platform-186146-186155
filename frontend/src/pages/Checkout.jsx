import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/env';

// PUBLIC_INTERFACE
export default function Checkout() {
  /** Checkout form; simulates order creation, requires auth. */
  const { items, total, clear } = useCart();
  const { user, token } = useAuth();
  const [status, setStatus] = useState(null);
  const [address, setAddress] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus('Please sign in to complete your purchase.');
      return;
    }
    try {
      await client.post('/orders', { items, total, address }, { headers: { Authorization: `Bearer ${token}` } });
      clear();
      setStatus('Order placed successfully!');
    } catch (e) {
      logger.error('Checkout error', e);
      setStatus('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="title">Checkout</h1>
      <form className="card form" onSubmit={submit}>
        <label>
          Shipping Address
          <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Ocean Ave, Blue City" />
        </label>
        <div className="total-row">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <button className="btn" type="submit">Place Order</button>
        {status && <p className="notice">{status}</p>}
      </form>
    </div>
  );
}
