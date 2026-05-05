import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300">
      {/* Main Footer */}
      <div className="section-container pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <h3 className="text-xl font-heading text-white font-bold tracking-[-0.01em]">
                Vitthaldas Singhal Saraf
              </h3>
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-brand-gold-muted mt-0.5">
                Est. 1965 — Sarafa Bazar, Gwalior
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 font-light mb-5 max-w-sm">
              A legacy of trust and fine craftsmanship spanning three generations.
              Hallmark certified gold & silver jewellery from the heart of Gwalior.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Hallmark', 'BIS 916', 'Certified', 'Since 1965'].map(badge => (
                <span key={badge} className="px-2.5 py-1 border border-brand-gold/20 text-brand-gold-light text-[9px] tracking-wider uppercase rounded-sm font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-5">Collections</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Jewellery', path: '/shop' },
                { label: 'Gold Collection', path: '/shop?metalType=gold' },
                { label: 'Silver Collection', path: '/shop?metalType=silver' },
                { label: 'Bridal Sets', path: '/shop?occasion=wedding' },
                { label: 'Daily Wear', path: '/shop?occasion=daily-wear' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-5">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Track Order', path: '/orders' },
                { label: 'Returns & Exchange', path: '/contact' },
                { label: 'Size Guide', path: '/contact' },
                { label: 'FAQ', path: '/contact' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us */}
          <div className="lg:col-span-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-5">Visit Our Showroom</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin size={15} className="text-brand-gold shrink-0" />
                <span className="text-sm text-gray-400 font-light leading-relaxed">
                  Sarafa Bazar, Lashkar, Gwalior, MP, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-brand-gold shrink-0" />
                <a href="tel:+917512345678" className="text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light">
                  +91 751 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-brand-gold shrink-0" />
                <a href="mailto:info@vssaraf.com" className="text-sm text-gray-400 hover:text-brand-gold-light transition-colors font-light">
                  info@vssaraf.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={15} className="text-brand-gold shrink-0" />
                <span className="text-sm text-gray-400 font-light">
                  Mon–Sat: 10 AM – 9 PM
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="section-container py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[11px] text-gray-500 font-light">
            © {new Date().getFullYear()} Vitthaldas Singhal Saraf. All rights reserved.
          </span>
          <span className="text-[11px] text-gray-600 font-light">
            Crafted with tradition & trust in Gwalior, India
          </span>
        </div>
      </div>
    </footer>
  );
}
