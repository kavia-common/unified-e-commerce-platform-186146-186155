import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/env';

// PUBLIC_INTERFACE
export default function Orders() {
  /** Lists authenticated user's orders. */
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      try {
        const { data } = await client.get('/orders', { headers: { Authorization: `Bearer ${token}` } });
        if (mounted) setOrders(data || []);
      } catch (e) {
        logger.error('Orders fetch failed', e);
      }
    })();
    return () => (mounted = false);
  }, [user, token]);

  if (!user) return <p className="muted">Please sign in to view orders.</p>;

  return (
    <div>
      <h1 className="title">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <div className="list">
          {orders.map(o => (
            <div className="card" key={o.id}>
              <div className="list-row">
                <strong>Order #{o.id}</strong>
                <span>${o.total?.toFixed(2)}</span>
              </div>
              <div className="muted">{new Date(o.createdAt || Date.now()).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
