import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Shield, Award, Truck, Users, Star, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import LuxuryPageBanner from '../../components/common/LuxuryPageBanner';

// --- DATA ---
const TRUST_BADGES = [
  { icon: Shield, title: "BIS 916 Hallmark Gold", desc: "Certified & Hallmarked" },
  { icon: Award, title: "Lifetime Exchange", desc: "On all gold jewellery" },
  { icon: Truck, title: "Secure Shipping", desc: "Insured & safe delivery" },
  { icon: Users, title: "Trusted Since 1965", desc: "Serving generations" },
];

const CATEGORIES = [
  { name: 'Anklets', id: 'anklets', count: '40+ Designs', img: 'https://www.ijewels.co.in/cdn/shop/files/ChatGPT_Image_Jan_16_2026_11_58_00_AM.png?v=1768545021&width=2048?auto=format&fit=crop&q=80&w=600' },
  { name: 'Bangles', id: 'bangles', count: '85+ Designs', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Bridal Sets', id: 'bridal-sets', count: '50+ Designs', img: 'https://www.shopjbr.com/cdn/shop/files/JBRTJSNKS66-1copy_1080x1080_eb3f2a23-f205-4b00-a494-aed6fa90e3d5.jpg?v=1761900771&width=1445?auto=format&fit=crop&q=80&w=600' },
  { name: 'Chains', id: 'chains', count: '75+ Designs', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Coins & Bars', id: 'coins', count: '30+ Designs', img: 'https://cem-cms-data.s3.ap-south-1.amazonaws.com/Gold%20Coins%20or%20Jewellery%20Which%20One%20Pays%20You%20Back%20Better.webp?auto=format&fit=crop&q=80&w=600' },
  { name: 'Earrings', id: 'earrings', count: '150+ Designs', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600' },
  { name: 'Mangalsutra', id: 'mangalsutra', count: '60+ Designs', img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600' },
  { name: 'Necklaces', id: 'necklaces', count: '120+ Designs', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRULmu50gAJ_YFId41FcfQkQBsFzF4x9QVNpA&s?auto=format&fit=crop&q=80&w=600' },
  { name: 'Pendants', id: 'pendants', count: '90+ Designs', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOSQavq40bfBqGuiBsweYCchAikn7OfUWj9A&s?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rings', id: 'rings', count: '90+ Designs', img: 'https://annxmee.com/cdn/shop/collections/rings_22334_4_WebP.webp?v=1763882451?auto=format&fit=crop&q=80&w=600' }
];

export default function Collections() {
  const navigate = useNavigate();
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setApiCategories(data.data || []));
  }, []);

  const handleCategoryClick = (catName) => {
    const matched = apiCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (matched) {
      navigate(`/shop?category=${matched._id}`);
    } else {
      navigate(`/shop?category=${catName}`); // fallback
    }
  };

  return (
    <>
      <Helmet><title>Collections | Vitthaldas Singhal Saraf</title></Helmet>

      <div className="bg-[#fdfaf6] min-h-screen pb-20">

        {/* Luxury Hero Banner & Trust Strip */}
        <LuxuryPageBanner
          title="Our Collections"
          subtitle="Timeless designs. Trusted legacy. Explore our handcrafted jewellery collections."
          bgImage="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=2000"
          breadcrumbs={[{ label: 'Collections' }]}
        />

        {/* 3. Shop By Category Section */}
        <div className="pt-24 pb-16 max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="text-center mb-16 relative">
            <p className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4 relative inline-block bg-[#fdfaf6] px-4 z-10">BROWSE BY CATEGORY</p>
            <div className="absolute top-2 left-0 right-0 h-[1px] bg-[#E9D9C2] z-0"></div>
            <h2 className="font-serif text-4xl md:text-[44px] text-[#2A2118] font-medium">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col text-left overflow-hidden rounded-[24px] bg-[#FFFDF8] border border-[#E9D9C2] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(212,175,55,0.15)] hover:-translate-y-2 hover:border-[#D4AF37]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EAD8]">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#B58B22] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <ArrowRight size={14} />
                  </div>
                </div>
                <div className="p-5 relative">
                  <h3 className="font-serif text-[20px] text-[#2A2118] mb-1">{cat.name}</h3>
                  <p className="text-[11px] text-[#6E6256] font-medium tracking-wide mb-4">{cat.count}</p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B58B22] flex items-center gap-2 group-hover:text-[#4a0e17] transition-colors">
                    EXPLORE <ChevronRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Legacy / Heritage Banner Section */}
        <div className="mt-16 max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="bg-gradient-to-r from-[#2a080d] to-[#4a0e17] rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-[500px] relative">
              <img src="https://www.onlinepng.com/cdn/shop/files/unnamed_7_copy.jpg?auto=format&fit=crop&q=80&w=1000" alt="Showroom" className="w-full h-full object-cover absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center">
              <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">OUR LEGACY SINCE 1965</p>
              <h2 className="font-serif text-4xl lg:text-5xl text-white font-medium leading-[1.1] mb-6">Six Decades of Trust & Elegance</h2>
              <p className="text-[#E9D9C2] text-[15px] leading-relaxed mb-12 font-light">
                From handcrafted purity to timeless elegance — our journey of trust continues with every creation. We bring you jewellery that is not just an ornament, but an heirloom.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#D4AF37]/20 pt-8">
                <div>
                  <h4 className="text-3xl font-serif text-[#D4AF37] mb-1">60+</h4>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold">Years of Trust</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-[#D4AF37] mb-1">10K+</h4>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold">Happy Customers</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-[#D4AF37] mb-1">3</h4>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold">Generations</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-[#D4AF37] mb-1">100%</h4>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold">Hallmark Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Luxury Features Strip */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mt-16 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-[#E9D9C2]">
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-10 h-10 border border-[#D4AF37] rotate-45 flex items-center justify-center shrink-0">
                <Star size={18} className="text-[#B58B22] -rotate-45" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2A2118]">100% Pure Gold</h4>
                <p className="text-[12px] text-[#6E6256]">Transparent pricing</p>
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-12 bg-[#E9D9C2]" />

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-10 h-10 border border-[#D4AF37] rotate-45 flex items-center justify-center shrink-0">
                <Shield size={18} className="text-[#B58B22] -rotate-45" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2A2118]">Certified Jewellery</h4>
                <p className="text-[12px] text-[#6E6256]">BIS 916 Hallmark</p>
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-12 bg-[#E9D9C2]" />

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-10 h-10 border border-[#D4AF37] rotate-45 flex items-center justify-center shrink-0">
                <Award size={18} className="text-[#B58B22] -rotate-45" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2A2118]">Easy Exchange</h4>
                <p className="text-[12px] text-[#6E6256]">Lifetime exchange</p>
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-12 bg-[#E9D9C2]" />

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-10 h-10 border border-[#D4AF37] rotate-45 flex items-center justify-center shrink-0">
                <Users size={18} className="text-[#B58B22] -rotate-45" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2A2118]">Customer Support</h4>
                <p className="text-[12px] text-[#6E6256]">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
