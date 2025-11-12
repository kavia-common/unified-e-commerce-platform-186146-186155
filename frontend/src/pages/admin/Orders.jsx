import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/env';

// PUBLIC_INTERFACE
export default function AdminOrders() {
  /** Admin orders management list. */
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
        setOrders(data || []);
      } catch (e) {
        logger.error('Admin orders fetch failed', e);
      }
    })();
  }, [token]);

  return (
    <div>
      <h2>Orders</h2>
      <div className="list">
        {orders.map(o => (
          <div className="card list-row" key={o.id}>
            <span>Order #{o.id}</span>
            <span>${o.total?.toFixed(2)}</span>
            <button className="btn btn-secondary">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
