import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Award, Truck, Users } from 'lucide-react';

const DEFAULT_TRUST_BADGES = [
  { icon: Shield, title: "BIS 916 Hallmark Gold", desc: "Certified & Hallmarked" },
  { icon: Award, title: "Lifetime Exchange", desc: "On all gold jewellery" },
  { icon: Truck, title: "Secure Shipping", desc: "Insured & safe delivery" },
  { icon: Users, title: "Trusted Since 1965", desc: "Serving generations" },
];

export default function LuxuryPageBanner({ 
  title, 
  subtitle, 
  bgImage, 
  breadcrumbs = [], 
  trustBadges = DEFAULT_TRUST_BADGES,
  hideTrustBadges = false
}) {
  return (
    <>
      {/* 1. Luxury Hero Banner */}
      <div className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a080d]/95 via-[#4a0e17]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-[#E9D9C2] mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.link ? (
                  <Link to={crumb.link} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight size={10} />}
              </span>
            ))}
          </nav>
          <h1 className="font-serif text-5xl md:text-7xl text-white font-medium leading-[1.1] mb-6">
            {title}
          </h1>
          <div className="w-[100px] h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent mb-6"></div>
          <p className="text-[#E9D9C2] max-w-xl text-[16px] leading-relaxed tracking-wide font-light">
            {subtitle}
          </p>
        </div>
      </div>

      {/* 2. Trust Strip Section */}
      {!hideTrustBadges && (
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 -mt-10 relative z-20 mb-12">
          <div className="bg-white rounded-[20px] shadow-[0_20px_40px_rgba(42,8,13,0.08)] border border-[#E9D9C2]/50 p-6 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-[#FFFDF8] flex items-center justify-center border border-[#D4AF37]/30 text-[#B58B22] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                    <badge.icon size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#2A2118] mb-0.5">{badge.title}</h4>
                    <p className="text-[11px] text-[#6E6256]">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
