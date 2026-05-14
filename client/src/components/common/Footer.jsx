import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const quickLinks = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['Collections', '/shop'],
  ['About Us', '/about'],
  ['Contact Us', '/contact'],
];

const serviceLinks = ['Track Order', 'Returns & Exchange', 'Shipping Policy', 'Size Guide', 'FAQ'];

export default function Footer() {
  return (
    <footer className="bg-[#111111] pt-14 text-white">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Logo & Info */}
          <div className="lg:col-span-4">
            <Link to="/" className="mb-5 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-[#D4AF37]">
                <svg viewBox="0 0 100 100" className="h-8 w-8 fill-[#D4AF37]" aria-hidden="true">
                  <path d="M50 0L60 30L90 10L70 40L100 50L70 60L90 90L60 70L50 100L40 70L10 90L30 60L0 50L30 40L10 10L40 30Z" />
                </svg>
              </div>
              <div>
                <p className="font-heading text-lg uppercase leading-tight tracking-[0.12em]">
                  VITTHALDAS
                  <br />
                  SINGHAL SARAF
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-[#D4AF37]">
                  - Since 1965 -
                </p>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/65">
              A legacy of trust and fine craftsmanship spanning three generations. Hallmark
              certified gold and silver jewellery from the heart of Gwalior.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-sm text-white/65 transition-colors hover:text-[#D4AF37]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <Link to="#" className="text-sm text-white/65 transition-colors hover:text-[#D4AF37]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Collections */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              POPULAR COLLECTIONS
            </h3>
            <ul className="space-y-3">
              {['Bridal Jewellery', 'Gold Collection', 'Silver Collection', 'Temple Jewellery', 'Rings & Earrings'].map((label) => (
                <li key={label}>
                  <Link to="/shop" className="text-sm text-white/65 transition-colors hover:text-[#D4AF37]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              CONTACT US
            </h3>
            <ul className="space-y-4 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <Phone size={15} className="mt-1 shrink-0 text-[#D4AF37]" />
                +91 751 234 5678
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-1 shrink-0 text-[#D4AF37]" />
                info@vssaraf.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-1 shrink-0 text-[#D4AF37]" />
                <span>
                  Sarafa Bazar, Lashkar,
                  <br />
                  Gwalior, MP - 474001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-[11px] text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Vitthaldas Singhal Saraf. All rights reserved.</p>
          <p>Crafted with care in Gwalior, India</p>
        </div>
      </div>
    </footer>
  );
}
