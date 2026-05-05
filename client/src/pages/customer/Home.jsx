import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react';
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
        <meta name="description" content="Shop hallmark-certified gold and silver jewellery from Vitthaldas Singhal Saraf, Sarafa Bazar, Gwalior. 60+ years of trust. Necklaces, rings, bangles & more." />
      </Helmet>

      <Hero />
      <LiveRates />

      {/* Featured Products Section */}
      {featured.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="section-container">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-12 mb-6">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-3 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-brand-gold" />
                  HANDPICKED FOR YOU
                </p>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-dark">
                  Featured Collection
                </h2>
              </div>
              <Link
                to="/shop"
                className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-brand-dark hover:text-brand-gold tracking-widest uppercase mt-4 sm:mt-0 pb-1 border-b border-brand-dark hover:border-brand-gold transition-colors"
              >
                VIEW ALL COLLECTION
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="product-grid items-stretch py-2">
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="sm:hidden mt-8 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold tracking-wide uppercase"
              >
                VIEW ALL COLLECTION <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CategoryGrid />
      <TrustBadges />

      {/* Showroom CTA Section */}
      <section className="bg-brand-cream py-20 sm:py-24">
        <div className="section-container showroom-grid">
          {/* Left content */}
          <div className="p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-brand-gold" />
              Visit Our Showroom
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-dark leading-snug mb-4">
              Experience the Beauty <br className="hidden sm:block" />
              <span className="font-accent italic font-normal text-brand-gold-dark">in Person</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed font-light mb-8 max-w-md">
              Nothing compares to seeing our jewellery up close. Visit us at Sarafa Bazar
              to experience the craftsmanship, try on your favourite pieces, and receive
              personalised guidance from our experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/917512345678?text=Hi%2C%20I'd%20like%20to%20book%20a%20visit%20to%20your%20showroom."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-8 py-4 rounded-sm transition-all duration-300 text-sm tracking-wide"
              >
                <MessageCircle size={16} className="text-green-400" />
                Book a Visit on WhatsApp
              </a>
              <a
                href="tel:+917512345678"
                className="inline-flex items-center justify-center gap-3 border border-gray-200 hover:border-brand-gold text-brand-dark font-medium px-8 py-4 rounded-sm transition-all duration-300 text-sm tracking-wide"
              >
                <Phone size={15} /> Call Us Directly
              </a>
            </div>
          </div>

          {/* Right — Map/Location card */}
          <div className="w-full bg-brand-dark p-10 sm:p-12 flex flex-col justify-center text-white box-border">
            <div className="flex items-start gap-3 mb-6">
              <MapPin size={20} className="text-brand-gold mt-1 shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">Our Address</p>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Sarafa Bazar, Lashkar,<br />
                  Gwalior, Madhya Pradesh,<br />
                  India — 474001
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">Store Hours</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-light">Monday – Saturday</span>
                  <span className="font-medium text-brand-gold-light">10:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-light">Sunday</span>
                  <span className="font-medium text-brand-gold-light">11:00 AM – 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
