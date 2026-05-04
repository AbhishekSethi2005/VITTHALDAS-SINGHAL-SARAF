import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.phone, form.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Helmet><title>Create Account | Vitthaldas Singhal Saraf</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-brand-cream">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold text-brand-dark">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join the VSS family</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" placeholder="Min 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-3.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-gold font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
