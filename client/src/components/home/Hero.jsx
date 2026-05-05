import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/hero-banner.png',
    alt: 'Exquisite Traditional Indian Gold Bridal Jewellery Set',
    tagline: 'Heritage of Trust Since 1965',
    headline: ['Masterpieces of', 'Pure Elegance'],
    subtext: 'Discover our curated collection of hallmark-certified gold and silver jewellery. Handcrafted by master artisans for your most precious moments.',
  },
  {
    image: '/images/hero2.png',
    alt: 'Traditional Gold Necklace Collection by Vitthaldas Singhal Saraf',
    tagline: 'Handcrafted Perfection',
    headline: ['Where Tradition', 'Meets Artistry'],
    subtext: 'Every ornament tells a story of dedication, purity, and timeless beauty — crafted in the heart of Sarafa Bazar, Gwalior.',
  },
  {
    image: '/images/hero.png',
    alt: 'Premium Silver and Gold Jewellery Designs',
    tagline: 'Certified Purity · BIS Hallmark',
    headline: ['Adorn Your', 'Precious Moments'],
    subtext: 'From bridal splendour to everyday elegance — explore jewellery that carries forward six decades of trust and fine craftsmanship.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 900);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  // Auto-advance every 7 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[current];

  return (
    <section id="hero-banner" className="relative w-full h-[90vh] min-h-[640px] max-h-[900px] overflow-hidden bg-brand-dark">
      {/* Background Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 w-full h-full transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.alt}
            className="w-full h-full object-cover object-center animate-ken-burns"
            style={{ animationDuration: '25s', animationDelay: `${i * 0.5}s` }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Gradient Overlays — Deep, cinematic layers */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-brand-burgundy/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-[5] h-full flex flex-col justify-center section-container pointer-events-none">
        <div
          className="hero-content-wrapper pointer-events-auto relative z-[5]"
          key={current}
        >
          {/* Tagline */}
          <p
            className="text-brand-gold-light text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase mb-5 flex items-center gap-4 animate-text-reveal"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            <span className="w-10 h-[1px] bg-brand-gold-light inline-block" style={{ animation: 'revealLine 0.6s ease 0.2s forwards', width: 0 }} />
            {slide.tagline}
          </p>

          {/* Headline */}
          <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.5rem] font-heading font-bold text-white leading-[1.05] mb-6">
            <span
              className="block drop-shadow-lg animate-text-reveal"
              style={{ animationDelay: '0.25s', opacity: 0 }}
            >
              {slide.headline[0]}
            </span>
            <span
              className="block font-accent italic font-normal text-brand-gold-light drop-shadow-lg animate-text-reveal"
              style={{ animationDelay: '0.45s', opacity: 0 }}
            >
              {slide.headline[1]}
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-gray-300 text-base sm:text-lg font-light mb-10 leading-relaxed drop-shadow-md animate-text-reveal"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            {slide.subtext}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-text-reveal w-full max-w-[280px] sm:max-w-none"
            style={{ animationDelay: '0.8s', opacity: 0 }}
          >
            <Link
              to="/shop"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-light text-white hover:text-brand-dark font-semibold px-10 py-4 rounded-sm transition-all duration-300 btn-gold-shimmer"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide uppercase whitespace-nowrap">
                Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <a
              href="https://wa.me/917512345678?text=Hi%2C%20I'd%20like%20to%20book%20a%20visit%20to%20your%20showroom."
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 glass hover:bg-white/15 text-white font-medium px-10 py-4 rounded-sm transition-all duration-300"
            >
              <MessageCircle size={16} className="text-green-400" />
              <span className="text-sm tracking-wide whitespace-nowrap">Book a Visit</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      <div className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-4 z-10">
        <button
          onClick={prevSlide}
          className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <button
          onClick={nextSlide}
          className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Indicator Dots */}
      <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-brand-gold'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Decorative Bottom Gold Line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] z-10 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
    </section>
  );
}
