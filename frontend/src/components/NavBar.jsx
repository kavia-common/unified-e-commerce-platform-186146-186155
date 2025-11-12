import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Top navigation bar with brand, links, auth state, and cart quick access. */
  const { user, logout } = useAuth();
  const { items, toggleDrawer } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">🌊</span> Ocean Shop
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <button className="btn btn-secondary" onClick={toggleDrawer} aria-label="Open cart">
            Cart <span className="badge">{count}</span>
          </button>
          {user ? (
            <>
              <span className="welcome">Hi, {user.name || user.email}</span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
