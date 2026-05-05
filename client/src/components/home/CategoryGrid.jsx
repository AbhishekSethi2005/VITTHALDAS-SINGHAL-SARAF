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
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-14">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-brand-gold" />
            CURATED CATEGORIES
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-dark mb-3">
            Shop by Collection
          </h2>
          <p className="text-gray-500 text-base font-light max-w-xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-500 group-hover:from-black/90 z-0" />

              {/* Gold border on hover */}
              <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-brand-gold/50 rounded-sm transition-all duration-500 z-10" />

              {/* Text Content */}
              <div className="absolute bottom-[20px] left-[20px] right-[20px] z-20">
                <h3 className="text-white font-heading font-semibold text-xl sm:text-2xl mb-1 group-hover:text-brand-gold-light transition-colors duration-300 drop-shadow-md">
                  {cat.name}
                </h3>
                <p className="text-gray-200 text-sm font-light opacity-90 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-sm">
                  {cat.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-brand-gold-light text-xs font-bold uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  Explore Collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:translate-x-1.5 transition-transform">
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
