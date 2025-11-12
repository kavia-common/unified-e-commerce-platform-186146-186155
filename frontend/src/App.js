import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import CartDrawer from './components/CartDrawer';
import { Outlet } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function App() {
  /** Layout shell: top navigation, page outlet, and cart drawer. */
  return (
    <div className="App">
      <NavBar />
      <main className="container page">
        <Outlet />
      </main>
      <CartDrawer />
      <footer className="footer">
        <div className="container">
          <p className="muted">© {new Date().getFullYear()} Ocean Shop</p>
        </div>
      </footer>
    </div>
  );
}
