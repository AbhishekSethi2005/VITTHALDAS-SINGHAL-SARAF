import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';

export default function Hero() {
  return (
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
            </Link>
            <a
              href="https://wa.me/917512345678"
              className="inline-flex items-center justify-center gap-3  rounded-[14px] border border-[#D4AF37]/80 bg-black/20 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] backdrop-blur-sm transition-colors hover:bg-[#D4AF37] hover:text-black"
            >
              <CalendarDays size={15} /> BOOK A VISIT <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
