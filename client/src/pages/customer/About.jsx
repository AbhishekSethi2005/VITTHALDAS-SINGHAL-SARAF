import { Helmet } from 'react-helmet-async';
import { ChevronRight, Shield, Award, Gem, Heart, Compass, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import LuxuryPageBanner from '../../components/common/LuxuryPageBanner';

export default function About() {
  return (
    <>
      <Helmet>
        <title>Our Story | Vitthaldas Singhal Saraf</title>
      </Helmet>

      <div className="bg-[#fdfaf6] min-h-screen pb-20 font-sans text-[#2A2118]">

        <LuxuryPageBanner
          title="Our Story"
          subtitle="Vitthaldas Singhal Saraf stands as a beacon of trust and purity in the world of fine jewellery. Since 1965, we have been more than just jewellers; we have been custodians of heritage."
          bgImage="https://static.vecteezy.com/system/resources/thumbnails/036/209/019/small/ai-generated-shiny-gold-jewelry-symbolizes-love-and-elegance-generated-by-ai-free-photo.jpg?auto=format&fit=crop&q=80&w=2000"
          breadcrumbs={[{ label: 'Our Story' }]}
        />

        {/* 2. Core Values Grid (3 Editorial Images) */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Image 1: Trust */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[20px]">
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800"
                alt="Trust"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a080d]/90 via-[#4a0e17]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                <Shield className="text-[#D4AF37] mx-auto mb-4" size={32} strokeWidth={1.5} />
                <h3 className="font-serif text-3xl text-white mb-2">Trust</h3>
                <p className="text-[#E9D9C2] text-sm font-light tracking-wide">A legacy built on unwavering faith.</p>
              </div>
            </div>
            {/* Image 2: Commitment */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[20px] md:translate-y-8">
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
                alt="Commitment"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a080d]/90 via-[#4a0e17]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                <Heart className="text-[#D4AF37] mx-auto mb-4" size={32} strokeWidth={1.5} />
                <h3 className="font-serif text-3xl text-white mb-2">Commitment</h3>
                <p className="text-[#E9D9C2] text-sm font-light tracking-wide">Dedicated to absolute perfection.</p>
              </div>
            </div>
            {/* Image 3: Purity */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[20px]">
              <img
                src="https://www.jaykrishnadiamond.com/cdn/shop/articles/Red-diamonds-scaled_f7d6d849-90fa-486c-acbe-a1c07b4812cd.jpg?v=1734170167?auto=format&fit=crop&q=80&w=800"
                alt="Purity"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a080d]/90 via-[#4a0e17]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                <Gem className="text-[#D4AF37] mx-auto mb-4" size={32} strokeWidth={1.5} />
                <h3 className="font-serif text-3xl text-white mb-2">Purity</h3>
                <p className="text-[#E9D9C2] text-sm font-light tracking-wide">100% Hallmarked gold standard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Mission & Vision (3 Columns) */}
        <div className="py-24 bg-[#FFFDF8] border-y border-[#E9D9C2]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 text-center">

            <div className="flex justify-center items-center gap-4 mb-16">
              <div className="w-[100px] h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
              <Compass className="text-[#B58B22]" size={24} strokeWidth={1.5} />
              <div className="w-[100px] h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#E9D9C2]">

              <div className="px-6 pt-10 md:pt-0">
                <h4 className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">Our Values</h4>
                <h3 className="font-serif text-3xl text-[#2A2118] mb-6">Integrity & Art</h3>
                <p className="text-[15px] leading-[1.8] text-[#6E6256] font-light">
                  To uphold the highest standards of integrity and transparency in every transaction,
                  while preserving the ancient Indian art of jewellery making through skilled craftsmanship.
                </p>
              </div>

              <div className="px-6 pt-10 md:pt-0">
                <h4 className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">Our Vision</h4>
                <h3 className="font-serif text-3xl text-[#2A2118] mb-6">Global Heritage</h3>
                <p className="text-[15px] leading-[1.8] text-[#6E6256] font-light">
                  To be the most trusted and preferred luxury jewellery brand globally,
                  renowned for carrying the legacy of authentic Indian heritage into the modern world.
                </p>
              </div>

              <div className="px-6 pt-10 md:pt-0">
                <h4 className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">Our Mission</h4>
                <h3 className="font-serif text-3xl text-[#2A2118] mb-6">Customer Delight</h3>
                <p className="text-[15px] leading-[1.8] text-[#6E6256] font-light">
                  To continuously innovate and design exquisite pieces that exceed expectations,
                  ensuring every customer experiences the royal elegance they truly deserve.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* 4. Legacy Quote (Burgundy Background) */}
        <div className="bg-gradient-to-br from-[#2a080d] via-[#4a0e17] to-[#30080F] py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#D4AF37_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Target className="text-[#D4AF37] mx-auto mb-8 opacity-80" size={48} strokeWidth={1} />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#D4AF37] font-medium leading-[1.3] mb-8 italic">
              "Jewellery is not merely an ornament; it is an emotion, a legacy, and a piece of history passed down through generations."
            </h2>
            <p className="text-[#E9D9C2] uppercase tracking-[0.3em] text-[11px] font-bold">
              — The Saraf Philosophy
            </p>
          </div>
        </div>

        {/* 5. Leadership / The Journey (Alternating rows) */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-24 space-y-24">

          {/* Row 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -inset-4 border border-[#E9D9C2] rounded-[24px] z-0"></div>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/042/626/487/small/ai-generated-elegant-jewelry-store-glimmering-with-high-end-business-luxury-photo.jpg?auto=format&fit=crop&q=80&w=800"
                alt="The Beginning"
                className="w-full aspect-square object-cover rounded-[20px] relative z-10 shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">THE INCEPTION (1965)</p>
              <h2 className="font-serif text-4xl text-[#2A2118] mb-6">Where Trust Began</h2>
              <p className="text-[16px] leading-[1.8] text-[#5c4f42] font-light mb-6">
                Established in 1965 in the heart of Sarafa Bazar, our foundational ideology was simple:
                to provide families with gold of the purest quality. What started as a modest endeavor
                quickly grew into a trusted institution.
              </p>
              <p className="text-[16px] leading-[1.8] text-[#5c4f42] font-light">
                Generations of families have placed their faith in our hallmark, knowing that every piece
                bears the seal of uncompromising authenticity.
              </p>
            </div>
          </div>

          {/* Row 2: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -inset-4 border border-[#E9D9C2] rounded-[24px] z-0"></div>
              <img
                src="https://img.freepik.com/premium-photo/jewelers-hands-crafting-gold-rings-closeup-gold-jewelry-craftsmanship_1268234-635.jpg?semt=ais_hybrid&w=740&q=80?auto=format&fit=crop&q=80&w=800"
                alt="Craftsmanship"
                className="w-full aspect-square object-cover rounded-[20px] relative z-10 shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">THE EVOLUTION</p>
              <h2 className="font-serif text-4xl text-[#2A2118] mb-6">A New Era of Craftsmanship</h2>
              <p className="text-[16px] leading-[1.8] text-[#5c4f42] font-light mb-6">
                As the decades passed, we embraced modern techniques without ever abandoning
                the traditional artistry of Indian karigars. Today, our expansive showrooms house
                everything from timeless Polki and Kundan to contemporary lightweight diamond jewellery.
              </p>
              <p className="text-[16px] leading-[1.8] text-[#5c4f42] font-light">
                Our relentless pursuit of perfection has garnered us prestigious accolades,
                but our greatest reward remains the generational loyalty of our customers.
              </p>
            </div>
          </div>

          {/* Row 3: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -inset-4 border border-[#E9D9C2] rounded-[24px] z-0"></div>
              <img
                src="https://img.freepik.com/premium-photo/closeup-jeweler-engraving-ring-displaying-expert-craftsmanship-jewelry-studio_661047-32864.jpg?semt=ais_hybrid&w=740&q=80?auto=format&fit=crop&q=80&w=800"
                alt="Future Vision"
                className="w-full aspect-[4/3] object-cover rounded-[20px] relative z-10 shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-[#B58B22] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">LOOKING AHEAD</p>
              <h2 className="font-serif text-4xl text-[#2A2118] mb-6">The Legacy Continues</h2>
              <p className="text-[16px] leading-[1.8] text-[#5c4f42] font-light mb-8">
                As we step into the future, we carry the weight and pride of our heritage.
                We continue to redefine luxury jewellery by blending our storied past with a vision for the modern bride.
                Become a part of our story and experience the elegance of true craftsmanship.
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 bg-[#4a0e17] text-white px-8 py-4 rounded-[8px] text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-[#2a080d] transition-colors"
              >
                Explore Collections <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
