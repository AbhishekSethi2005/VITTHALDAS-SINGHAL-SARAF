import { Link } from 'react-router-dom';
<<<<<<< Updated upstream
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Heart, Gem } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#111010',
        color: '#9ca3af',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Decorative top gold gradient line ── */}
      <div
        style={{
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(184,134,11,0.25) 20%, rgba(184,134,11,0.7) 50%, rgba(184,134,11,0.25) 80%, transparent 100%)',
        }}
      />

      {/* ── Subtle background texture / noise layer ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(184,134,11,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════
          MAIN FOOTER GRID
      ══════════════════════════════════════════ */}
      <div
        className="section-container"
        style={{
          position: 'relative',
          paddingTop: '72px',
          paddingBottom: '56px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px 40px',
            alignItems: 'start',
          }}
        >

          {/* ── Col 1: Brand ── */}
          <div style={{ maxWidth: '300px' }}>
            {/* Logo / name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Gem size={16} style={{ color: '#b8860b', flexShrink: 0 }} />
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                Vitthaldas Singhal Saraf
              </h3>
            </div>

            <p
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#9a7c3f',
                marginBottom: '20px',
                paddingLeft: '26px',
              }}
            >
              Est. 1965 — Sarafa Bazar, Gwalior
            </p>

            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.75,
                color: '#6b7280',
                fontWeight: 300,
                marginBottom: '24px',
              }}
            >
              A legacy of trust and fine craftsmanship spanning three generations.
              Hallmark certified gold &amp; silver jewellery from the heart of Gwalior.
            </p>

            {/* Badge chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Hallmark', 'BIS 916', 'Certified', 'Since 1965'].map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: '5px 10px',
                    border: '1px solid rgba(184,134,11,0.2)',
                    color: '#c9a84c',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    borderRadius: '3px',
                    fontWeight: 600,
                    transition: 'border-color 0.25s, background 0.25s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,134,11,0.5)';
                    e.currentTarget.style.background = 'rgba(184,134,11,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,134,11,0.2)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ── Col 2: Collections ── */}
          <div>
            <h4
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              Collections
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'All Jewellery',     path: '/shop' },
                { label: 'Gold Collection',   path: '/shop?metalType=gold' },
                { label: 'Silver Collection', path: '/shop?metalType=silver' },
                { label: 'Bridal Sets',       path: '/shop?occasion=wedding' },
                { label: 'Daily Wear',        path: '/shop?occasion=daily-wear' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13.5px',
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontWeight: 300,
                      transition: 'color 0.2s, gap 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c9a84c';
                      e.currentTarget.style.gap = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                      e.currentTarget.style.gap = '4px';
                    }}
                  >
                    {link.label}
                    <ArrowUpRight size={11} style={{ opacity: 0.5 }} />
=======
import { Mail, MapPin, Phone } from 'lucide-react';

const quickLinks = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['Collections', '/shop'],
  ['About Us', '/contact'],
  ['Contact Us', '/contact'],
];

const serviceLinks = ['Track Order', 'Returns & Exchange', 'Shipping Policy', 'Size Guide', 'FAQ'];

export default function Footer() {
  return (
    <footer className="bg-[#111111] pt-14 text-white">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12">
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

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-sm text-white/65 transition-colors hover:text-[#D4AF37]">
                    {label}
>>>>>>> Stashed changes
                  </Link>
                </li>
              ))}
            </ul>
          </div>

<<<<<<< Updated upstream
          {/* ── Col 3: Support ── */}
          <div>
            <h4
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Track Order',        path: '/orders' },
                { label: 'Returns & Exchange', path: '/contact' },
                { label: 'Size Guide',         path: '/contact' },
                { label: 'FAQ',                path: '/contact' },
                { label: 'Contact Us',         path: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13.5px',
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontWeight: 300,
                      transition: 'color 0.2s, gap 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c9a84c';
                      e.currentTarget.style.gap = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                      e.currentTarget.style.gap = '4px';
                    }}
                  >
                    {link.label}
                    <ArrowUpRight size={11} style={{ opacity: 0.5 }} />
=======
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <Link to="#" className="text-sm text-white/65 transition-colors hover:text-[#D4AF37]">
                    {label}
>>>>>>> Stashed changes
                  </Link>
                </li>
              ))}
            </ul>
          </div>

<<<<<<< Updated upstream
          {/* ── Col 4: Visit Our Showroom ── */}
          <div>
            <h4
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              Visit Our Showroom
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Address */}
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(184,134,11,0.1)',
                    border: '1px solid rgba(184,134,11,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <MapPin size={14} style={{ color: '#b8860b' }} />
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 300, lineHeight: 1.7 }}>
                  Sarafa Bazar, Lashkar,<br />
                  Gwalior, MP — 474001
                </span>
              </li>

              {/* Phone */}
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(184,134,11,0.1)',
                    border: '1px solid rgba(184,134,11,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={14} style={{ color: '#b8860b' }} />
                </div>
                <a
                  href="tel:+917512345678"
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontWeight: 300,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                >
                  +91 751 234 5678
                </a>
              </li>

              {/* Email */}
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(184,134,11,0.1)',
                    border: '1px solid rgba(184,134,11,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={14} style={{ color: '#b8860b' }} />
                </div>
                <a
                  href="mailto:info@vssaraf.com"
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontWeight: 300,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                >
                  info@vssaraf.com
                </a>
              </li>

              {/* Hours */}
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(184,134,11,0.1)',
                    border: '1px solid rgba(184,134,11,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Clock size={14} style={{ color: '#b8860b' }} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.7 }}>
                  <p style={{ color: '#6b7280', margin: 0 }}>Mon–Sat: 10 AM – 9 PM</p>
                  <p style={{ color: '#4b5563', margin: 0 }}>Sun: 11 AM – 7 PM</p>
                </div>
              </li>

=======
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
>>>>>>> Stashed changes
            </ul>
          </div>

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

<<<<<<< Updated upstream
      {/* ══════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════ */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        {/* thin gold line above bottom bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.5), transparent)',
          }}
        />

        <div
          className="section-container"
          style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#4b5563', fontWeight: 300 }}>
            © {new Date().getFullYear()} Vitthaldas Singhal Saraf. All rights reserved.
          </span>

          <span
            style={{
              fontSize: '11px',
              color: '#4b5563',
              fontWeight: 300,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Crafted with{' '}
            <Heart size={10} fill="#b8860b" style={{ color: '#b8860b' }} />{' '}
            in Gwalior, India
          </span>
=======
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-[11px] text-white/45 sm:flex-row">
          <p>(c) 2026 Vitthaldas Singhal Saraf. All rights reserved.</p>
          <p>Crafted with care in Gwalior, India</p>
>>>>>>> Stashed changes
        </div>
      </div>
    </footer>
  );
}
