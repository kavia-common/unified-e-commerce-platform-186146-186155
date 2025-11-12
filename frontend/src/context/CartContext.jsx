import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';
import { logger } from '../utils/env';

const CartContext = createContext(null);

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Manages cart items, totals, drawer state, persistence, and backend sync when authenticated. */
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, token } = useAuth();

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('cart_items');
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  // Sync with backend if authenticated
  useEffect(() => {
    (async () => {
      if (!user || !token) return;
      try {
        await client.post('/cart/sync', { items }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (e) {
        logger.warn('Cart sync failed', e);
      }
    })();
  }, [items, user, token]);

  const toggleDrawer = () => setDrawerOpen(v => !v);

  // PUBLIC_INTERFACE
  const addItem = (item) => {
    setItems((prev) => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + (item.quantity || 1) } : p);
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setDrawerOpen(true);
  };

  // PUBLIC_INTERFACE
  const updateItem = (id, quantity) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
  };

  // PUBLIC_INTERFACE
  const removeItem = (id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  // PUBLIC_INTERFACE
  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  const value = useMemo(() => ({
    items, addItem, updateItem, removeItem, clear, total, drawerOpen, toggleDrawer,
  }), [items, total, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access the CartContext. */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
