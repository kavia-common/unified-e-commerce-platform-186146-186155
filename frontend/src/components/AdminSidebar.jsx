import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function AdminSidebar() {
  /** Sidebar for Admin pages navigation. */
  return (
    <aside className="admin-sidebar">
      <h3 className="admin-title">Admin</h3>
      <nav className="admin-nav">
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
      </nav>
    </aside>
  );
}
