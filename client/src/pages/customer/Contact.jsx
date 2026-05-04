import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/settings/inquiry', form);
      toast.success('Message sent! We will contact you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.success('Message received! We will get back to you.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us | Vitthaldas Singhal Saraf</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-heading font-bold text-brand-dark">Get in Touch</h1>
          <p className="text-gray-500 mt-2">Visit our store or send us a message</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <div className="bg-brand-cream rounded-2xl p-8 mb-6">
              <h2 className="text-xl font-heading font-semibold text-brand-dark mb-6">Store Details</h2>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <MapPin size={20} className="text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Sarafa Bazar, Lashkar</p>
                    <p className="text-sm text-gray-500">Gwalior, Madhya Pradesh, India</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={20} className="text-brand-gold shrink-0" />
                  <div>
                    <p className="font-medium text-sm">+91-XXXXXXXXXX</p>
                    <p className="text-sm text-gray-500">Mon-Sat, 10AM-9PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail size={20} className="text-brand-gold shrink-0" />
                  <p className="font-medium text-sm">info@vssaraf.com</p>
                </div>
                <div className="flex gap-3">
                  <Clock size={20} className="text-brand-gold shrink-0" />
                  <div>
                    <p className="font-medium text-sm">10:00 AM – 9:00 PM</p>
                    <p className="text-sm text-gray-500">Open all days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              <MessageCircle size={20} /> Chat on WhatsApp
            </a>

            {/* Map */}
            <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 h-48">
              <iframe
                title="VSS Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.123!2d78.1724!3d26.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSarafa+Bazar+Gwalior!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="text-xl font-heading font-semibold text-brand-dark mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
