const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Settings = require('./models/Settings');
const User = require('./models/User');
const Notification = require('./models/Notification');

const sampleCategories = [
  {
    name: 'Necklaces',
    description: 'Handcrafted exquisite luxury necklaces in gold, silver and diamond polki.',
    image: { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 1,
  },
  {
    name: 'Bangles',
    description: 'Traditional gold kadas, antique bangles and contemporary silver bracelets.',
    image: { url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 2,
  },
  {
    name: 'Bridal Sets',
    description: 'Complete cinematic wedding sets featuring uncut diamonds and royal gold heritage.',
    image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 3,
  },
  {
    name: 'Earrings',
    description: 'Intricate chandeliers, studs, jhumkas and heavy drop wedding earrings.',
    image: { url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 4,
  },
  {
    name: 'Rings',
    description: 'Timeless solitaire engagement rings, bridal cocktail rings and daily gold bands.',
    image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 5,
  },
  {
    name: 'Mangalsutra',
    description: 'Elegant daily wear mangalsutras and grand traditional royal wedding chains.',
    image: { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 6,
  },
  {
    name: 'Chains',
    description: 'Solid 22K gold chains, diamond-cut modern rope chains and silver unisex chains.',
    image: { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 7,
  },
  {
    name: 'Pendants',
    description: 'Stunning gold lockets, Ganesha divine pendants and elegant daily silver charms.',
    image: { url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad70e1?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 8,
  },
  {
    name: 'Coins & Bars',
    description: 'Certified 999 Purity 24K gold and 999 silver investment coins and bars.',
    image: { url: 'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8da?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 9,
  },
  {
    name: 'Anklets',
    description: 'Premium silver payals, bridal heavy anklets and delicate daily-wear chains.',
    image: { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
    sortOrder: 10,
  },
];

const sampleProducts = [
  {
    name: 'Heritage Kundan Bridal Choker Set',
    categoryName: 'Bridal Sets',
    description: 'Unveil your inner queen with our Heritage Kundan Bridal Set. Lovingly handcrafted with fine meenakari artwork, freshwater pearls, and pristine uncut polki gems set in heavy 22K hallmarked gold. Complete with matching jhumka earrings and ornate maang tikka.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 110.5,
    netWeight: 88.2,
    pricingType: 'dynamic',
    makingCharges: 14,
    makingChargeType: 'percentage',
    stoneCharges: 45000,
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', alt: 'Kundan Bridal Choker Set Front View' },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b1a1f90cbb?auto=format&fit=crop&q=80&w=1000', alt: 'Matching Kundan Earrings' }
    ],
    tags: ['bridal', 'kundan', 'polki', 'heavy', 'wedding', 'royal'],
    occasion: ['wedding'],
    gender: 'women',
    isFeatured: true,
  },
  {
    name: 'Royal Temple Laxmi Necklace',
    categoryName: 'Necklaces',
    description: 'Deeply spiritual and masterfully designed, our Laxmi Temple Necklace represents abundance and blessings. Crafted in 22K antique gold, this piece captures the essence of Gwalior royalty with its immaculate, micro-carved motifs.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 45.6,
    netWeight: 44.0,
    pricingType: 'dynamic',
    makingCharges: 850,
    makingChargeType: 'per_gram',
    images: [{ url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['necklace', 'temple', 'laxmi', 'antique', 'festive'],
    occasion: ['wedding', 'festive'],
    gender: 'women',
    isFeatured: true,
  },
  {
    name: 'Classic Filigree Gold Kadas (Pair)',
    categoryName: 'Bangles',
    description: 'A sophisticated pair of openable 22K gold kadas. Embellished with intricate hand-pulled gold filigree wires forming delicate floral arrangements. Features a robust screw lock with smooth inner comfort.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 36.0,
    netWeight: 35.5,
    pricingType: 'dynamic',
    makingCharges: 750,
    makingChargeType: 'per_gram',
    images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['bangles', 'kada', 'filigree', 'pair', 'handcrafted'],
    occasion: ['wedding', 'festive', 'daily-wear'],
    gender: 'women',
    variants: [
      { size: '2.4', grossWeight: 34.0, netWeight: 33.5, stock: 2 },
      { size: '2.6', grossWeight: 36.0, netWeight: 35.5, stock: 3 },
      { size: '2.8', grossWeight: 38.0, netWeight: 37.5, stock: 2 }
    ],
    isFeatured: false,
  },
  {
    name: 'Solitaire Diamond Promise Ring',
    categoryName: 'Rings',
    description: 'Say yes with our breath-taking 18K Gold Solitaire Ring. Accented by small round-cut pavé diamonds along the band, elevating a stunning 1-carat central lab-grown solitaire for maximum fire and brilliance.',
    metalType: 'gold',
    purity: '18K',
    grossWeight: 4.8,
    netWeight: 4.2,
    pricingType: 'fixed',
    fixedPrice: 89500,
    images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['ring', 'diamond', 'solitaire', 'engagement', 'premium'],
    occasion: ['engagement', 'gift'],
    gender: 'women',
    variants: [
      { size: '10', stock: 3 },
      { size: '12', stock: 5 },
      { size: '14', stock: 3 }
    ],
    isFeatured: true,
  },
  {
    name: 'Bridal Gold Chandbali Earrings',
    categoryName: 'Earrings',
    description: 'Step back in time with these classic Nizam royal chandbalis. Crafted with meticulous gold granulation, tiny ruby cabochons, and dangling seed pearls. They effortlessly blend old-world charm with contemporary weight optimization.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 18.5,
    netWeight: 17.0,
    pricingType: 'dynamic',
    makingCharges: 950,
    makingChargeType: 'per_gram',
    stoneCharges: 5500,
    images: [{ url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['chandbali', 'earrings', 'rubies', 'bridal', 'royal'],
    occasion: ['wedding', 'festive'],
    gender: 'women',
    isFeatured: true,
  },
  {
    name: 'Traditional Vati Mangalsutra Chain',
    categoryName: 'Mangalsutra',
    description: 'A sacred embodiment of holy matrimony. This traditional double-line black bead mangalsutra chain features two classic polished gold vatis joined by smooth hand-tied knots. Solid 22K purity.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 14.2,
    netWeight: 13.5,
    pricingType: 'dynamic',
    makingCharges: 600,
    makingChargeType: 'per_gram',
    images: [{ url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['mangalsutra', 'traditional', 'vati', 'sacred'],
    occasion: ['daily-wear', 'wedding'],
    gender: 'women',
    isFeatured: false,
  },
  {
    name: 'Diamond Cut Heavy Rope Chain',
    categoryName: 'Chains',
    description: 'A striking, light-reflecting 22K gold rope chain. Perfectly balanced for sturdy everyday wear by men, or as a statement layered piece. Hand-faceted diamond-cut edges offer unparallelled twinkle.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 28.0,
    netWeight: 28.0,
    pricingType: 'dynamic',
    makingCharges: 550,
    makingChargeType: 'per_gram',
    images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['chain', 'rope', 'men', 'heavy', 'solid'],
    occasion: ['daily-wear', 'office'],
    gender: 'men',
    isFeatured: false,
  },
  {
    name: 'Dancing Ganesha Divine Pendant',
    categoryName: 'Pendants',
    description: 'Invite prosperity and remover of obstacles. Beautifully molded 22K yellow gold Ganesha pendant featuring an intricate high-relief dancing pose, studded with a natural tiny emerald in the crown.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 6.5,
    netWeight: 6.3,
    pricingType: 'dynamic',
    makingCharges: 1200,
    makingChargeType: 'per_gram',
    stoneCharges: 1800,
    images: [{ url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad70e1?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['pendant', 'ganesha', 'divine', 'gold', 'emerald'],
    occasion: ['festive', 'gift', 'daily-wear'],
    gender: 'unisex',
    isFeatured: true,
  },
  {
    name: '24K Pure Gold Bar - 10 Grams',
    categoryName: 'Coins & Bars',
    description: 'Guaranteed highest purity. Individually sealed tamper-proof blister packaging containing 10 grams of absolute 999.9 Fine Gold Bar. Complete with NABL-accredited assay certification.',
    metalType: 'gold',
    purity: '24K',
    grossWeight: 10.0,
    netWeight: 10.0,
    pricingType: 'dynamic',
    makingCharges: 250,
    makingChargeType: 'flat',
    images: [{ url: 'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8da?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['gold-bar', 'investment', '24k', 'pure', 'coin'],
    occasion: ['festive', 'gift'],
    gender: 'unisex',
    isFeatured: true,
  },
  {
    name: 'Royal Ghungroo Silver Payal (Pair)',
    categoryName: 'Anklets',
    description: 'Pure 925 sterling silver traditional anklets adorned with micro-hanging hollow musical silver beads (ghungroos). Produces an enchanting, soft tinkling sound with every step you take.',
    metalType: 'silver',
    purity: '925',
    grossWeight: 52.0,
    netWeight: 50.5,
    pricingType: 'dynamic',
    makingCharges: 50,
    makingChargeType: 'per_gram',
    images: [{ url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['anklet', 'silver', 'payal', 'ghungroo', 'musical'],
    occasion: ['wedding', 'festive', 'daily-wear'],
    gender: 'women',
    isFeatured: false,
  },
];

async function seedAdmin() {
  console.log('\n👤 [Seeding] Initializing Default Administrator...');
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (!existingAdmin) {
    const adminUser = {
      name: 'VSS Admin Portal',
      email: 'admin@vssaraf.com',
      password: 'adminpassword123',
      phone: '9876543210',
      role: 'admin',
    };

    await User.create(adminUser);
    console.log('  ✅ SUCCESS: Default admin created!');
    console.log('  📧 Username:', adminUser.email);
    console.log('  🔑 Password: adminpassword123');
  } else {
    console.log('  ⏭️  Skipped: Administrator already exists in database.');
  }
}

async function seedSettingsAndRates() {
  console.log('\n📈 [Seeding] Seeding Global Business Settings & Metal Rates...');
  let settings = await Settings.findOne();

  const initialRates = {
    gold24K: 73500,
    gold22K: 67375,
    gold18K: 55125,
    silver999: 88500,
    silver925: 81860,
    platinum: 98400,
    lastUpdated: new Date(),
  };

  const prevRates = {
    gold24K: 72800,
    gold22K: 66700,
    gold18K: 54600,
    silver999: 87200,
    silver925: 80600,
    platinum: 97000,
  };

  const promoBanners = [
    {
      title: 'The Grand Royal Heritage',
      subtitle: 'Pure Cinematic Bridal Polki Designs Crafted Over Centuries of Trust.',
      image: { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1800' },
      link: '/shop?occasion=wedding',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Gilded Elegance Reimagined',
      subtitle: 'Premium Daily-Wear Solid Gold Pieces for the Modern Aesthetic.',
      image: { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1800' },
      link: '/shop?occasion=daily-wear',
      isActive: true,
      sortOrder: 2,
    }
  ];

  if (!settings) {
    settings = await Settings.create({
      metalRates: initialRates,
      previousRates: prevRates,
      gstRate: 3,
      freeShippingThreshold: 45000,
      shippingCharges: 350,
      businessInfo: {
        phone: '+91-7512345678',
        whatsapp: '+91-9876543210',
        email: 'info@vssaraf.com',
        address: 'Sarafa Bazar, Lashkar, Gwalior, Madhya Pradesh - 474001',
      },
      banners: promoBanners,
    });
    console.log('  ✅ SUCCESS: Settings initialized with metal rates and promo banners!');
  } else {
    settings.metalRates = initialRates;
    settings.previousRates = prevRates;
    if (!settings.banners || settings.banners.length === 0) {
      settings.banners = promoBanners;
    }
    await settings.save();
    console.log('  ✅ SUCCESS: Metal rates updated successfully.');
  }
}

async function seedNotifications() {
  console.log('\n🔔 [Seeding] Populating Global Customer System Announcements...');
  const count = await Notification.countDocuments({ type: 'system' });

  if (count === 0) {
    const notices = [
      {
        title: 'Akshaya Tritiya Premium Offer 🌸',
        message: 'Avail flat 25% Discount on Gold & Diamond jewellery Making Charges across all collections. Valid till 31st May!',
        type: 'system',
        link: '/shop',
      },
      {
        title: 'Gold Rates Corrected ✨',
        message: 'Market correction in 24K and 22K Pure Gold rates. Visit dashboard to view real-time billing charts.',
        type: 'price',
        link: '#',
      },
      {
        title: 'Bridal Couture Launch 2026',
        message: 'Discover the all-new Cinematic Kundan Heritage Bridal necklace sets now live in the catalogue.',
        type: 'product',
        link: '/shop?category=Bridal+Sets',
      }
    ];

    await Notification.insertMany(notices);
    console.log(`  ✅ SUCCESS: ${notices.length} system notifications broadcasted.`);
  } else {
    console.log('  ⏭️  Skipped: Global announcements already seeded.');
  }
}

async function seedDB() {
  const args = process.argv.slice(2);
  const flag = args[0] || '--all';

  try {
    console.log('\n💎 ==============================================');
    console.log('🔱   Vitthaldas Singhal Saraf - Database Seeder   🔱');
    console.log('💎 ==============================================\n');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found inside Server environment variables.');
    }

    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('🚀 CONNECTED: MongoDB Atlas database initialized.');

    // ─── SEED CATEGORIES ───
    let categoryMap = {};
    if (flag === '--all' || flag === '--categories') {
      console.log('\n📂 [Seeding] Creating Store Jewellery Categories...');
      const count = await Category.countDocuments();
      
      if (count === 0 || flag === '--categories') {
        if (flag === '--categories') await Category.deleteMany({});
        
        for (const item of sampleCategories) {
          const created = await Category.create(item);
          categoryMap[item.name] = created._id;
          console.log(`  📦 Added: ${item.name}`);
        }
        console.log(`  ✅ Seeding finished for ${sampleCategories.length} categories.`);
      } else {
        console.log('  ⏭️  Skipped: Categories collection contains active documents.');
      }
    }

    // Hydrate Category map from database if skipping category write
    const dbCats = await Category.find().lean();
    dbCats.forEach(c => { categoryMap[c.name] = c._id; });

    // ─── SEED PRODUCTS ───
    if (flag === '--all' || flag === '--products') {
      console.log('\n💍 [Seeding] Generating Luxury Jewellery Showroom Pieces...');
      const count = await Product.countDocuments();

      if (count === 0 || flag === '--products') {
        if (flag === '--products') await Product.deleteMany({});

        let inserted = 0;
        for (const raw of sampleProducts) {
          const catId = categoryMap[raw.categoryName];
          if (!catId) {
            console.warn(`  ⚠️ FAILED: Category "${raw.categoryName}" non-existent for ${raw.name}`);
            continue;
          }
          const { categoryName, ...payload } = raw;
          await Product.create({ ...payload, category: catId });
          console.log(`  ✨ Crafted: ${raw.name} (${raw.metalType.toUpperCase()})`);
          inserted++;
        }
        console.log(`  ✅ Showroom successfully packed with ${inserted} luxury products.`);
      } else {
        console.log('  ⏭️  Skipped: Product inventory already stocked.');
      }
    }

    // ─── SEED ADMIN ───
    if (flag === '--all' || flag === '--admin') {
      await seedAdmin();
    }

    // ─── SEED RATES & SETTINGS ───
    if (flag === '--all') {
      await seedSettingsAndRates();
      await seedNotifications();
    }

    console.log('\n👑 ==============================================');
    console.log('✅   DATABASE FULLY SYNCHRONIZED AND PREPARED   ✅');
    console.log('👑 ==============================================\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ FATAL EXCEPTION ENCOUNTERED DURING SEEDING:');
    console.error(error.stack || error.message);
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDB();
