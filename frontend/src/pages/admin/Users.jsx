import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/env';

// PUBLIC_INTERFACE
export default function AdminUsers() {
  /** Admin users management list. */
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } });
        setUsers(data || []);
      } catch (e) {
        logger.error('Admin users fetch failed', e);
      }
    })();
  }, [token]);

  return (
    <div>
      <h2>Users</h2>
      <div className="list">
        {users.map(u => (
          <div className="card list-row" key={u.id}>
            <span>{u.name || u.email}</span>
            <span className="muted">{u.role}</span>
            <button className="btn btn-secondary">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
}
