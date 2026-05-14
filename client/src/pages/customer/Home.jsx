import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
} from 'lucide-react';
import Hero from '../../components/home/Hero';
import LiveRates from '../../components/home/LiveRates';
import CategoryGrid from '../../components/home/CategoryGrid';
import TrustBadges from '../../components/home/TrustBadges';
import ProductCard from '../../components/product/ProductCard';
import api from '../../utils/api';

const fallbackFeatured = [
  {
    _id: 'lakshmi-gold-necklace',
    slug: 'lakshmi-gold-necklace',
    name: 'Lakshmi Gold Necklace',
    metalType: 'GOLD',
    purity: '22K',
    netWeight: 24,
    pricing: { totalBeforeTax: 379198 },
    images: [{ url: '/images/gold.png' }],
  },
  {
    _id: 'classic-gold-bangles-set',
    slug: 'classic-gold-bangles-set',
    name: 'Classic Gold Bangles Set',
    metalType: 'GOLD',
    purity: '22K',
    netWeight: 17.2,
    pricing: { totalBeforeTax: 269178 },
    images: [{ url: '/images/hero.png' }],
  },
  {
    _id: 'kundan-bridal-set',
    slug: 'kundan-bridal-set',
    name: 'Kundan Bridal Set',
    metalType: 'GOLD',
    purity: '22K',
    netWeight: 72,
    pricing: { totalBeforeTax: 1224592 },
    images: [{ url: '/images/bridal.png' }],
  },
  {
    _id: 'diamond-cut-gold-chain',
    slug: 'diamond-cut-gold-chain',
    name: 'Diamond Cut Gold Chain',
    metalType: 'GOLD',
    purity: '22K',
    netWeight: 11.5,
    pricing: { totalBeforeTax: 178249 },
    images: [{ url: '/images/daily.png' }],
  },
  {
    _id: 'traditional-jhumka-earrings',
    slug: 'traditional-jhumka-earrings',
    name: 'Traditional Jhumka Earrings',
    metalType: 'GOLD',
    purity: '22K',
    netWeight: 8,
    pricing: { totalBeforeTax: 127199 },
    images: [{ url: '/images/hero2.png' }],
  },
  {
    _id: 'solitaire-gold-ring',
    slug: 'solitaire-gold-ring',
    name: 'Solitaire Gold Ring',
    metalType: 'GOLD',
    purity: '18K',
    netWeight: 3.8,
    pricing: { totalBeforeTax: 61780 },
    images: [{ url: '/images/silver.png' }],
  },
];

export default function Home() {
  const [featured, setFeatured] = useState(fallbackFeatured);

  useEffect(() => {
    let mounted = true;

    api
      .get('/products/featured')
      .then(({ data }) => {
        const products = data?.data || data?.products || [];
        if (mounted && products.length) setFeatured(products);
      })
      .catch(() => {
        if (mounted) setFeatured(fallbackFeatured);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-[#F9F6F0] text-[#1A1A1A]">
      <Helmet>
<<<<<<< Updated upstream
        <title>Vitthaldas Singhal Saraf — Traditional Gold & Silver Jewellers | Gwalior</title>
        <meta
          name="description"
          content="Shop hallmark-certified gold and silver jewellery from Vitthaldas Singhal Saraf, Sarafa Bazar, Gwalior. 60+ years of trust. Necklaces, rings, bangles & more."
        />
=======
        <title>Vitthaldas Singhal Saraf | Traditional Gold & Silver Jewellers, Gwalior</title>
>>>>>>> Stashed changes
      </Helmet>

      <Hero />
      <LiveRates />

<<<<<<< Updated upstream
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
=======
      <section className="bg-[#F9F6F0] pb-12 pt-3 sm:pb-16 sm:pt-5">
        <div className="section-container">
          <div className="mb-5 flex items-end justify-between gap-6">
            <div className="pb-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B58B22]">
                HANDPICKED FOR YOU
              </p>

              <h2 className="text-3xl font-medium text-[#1A1A1A] sm:text-4xl">
                Featured Collection
              </h2>
>>>>>>> Stashed changes
            </div>
            <Link
              to="/shop"
              className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B1A14] transition-colors hover:text-[#B58B22] sm:inline-flex"
            >
              VIEW ALL COLLECTION <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {featured.slice(0, 6).map((product) => (
              <ProductCard key={product._id || product.slug || product.name} product={product} />
            ))}
          </div>

          <div className="mt-7 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B58B22]"
            >
              VIEW ALL COLLECTION <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <CategoryGrid />

<<<<<<< Updated upstream
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
=======
      <section className="relative flex items-center overflow-hidden bg-[#120406] py-16 text-white sm:py-20">
        <div className="absolute inset-0 grid grid-cols-1 opacity-70 lg:grid-cols-2 ">
          <img
            src="/images/hero2.png"
            alt=""
            className="hidden h-full w-full object-cover opacity-45 mix-blend-luminosity lg:block"
          />
          <img
            src="/images/hero-banner.png"
            alt=""
            className="h-full w-full object-cover opacity-55 mix-blend-screen"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#25070B]/90 to-black/70" />

        <div className="section-container relative z-10 flex items-center min-h-[500px]">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr]">
            <div className="min-h-[260px] overflow-hidden border border-[#D4AF37]/25 bg-black/25 rounded-[24px]">
              <img
                src="/images/hero.png"
                alt="Vitthaldas Singhal Saraf showroom"
                className="h-full min-h-[260px] w-full object-cover opacity-80"
              />
            </div>

            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                OUR HERITAGE
              </p>
              <h2 className="mb-5 text-4xl font-medium leading-tight sm:text-5xl">
                Six Decades of
                <br />
                Trust & Elegance
              </h2>
              <p className="mb-10 max-w-xl text-sm leading-7 text-white/75">
                Established in 1965 in the historic Sarafa Bazar of Gwalior,
                Vitthaldas Singhal Saraf has been the jeweller of choice for generations.
                Every ornament we craft carries forward a legacy of purity, craftsmanship and trust.
              </p>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  ['60+', 'YEARS OF TRUST'],
                  ['10K+', 'HAPPY FAMILIES'],
                  ['3', 'GENERATIONS OF LEGACY'],
                  ['100%', 'HALLMARK CERTIFIED'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-heading text-4xl text-[#D4AF37]">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-white/80">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F6F0] py-12 sm:py-16 ">
        <div className="section-container pt-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1fr_0.95fr]">
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B58B22]">
                VISIT OUR SHOWROOM
              </p>
              <h2 className="mb-5 text-4xl font-medium leading-tight text-[#1A1A1A]">
                Experience the Beauty
                <br />
                <span className="text-[#B58B22]">in Person</span>
              </h2>
              <p className="mb-8 max-w-md text-sm leading-7 text-[#5E554A]">
                Visit our showroom at Sarafa Bazar to explore our exclusive collections,
                try your favourite pieces and get personalised guidance from our experts.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row ">
                <a
                  href="https://wa.me/917512345678"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#30080F] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] transition-colors hover:bg-[#4A0E17]"
                >
                  <MessageCircle size={14} /> BOOK A VISIT ON WHATSAPP <ArrowRight size={13} />
                </a>
                <a
                  href="tel:+917512345678"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#C9B89D] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4A0E17] transition-colors hover:border-[#B58B22]"
>>>>>>> Stashed changes
                >
                  <Phone size={14} /> CALL US DIRECTLY
                </a>
              </div>
            </div>

<<<<<<< Updated upstream
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
=======
            <div className="min-h-[300px] overflow-hidden rounded-[24px]">
              <img
                src="/images/hero2.png"
                alt="Showroom interior"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center border border-[#D8C7A8] bg-[#F2EBDD] p-7 rounded-[24px] sm:p-9">
              <div className="mb-8 flex items-start gap-4">
                <MapPin className="mt-1 shrink-0 text-[#B58B22]" size={24} />
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A7B4F]">
                    OUR ADDRESS
                  </p>
                  <p className="text-sm font-semibold leading-7 text-[#1A1A1A]">
>>>>>>> Stashed changes
                    Sarafa Bazar, Lashkar,
                    <br />
                    Gwalior, Madhya Pradesh,
                    <br />
<<<<<<< Updated upstream
                    India — 474001
=======
                    India - 474001
>>>>>>> Stashed changes
                  </p>
                </div>
              </div>

<<<<<<< Updated upstream
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
=======
              <div className="flex items-start gap-4">
                <Clock className="mt-1 shrink-0 text-[#B58B22]" size={24} />
                <div className="w-full">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A7B4F]">
                    STORE HOURS
                  </p>
                  <div className="grid gap-2 text-sm font-semibold text-[#1A1A1A] sm:grid-cols-[1fr_auto]">
                    <span>Monday - Saturday</span>
                    <span>10:00 AM - 9:00 PM</span>
                    <span>Sunday</span>
                    <span>11:00 AM - 7:00 PM</span>
>>>>>>> Stashed changes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
<<<<<<< Updated upstream
      {/* Footer is rendered by Layout.jsx via <Footer /> — do NOT add footer here */}
    </>
=======

      <TrustBadges />

      <section className="bg-[#0A0A0A] py-16 text-center text-white sm:py-20">
        <div className="section-container flex min-h-[100px] flex-col items-center justify-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            SINCE 1965
          </p>
          <h2 className="mx-auto max-w-4xl text-4xl font-medium uppercase tracking-[0.08em] sm:text-5xl">
            VITTHALDAS SINGHAL SARAF
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70">
            A legacy of purity, fine craftsmanship and trust carried through generations,
            crafted in the heart of Sarafa Bazar, Gwalior.
          </p>
          <a
            href="https://wa.me/917512345678"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-[24px] bg-[#D4AF37] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-[#B58B22]"
          >
            <ShoppingBag size={15} className="-mt-0.5" />
            <span className="mt-[3px]">BOOK A VISIT TODAY</span>
          </a>
        </div>
      </section>
    </div>
>>>>>>> Stashed changes
  );
}
