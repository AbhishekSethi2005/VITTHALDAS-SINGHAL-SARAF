import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from API whenever user changes
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/cart');
      setCart(data.data);
    } catch (err) {
      // 401 means not logged in — just clear cart
      if (err.response?.status === 401) {
        setCart(null);
      } else {
        setError('Failed to load cart.');
        console.error('Cart fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) return false;
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data.data);
      return true;
    } catch (err) {
      console.error('Add to cart error:', err);
      return false;
    }
  }, [user]);

  // Remove single item
  const removeFromCart = useCallback(async (itemId) => {
    if (!user) return;
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data.data);
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  }, [user]);

  // Update quantity
  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!user) return;
    try {
      const { data } = await api.patch(`/cart/${itemId}`, { quantity });
      setCart(data.data);
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  }, [user]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.delete('/cart');
      setCart(data.data);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  }, [user]);

  // Derived values
  const items = cart?.items || [];
  const cartCount = cart?.itemCount || 0;
  const cartTotal = cart?.subtotal || 0;
  const taxAmount = cart?.taxAmount || 0;
  const taxRate = cart?.taxRate || 3;
  const shippingCharges = cart?.shippingCharges || 0;
  const freeShippingThreshold = cart?.freeShippingThreshold || 50000;
  const grandTotal = cart?.total || 0;

  const value = useMemo(() => ({
    items,
    cartCount,
    cartTotal,
    taxAmount,
    taxRate,
    shippingCharges,
    freeShippingThreshold,
    grandTotal,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
  }), [items, cartCount, cartTotal, taxAmount, taxRate, shippingCharges,
    freeShippingThreshold, grandTotal, loading, error, addToCart,
    removeFromCart, updateQuantity, clearCart, fetchCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
