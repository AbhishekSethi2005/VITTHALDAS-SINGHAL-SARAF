import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Gold Necklaces',
    desc: 'Exquisite designs for every occasion',
    image: '/images/gold.png',
    link: '/shop?metalType=gold',
    span: 'col-span-2 row-span-2', // large featured
  },
  {
    name: 'Silver Collection',
    desc: 'Pure silver ornaments & coins',
    image: '/images/silver.png',
    link: '/shop?metalType=silver',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Bridal Jewellery',
    desc: 'Complete bridal trousseau sets',
    image: '/images/bridal.png',
    link: '/shop?occasion=wedding',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Daily Wear',
    desc: 'Elegant everyday pieces',
    image: '/images/daily.png',
    link: '/shop?occasion=daily-wear',
    span: 'col-span-2 row-span-1',
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="section-ornament text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-4 justify-center">
            Curated Categories
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-dark mb-3">
            Shop by Collection
          </h2>
          <p className="text-gray-500 text-base font-light max-w-md mx-auto">
            Find the perfect piece for every occasion — from bridal splendour to everyday elegance
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] sm:auto-rows-[280px] gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className={`group relative overflow-hidden rounded-sm ${cat.span}`}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80" />

              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-gold/40 rounded-sm transition-all duration-500 z-10" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10">
                <h3 className="text-white font-heading font-semibold text-lg sm:text-xl mb-1 group-hover:text-brand-gold-light transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm font-light opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {cat.desc}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-brand-gold-light text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
