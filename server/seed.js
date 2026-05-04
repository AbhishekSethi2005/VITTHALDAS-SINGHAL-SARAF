require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Settings = require('./models/Settings');

const categories = [
  { name: 'Necklaces', description: 'Gold and silver necklace designs' },
  { name: 'Bangles', description: 'Traditional and modern bangles' },
  { name: 'Earrings', description: 'Studs, drops, jhumkas & more' },
  { name: 'Rings', description: 'Engagement, daily wear & statement rings' },
  { name: 'Chains', description: 'Men and women chains' },
  { name: 'Bridal Sets', description: 'Complete bridal jewellery sets' },
  { name: 'Mangalsutra', description: 'Traditional mangalsutra designs' },
  { name: 'Pendants', description: 'Gold and diamond pendants' },
  { name: 'Coins & Bars', description: 'Gold and silver coins and bars' },
  { name: 'Anklets', description: 'Silver and gold anklets' },
];

const sampleProducts = [
  {
    name: 'Lakshmi Gold Necklace',
    description: 'A stunning traditional Lakshmi design necklace crafted in 22K gold. Features intricate temple-style motifs with a beautiful matte and glossy finish combination. Perfect for weddings and festive occasions.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 25.5,
    netWeight: 24.0,
    makingCharges: 800,
    makingChargeType: 'per_gram',
    stoneCharges: 0,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['wedding', 'festive'],
    isFeatured: true,
    tags: ['necklace', 'temple', 'traditional', 'bridal'],
    categoryName: 'Necklaces',
  },
  {
    name: 'Classic Gold Bangles Set (Pair)',
    description: 'Elegant pair of 22K gold bangles with traditional Indian craftsmanship. Features delicate filigree work with a comfortable smooth interior. Ideal for daily wear and special occasions.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 18.0,
    netWeight: 17.2,
    makingCharges: 650,
    makingChargeType: 'per_gram',
    stoneCharges: 0,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['daily-wear', 'festive'],
    isFeatured: true,
    tags: ['bangles', 'gold', 'pair', 'traditional'],
    categoryName: 'Bangles',
    variants: [
      { size: '2.4', grossWeight: 16, netWeight: 15.4, stock: 3 },
      { size: '2.6', grossWeight: 17, netWeight: 16.3, stock: 5 },
      { size: '2.8', grossWeight: 18, netWeight: 17.2, stock: 2 },
    ],
  },
  {
    name: 'Kundan Bridal Set',
    description: 'A magnificent bridal jewellery set featuring kundan work in 22K gold. Includes necklace, earrings, and maang tikka. Each piece features hand-set kundan stones with meenakari work on the reverse side.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 85.0,
    netWeight: 72.0,
    makingCharges: 12,
    makingChargeType: 'percentage',
    stoneCharges: 15000,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['wedding', 'engagement'],
    isFeatured: true,
    tags: ['bridal', 'kundan', 'set', 'wedding', 'premium'],
    categoryName: 'Bridal Sets',
  },
  {
    name: 'Diamond Cut Gold Chain',
    description: 'A sleek diamond-cut gold chain in 22K purity. The diamond-cut finish catches light beautifully, making it perfect for both casual and formal wear. Features a secure lobster clasp.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 12.0,
    netWeight: 11.5,
    makingCharges: 500,
    makingChargeType: 'per_gram',
    stoneCharges: 0,
    pricingType: 'dynamic',
    gender: 'men',
    occasion: ['daily-wear', 'gift'],
    isFeatured: true,
    tags: ['chain', 'men', 'diamond-cut', 'daily'],
    categoryName: 'Chains',
  },
  {
    name: 'Traditional Jhumka Earrings',
    description: 'Beautiful traditional jhumka earrings crafted in 22K gold with fine granulation work. The bell-shaped design features intricate detailing that showcases the artistry of Indian jewellery making.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 8.5,
    netWeight: 8.0,
    makingCharges: 900,
    makingChargeType: 'per_gram',
    stoneCharges: 0,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['wedding', 'festive', 'daily-wear'],
    isFeatured: true,
    tags: ['earrings', 'jhumka', 'traditional', 'gold'],
    categoryName: 'Earrings',
  },
  {
    name: 'Solitaire Gold Ring',
    description: 'A refined solitaire-style 18K gold ring with a single cubic zirconia stone. The minimalist modern design makes it perfect for engagements or daily wear. Available in multiple sizes.',
    metalType: 'gold',
    purity: '18K',
    grossWeight: 4.2,
    netWeight: 3.8,
    makingCharges: 1200,
    makingChargeType: 'per_gram',
    stoneCharges: 2500,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['engagement', 'daily-wear', 'gift'],
    isFeatured: true,
    tags: ['ring', 'solitaire', 'engagement', 'modern'],
    categoryName: 'Rings',
    variants: [
      { size: '6', grossWeight: 3.5, netWeight: 3.2, stock: 2 },
      { size: '7', grossWeight: 3.8, netWeight: 3.5, stock: 3 },
      { size: '8', grossWeight: 4.2, netWeight: 3.8, stock: 4 },
      { size: '9', grossWeight: 4.5, netWeight: 4.1, stock: 2 },
    ],
  },
  {
    name: 'Silver Payal (Anklet Pair)',
    description: 'Beautifully crafted 999 purity silver anklet pair with traditional ghungroo (bell) design. Features intricate chain link patterns with small silver bells that create a melodious sound.',
    metalType: 'silver',
    purity: '999',
    grossWeight: 65.0,
    netWeight: 62.0,
    makingCharges: 35,
    makingChargeType: 'per_gram',
    stoneCharges: 0,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['wedding', 'festive', 'daily-wear'],
    isFeatured: true,
    tags: ['silver', 'anklet', 'payal', 'traditional'],
    categoryName: 'Anklets',
  },
  {
    name: 'Gold Mangalsutra',
    description: 'A sacred mangalsutra in 22K gold with black bead chain. Traditional vati pendant design with modern finishing. Symbol of marital bond crafted with utmost care and devotion.',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 14.0,
    netWeight: 12.5,
    makingCharges: 700,
    makingChargeType: 'per_gram',
    stoneCharges: 0,
    pricingType: 'dynamic',
    gender: 'women',
    occasion: ['wedding', 'daily-wear'],
    isFeatured: true,
    tags: ['mangalsutra', 'bridal', 'traditional', 'sacred'],
    categoryName: 'Mangalsutra',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Seed settings (if not exists)
    await Settings.getSettings();
    console.log('✅ Settings initialized');

    // Seed categories
    const existingCats = await Category.countDocuments();
    let categoryMap = {};

    if (existingCats === 0) {
      for (const cat of categories) {
        const created = await Category.create(cat);
        categoryMap[cat.name] = created._id;
        console.log(`  ✅ Category: ${cat.name}`);
      }
      console.log(`✅ ${categories.length} categories seeded`);
    } else {
      console.log(`⏭️  Categories already exist (${existingCats}), skipping...`);
      const allCats = await Category.find().lean();
      allCats.forEach(c => { categoryMap[c.name] = c._id; });
    }

    // Seed products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      for (const prod of sampleProducts) {
        const { categoryName, ...productData } = prod;
        const catId = categoryMap[categoryName];
        if (!catId) {
          console.log(`  ⚠️ Category "${categoryName}" not found, skipping ${prod.name}`);
          continue;
        }
        await Product.create({ ...productData, category: catId });
        console.log(`  ✅ Product: ${prod.name}`);
      }
      console.log(`✅ ${sampleProducts.length} products seeded`);
    } else {
      console.log(`⏭️  Products already exist (${existingProducts}), skipping...`);
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
