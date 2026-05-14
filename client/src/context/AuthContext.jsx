import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const fetchUser = async () => {
    try {
      const [{ data: meData }, { data: notifData }] = await Promise.all([
        api.get('/auth/me'),
        api.get('/notifications').catch(() => ({ data: { data: [] } }))
      ]);
      setWishlist(meData.data.wishlist || []);
      setNotifications(notifData.data || []);
      // also optionally update user info
    } catch (error) {
      console.error("Failed to fetch full user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [user?.id]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const userData = data.data.user;
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, phone, password });
      const userData = data.data.user;
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) return;
    try {
      const { data } = await api.post(`/auth/wishlist/${productId}`);
      // server returns array of ObjectIds in wishlist
      fetchUser(); // refetch populated wishlist
      return data.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, loading, isAdmin, 
      wishlist, toggleWishlist, fetchUser,
      notifications, unreadCount, setNotifications 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
