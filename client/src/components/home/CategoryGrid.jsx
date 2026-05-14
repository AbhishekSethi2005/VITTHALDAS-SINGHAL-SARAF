import { Link } from 'react-router-dom';
import { ArrowRight, Gem } from 'lucide-react';

const categories = [
  { name: 'Bridal Jewellery', img: '/images/bridal.png', path: '/shop?occasion=wedding' },
  { name: 'Gold Collection', img: '/images/gold.png', path: '/shop?metalType=gold' },
  { name: 'Silver Collection', img: '/images/silver.png', path: '/shop?metalType=silver' },
  { name: 'Temple Jewellery', img: '/images/hero.png', path: '/shop?style=temple' },
  { name: 'Daily Wear', img: '/images/daily.png', path: '/shop?occasion=daily-wear' },
  { name: 'Rings & Earrings', img: '/images/hero2.png', path: '/shop?category=rings' },
];

export default function CategoryGrid() {
  return (
    <section className="bg-[#F9F6F0] pb-14">
      <div className="section-container">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B58B22]">
            CURATED CATEGORIES
          </p>
          <h2 className=" text-3xl font-medium text-[#1A1A1A] sm:text-4xl">
            Shop by Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="group relative block aspect-[1.55] overflow-hidden rounded-[14px] bg-black"
            >
              <img
                src={category.img}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-[#D4AF37]/70 text-[#D4AF37]">
                    <Gem size={13} />
                  </span>
                  <h3 className="text-sm font-medium text-white">{category.name}</h3>
                </div>
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37] opacity-90 transition-all group-hover:translate-x-1">
                  Explore <ArrowRight size={12} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
