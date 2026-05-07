import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle, Phone, Gem } from 'lucide-react';
import Hero from '../../components/home/Hero';
import LiveRates from '../../components/home/LiveRates';
import CategoryGrid from '../../components/home/CategoryGrid';
import TrustBadges from '../../components/home/TrustBadges';
import ProductCard from '../../components/product/ProductCard';
import api from '../../utils/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data.data || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <Helmet>
        <title>Vitthaldas Singhal Saraf — Traditional Gold & Silver Jewellers | Gwalior</title>
        <meta
          name="description"
          content="Shop hallmark-certified gold and silver jewellery from Vitthaldas Singhal Saraf, Sarafa Bazar, Gwalior. 60+ years of trust. Necklaces, rings, bangles & more."
        />
      </Helmet>

      <Hero />
      <LiveRates />

      {/* ── Featured Products ───────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ backgroundColor: '#fff', paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="section-container">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '40px',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-gold, #b8860b)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '32px',
                      height: '1px',
                      backgroundColor: 'var(--color-brand-gold, #b8860b)',
                    }}
                  />
                  HANDPICKED FOR YOU
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 700,
                    color: 'var(--color-brand-dark, #1a1a1a)',
                    margin: 0,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Featured Collection
                </h2>
              </div>

              <Link
                to="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-brand-dark, #1a1a1a)',
                  textDecoration: 'none',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--color-brand-dark, #1a1a1a)',
                  paddingBottom: '2px',
                  transition: 'color 0.3s, border-color 0.3s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-brand-gold, #b8860b)';
                  e.currentTarget.style.borderColor = 'var(--color-brand-gold, #b8860b)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-brand-dark, #1a1a1a)';
                  e.currentTarget.style.borderColor = 'var(--color-brand-dark, #1a1a1a)';
                }}
              >
                VIEW ALL COLLECTION
                <ArrowRight size={14} />
              </Link>
            </div>

            <div
              className="product-grid"
              style={{ alignItems: 'stretch', paddingTop: '8px', paddingBottom: '8px' }}
            >
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }} className="sm:hidden">
              <Link
                to="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-brand-gold, #b8860b)',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                VIEW ALL COLLECTION <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CategoryGrid />
      <TrustBadges />

      {/* ── Showroom CTA ────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--color-brand-cream, #f9f5ef)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div className="section-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
            }}
          >
            {/* Left — content */}
            <div
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(40px, 5vw, 64px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brand-gold, #b8860b)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '1px',
                    backgroundColor: 'var(--color-brand-gold, #b8860b)',
                  }}
                />
                Visit Our Showroom
              </p>

              <h2
                style={{
                  fontSize: 'clamp(26px, 3.5vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--color-brand-dark, #1a1a1a)',
                  lineHeight: 1.3,
                  marginBottom: '16px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Experience the Beauty{' '}
                <em
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--color-brand-gold-dark, #8B6914)',
                    display: 'block',
                  }}
                >
                  in Person
                </em>
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  color: '#777',
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginBottom: '36px',
                  maxWidth: '420px',
                }}
              >
                Nothing compares to seeing our jewellery up close. Visit us at Sarafa Bazar to
                experience the craftsmanship, try on your favourite pieces, and receive personalised
                guidance from our experts.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a
                  href="https://wa.me/917512345678?text=Hi%2C%20I'd%20like%20to%20book%20a%20visit%20to%20your%20showroom."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <MessageCircle size={16} style={{ color: '#22c55e' }} />
                  Book a Visit on WhatsApp
                </a>
                <a
                  href="tel:+917512345678"
                  className="btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    borderRadius: '4px',
                    color: '#1a1a1a',
                    borderColor: '#ddd',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Phone size={15} /> Call Us Directly
                </a>
              </div>
            </div>

            {/* Right — Location card */}
            <div
              style={{
                backgroundColor: 'var(--color-brand-dark, #1a1a1a)',
                padding: 'clamp(40px, 5vw, 48px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                <Gem size={16} style={{ color: 'var(--color-brand-gold, #b8860b)' }} />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-gold-light, #d4a94a)',
                  }}
                >
                  Showroom
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
                <MapPin
                  size={20}
                  style={{ color: 'var(--color-brand-gold, #b8860b)', marginTop: '2px', flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '6px', color: '#fff' }}>
                    Our Address
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                    Sarafa Bazar, Lashkar,
                    <br />
                    Gwalior, Madhya Pradesh,
                    <br />
                    India — 474001
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <p
                  style={{
                    fontSize: '10px',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontWeight: 500,
                    marginBottom: '14px',
                  }}
                >
                  Store Hours
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 300 }}>
                      Monday – Saturday
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-brand-gold-light, #d4a94a)' }}>
                      10:00 AM – 9:00 PM
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 300 }}>Sunday</span>
                    <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-brand-gold-light, #d4a94a)' }}>
                      11:00 AM – 7:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer is rendered by Layout.jsx via <Footer /> — do NOT add footer here */}
    </>
  );
}
