import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Admin layout with left sidebar and content area for nested admin routes. */
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
