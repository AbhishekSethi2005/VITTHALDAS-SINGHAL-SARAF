import { Gem, RefreshCw, Shield, Users } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Hallmark Certified',
    desc: 'BIS 916 Hallmark jewellery',
  },
  {
    icon: Gem,
    title: '100% Pure Gold',
    desc: 'Transparent pricing',
  },
  {
    icon: RefreshCw,
    title: 'Lifetime Exchange',
    desc: 'Full value exchange',
  },
  {
    icon: Users,
    title: 'Trusted Since 1965',
    desc: 'Serving generations',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-[#F5F5F5] pb-10">
      <div className="section-container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
          {badges.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center justify-center gap-4 rounded-[22px] border border-[#E2D8C7] bg-white px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#B58B22]/30 hover:shadow-xl"
            >

<<<<<<< Updated upstream
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
=======
              <Icon className="shrink-0 text-[#B58B22]" size={34} strokeWidth={1.5} />
              <div className='flex flex-col justify-center'>
                <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6E6256]">{desc}</p>
              </div>
            </div>
          ))}
>>>>>>> Stashed changes
        </div>
      </div>
    </section>
  );
}
