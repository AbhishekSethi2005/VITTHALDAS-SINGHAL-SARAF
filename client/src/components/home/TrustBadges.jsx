import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L6 14V22C6 33.1 13.68 43.34 24 46C34.32 43.34 42 33.1 42 22V14L24 4Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M18 24L22 28L30 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Hallmark Certified',
    desc: 'Every piece certified under BIS standards with guaranteed purity.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M24 10V24L32 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 24H6M42 24H38M24 6V10M24 38V42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: '60+ Years Legacy',
    desc: 'Trusted by generations of families since 1965 in Sarafa Bazar.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L30 16H42L32 26L36 40L24 32L12 40L16 26L6 16H18L24 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: '100% Pure Gold',
    desc: 'Transparent pricing with full weight and rate breakdown visible.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="18" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M36 24H42C44 24 46 26 46 28V34C46 36 44 38 42 38H36" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <circle cx="40" cy="31" r="2" fill="currentColor"/>
        <path d="M12 18V12C12 8 16 4 20 4C24 4 28 8 28 12V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    title: 'Lifetime Exchange',
    desc: 'Full value exchange guarantee on all gold jewellery purchases.',
  },
];

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function TrustBadges() {
  return (
    <section className="relative overflow-hidden">
      {/* Trust Features */}
      <div className="bg-brand-cream/60 py-20 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-ornament text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-4 justify-center">
                Our Promise
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-dark mb-3">
                Why Families Choose Us
              </h2>
              <p className="text-gray-500 text-base font-light max-w-md mx-auto">
                Built on a foundation of trust, purity, and six decades of fine craftsmanship
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {features.map(({ icon, title, desc }, i) => (
              <AnimatedSection key={title} className={`delay-${(i + 1) * 100}`}>
                <div className="group text-center p-6 sm:p-8 rounded-sm bg-white border border-gray-100 hover:border-brand-gold/20 transition-all duration-500 card-hover">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 flex items-center justify-center text-brand-gold group-hover:from-brand-gold/20 group-hover:to-brand-gold/10 transition-all duration-500">
                    {icon}
                  </div>
                  <h3 className="font-heading font-semibold text-brand-dark text-base mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-light">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Heritage Story Strip */}
      <div className="bg-brand-dark py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <p className="text-brand-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 justify-center lg:justify-start">
                  <span className="w-8 h-[1px] bg-brand-gold" />
                  Our Heritage
                </p>
                <h2 className="text-3xl sm:text-4xl font-accent font-medium text-white leading-snug mb-5">
                  Six Decades of <span className="italic text-brand-gold-light">Trust & Elegance</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                  Established in 1965 in the historic Sarafa Bazar of Gwalior, Vitthaldas Singhal Saraf
                  has been the jeweller of choice for generations. Every ornament we craft carries forward
                  a legacy of uncompromising purity, meticulous artisanship, and the warmth of a family
                  that treats every customer as their own.
                </p>
              </div>
              <div className="flex items-center gap-8 sm:gap-12 shrink-0">
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-heading font-bold text-gold-gradient">60+</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1">Years</p>
                </div>
                <div className="w-[1px] h-16 bg-gray-700" />
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-heading font-bold text-gold-gradient">3</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1">Generations</p>
                </div>
                <div className="w-[1px] h-16 bg-gray-700" />
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-heading font-bold text-gold-gradient">10K+</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1">Families</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
