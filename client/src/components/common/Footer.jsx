import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300">
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Main Footer */}
      <div className="section-container pt-16 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <h3 className="text-xl font-heading text-white font-bold tracking-[-0.01em]">
                Vitthaldas Singhal Saraf
              </h3>
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-brand-gold-muted mt-1">
                Est. 1965 — Sarafa Bazar, Gwalior
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 font-light mb-6 max-w-sm">
              A legacy of trust and fine craftsmanship spanning three generations.
              Hallmark certified gold & silver jewellery from the heart of Gwalior.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Hallmark', 'BIS 916', 'Certified', 'Since 1965'].map(badge => (
                <span key={badge} className="px-3 py-1.5 border border-brand-gold/20 text-brand-gold-light text-[9px] tracking-wider uppercase rounded font-medium hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all duration-300 cursor-default">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">Collections</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Jewellery', path: '/shop' },
                { label: 'Gold Collection', path: '/shop?metalType=gold' },
                { label: 'Silver Collection', path: '/shop?metalType=silver' },
                { label: 'Bridal Sets', path: '/shop?occasion=wedding' },
                { label: 'Daily Wear', path: '/shop?occasion=daily-wear' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="group text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light flex items-center gap-1">
                    {link.label}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Track Order', path: '/orders' },
                { label: 'Returns & Exchange', path: '/contact' },
                { label: 'Size Guide', path: '/contact' },
                { label: 'FAQ', path: '/contact' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="group text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light flex items-center gap-1">
                    {link.label}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">Visit Our Showroom</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-brand-gold" />
                </div>
                <span className="text-sm text-gray-400 font-light leading-relaxed">
                  Sarafa Bazar, Lashkar,<br />
                  Gwalior, MP — 474001
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-brand-gold" />
                </div>
                <a href="tel:+917512345678" className="text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light pt-1.5">
                  +91 751 234 5678
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-brand-gold" />
                </div>
                <a href="mailto:info@vssaraf.com" className="text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light pt-1.5">
                  info@vssaraf.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-brand-gold" />
                </div>
                <div className="text-sm text-gray-400 font-light pt-1">
                  <p>Mon–Sat: 10 AM – 9 PM</p>
                  <p className="text-gray-500">Sun: 11 AM – 7 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/80">
        <div className="section-container py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-[11px] text-gray-500 font-light">
            © {new Date().getFullYear()} Vitthaldas Singhal Saraf. All rights reserved.
          </span>
          <span className="text-[11px] text-gray-600 font-light flex items-center gap-1.5">
            Crafted with <Heart size={10} className="text-brand-gold" fill="currentColor" /> in Gwalior, India
          </span>
        </div>
      </div>
    </footer>
  );
}
