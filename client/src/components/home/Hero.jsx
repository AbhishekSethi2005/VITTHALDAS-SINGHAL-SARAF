import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';

export default function Hero() {
  return (
<<<<<<< Updated upstream
    <section id="hero-banner" className="relative w-full h-[80vh] sm:h-[85vh] lg:h-[90vh] min-h-[600px] sm:min-h-[640px] max-h-[900px] overflow-hidden bg-brand-dark">
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
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/70 sm:from-black/75 via-black/35 sm:via-black/40 to-black/5 sm:to-black/10" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/60 sm:from-black/70 via-transparent to-black/15 sm:to-black/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-brand-burgundy/15 sm:from-brand-burgundy/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-[5] h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
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
          <h1 className="text-[2rem] sm:text-5xl lg:text-[4.5rem] font-heading font-bold text-white leading-[1.05] mb-4 sm:mb-6">
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
            className="text-gray-300 text-sm sm:text-base lg:text-lg font-light mb-6 sm:mb-10 leading-relaxed drop-shadow-md animate-text-reveal max-w-2xl"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            {slide.subtext}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 animate-text-reveal w-full sm:max-w-none"
            style={{ animationDelay: '0.8s', opacity: 0 }}
          >
            <Link
              to="/shop"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 bg-brand-gold hover:bg-brand-gold-light text-white hover:text-brand-dark font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-md transition-all duration-300 btn-gold-shimmer text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide uppercase whitespace-nowrap">
                Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
=======
    <section className="relative min-h-[620px] overflow-hidden bg-[#080302] text-white">
      <div className="absolute inset-0">
        <img
          src="/images/hero-banner.png"
          alt="Traditional handcrafted jewellery"
          className="h-full w-full object-cover opacity-90"
          style={{ objectPosition: '72% center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      </div>

      <div className="section-container relative z-10 flex min-h-[620px] items-center py-20">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            SINCE 1965
          </p>
          <h1 className="mb-5 text-4xl font-medium uppercase leading-tight tracking-[0.06em] sm:text-5xl lg:text-6xl">
            VITTHALDAS
            <br />
            SINGHAL SARAF
          </h1>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            HANDCRAFTED PERFECTION
          </p>
          <p className="mb-6 font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Where Tradition
            <br />
            <span className="italic text-[#E8C97A]">Meets Artistry</span>
          </p>
          <p className="mb-9 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
            Every ornament tells a story of dedication, purity, and timeless beauty - crafted
            in the heart of Sarafa Bazar, Gwalior.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/shop"
              className=" inline-flex items-center justify-center gap-3 rounded-[14px] bg-[#D4AF37] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#B58B22]"
            >
              EXPLORE COLLECTION <ArrowRight size={15} />
>>>>>>> Stashed changes
            </Link>
            <a
<<<<<<< Updated upstream
              href="https://wa.me/917512345678?text=Hi%2C%20I'd%20like%20to%20book%20a%20visit%20to%20your%20showroom."
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 glass hover:bg-white/15 text-white font-medium px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-md transition-all duration-300 text-sm sm:text-base"
            >
              <MessageCircle size={14} className="text-green-400" />
              <span className="tracking-wide whitespace-nowrap">Book Visit</span>
=======
              href="https://wa.me/917512345678"
              className="inline-flex items-center justify-center gap-3  rounded-[14px] border border-[#D4AF37]/80 bg-black/20 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] backdrop-blur-sm transition-colors hover:bg-[#D4AF37] hover:text-black"
            >
              <CalendarDays size={15} /> BOOK A VISIT <ArrowRight size={15} />
>>>>>>> Stashed changes
            </a>
          </div>
        </div>
      </div>
<<<<<<< Updated upstream

      {/* Slide Navigation Arrows */}
      <div className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-4 z-10">
        <button
          onClick={prevSlide}
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <button
          onClick={nextSlide}
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
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
=======
>>>>>>> Stashed changes
    </section>
  );
}
