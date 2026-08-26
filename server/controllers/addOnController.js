import AddOn from '../models/AddOn.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const seedAddOns = async () => {
  const count = await AddOn.countDocuments();
  if (count > 0) return;

  const addOns = [
    // Flowers
    { name: 'Rose Bouquet Premium', category: 'Flowers', description: 'Fresh red rose bouquet with 50 stems, beautifully wrapped', image: 'https://images.pexels.com/photos/462289/pexels-photo-462289.jpeg?w=400&h=300&fit=crop', price: 2500, unit: 'per piece' },
    { name: 'Marigold Garland', category: 'Flowers', description: 'Traditional orange marigold garland for entrance and mandap', image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?w=400&h=300&fit=crop', price: 500, unit: 'per piece' },
    { name: 'Jasmine String', category: 'Flowers', description: 'Fragrant jasmine string for hair decoration and mandap', image: 'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?w=400&h=300&fit=crop', price: 300, unit: 'per piece' },
    { name: 'Orchid Centerpiece', category: 'Flowers', description: 'Elegant white orchid arrangement for table centerpieces', image: 'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?w=400&h=300&fit=crop', price: 1800, unit: 'per piece' },
    { name: 'Lotus Float Bowl', category: 'Flowers', description: 'Fresh lotus flowers floating in decorative brass bowls', image: 'https://images.pexels.com/photos/1393278/pexels-photo-1393278.jpeg?w=400&h=300&fit=crop', price: 800, unit: 'per piece' },
    { name: 'Tuberose Bundle', category: 'Flowers', description: 'Fragrant tuberose bundle for table and venue decoration', image: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?w=400&h=300&fit=crop', price: 400, unit: 'per piece' },

    // Food & Snacks
    { name: 'Welcome Drinks Package', category: 'Food & Snacks', description: 'Assorted welcome drinks - mango lassi, nimbu pani, jaljeera per person', image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?w=400&h=300&fit=crop', price: 150, unit: 'per person' },
    { name: 'Snack Counter - Veg', category: 'Food & Snacks', description: 'Samosa, pakora, dhokla, pani puri counter for 100 people', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400&h=300&fit=crop', price: 350, unit: 'per person' },
    { name: 'Chaat Stall', category: 'Food & Snacks', description: 'Complete chaat counter - bhel puri, sev puri, dahi puri, ragda', image: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?w=400&h=300&fit=crop', price: 200, unit: 'per person' },
    { name: 'Sweet Counter', category: 'Food & Snacks', description: 'Gulab jamun, rasgulla, jalebi, peda counter', image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?w=400&h=300&fit=crop', price: 250, unit: 'per person' },
    { name: 'Live Food Counter', category: 'Food & Snacks', description: 'Live dosa, pasta, or chat counter with chef', image: 'https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?w=400&h=300&fit=crop', price: 400, unit: 'per person' },
    { name: 'Cold Beverage Station', category: 'Food & Snacks', description: 'Soft drinks, juices, mocktails station', image: 'https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg?w=400&h=300&fit=crop', price: 120, unit: 'per person' },

    // Decor
    { name: 'Balloon Arch', category: 'Decor', description: 'Color-coordinated balloon arch for entrance', image: 'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg?w=400&h=300&fit=crop', price: 3000, unit: 'per piece' },
    { name: 'Fabric Draping', category: 'Decor', description: 'Elegant fabric draping in theme colors for ceiling and walls', image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=400&h=300&fit=crop', price: 8000, unit: 'flat rate' },
    { name: 'Flower Wall Backdrop', category: 'Decor', description: 'Beautiful flower wall for photo backdrop', image: 'https://images.pexels.com/photos/949919/pexels-photo-949919.jpeg?w=400&h=300&fit=crop', price: 15000, unit: 'flat rate' },
    { name: 'Table Runner Set', category: 'Decor', description: 'Set of 10 satin table runners with flower scatter', image: 'https://images.pexels.com/photos/105807/pexels-photo-105807.jpeg?w=400&h=300&fit=crop', price: 2000, unit: 'per set' },
    { name: 'Chair Sash Set', category: 'Decor', description: 'Set of 20 chair sashes with buckles', image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?w=400&h=300&fit=crop', price: 1500, unit: 'per set' },
    { name: 'Rangoli Setup', category: 'Decor', description: 'Traditional rangoli with flowers and colored powder', image: 'https://images.pexels.com/photos/6726362/pexels-photo-6726362.jpeg?w=400&h=300&fit=crop', price: 2500, unit: 'per piece' },

    // Return Gifts
    { name: 'Dry Fruit Box', category: 'Return Gifts', description: 'Premium dry fruit box with almonds, cashews, pistachios', image: 'https://images.pexels.com/photos/5718014/pexels-photo-5718014.jpeg?w=400&h=300&fit=crop', price: 500, unit: 'per piece' },
    { name: 'Silver Coin Gift', category: 'Return Gifts', description: '2gm silver coin in decorative box', image: 'https://images.pexels.com/photos/3665621/pexels-photo-3665621.jpeg?w=400&h=300&fit=crop', price: 800, unit: 'per piece' },
    { name: 'Customized Mug', category: 'Return Gifts', description: 'Photo printed personalized ceramic mug', image: 'https://images.pexels.com/photos/1566396/pexels-photo-1566396.jpeg?w=400&h=300&fit=crop', price: 250, unit: 'per piece' },
    { name: 'Scented Candle Set', category: 'Return Gifts', description: 'Set of 3 aromatic candles in gift box', image: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?w=400&h=300&fit=crop', price: 350, unit: 'per piece' },
    { name: 'Miniature Ganesha', category: 'Return Gifts', description: 'Brass Ganesha idol as return gift', image: 'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?w=400&h=300&fit=crop', price: 400, unit: 'per piece' },

    // Lighting
    { name: 'String Fairy Lights', category: 'Lighting', description: 'Warm white LED fairy lights 10m string', image: 'https://images.pexels.com/photos/1707556/pexels-photo-1707556.jpeg?w=400&h=300&fit=crop', price: 500, unit: 'per piece' },
    { name: 'LED Uplighter Set', category: 'Lighting', description: 'Set of 4 LED uplighters in color-changing', image: 'https://images.pexels.com/photos/2526120/pexels-photo-2526120.jpeg?w=400&h=300&fit=crop', price: 3000, unit: 'per set' },
    { name: 'Chandelier Rental', category: 'Lighting', description: 'Crystal chandelier rental for center area', image: 'https://images.pexels.com/photos/1114797/pexels-photo-1114797.jpeg?w=400&h=300&fit=crop', price: 5000, unit: 'per day' },
    { name: 'Spot Light', category: 'Lighting', description: 'Professional spotlight for stage or focal areas', image: 'https://images.pexels.com/photos/1676050/pexels-photo-1676050.jpeg?w=400&h=300&fit=crop', price: 1500, unit: 'per piece' },
    { name: 'Laser Light Show', category: 'Lighting', description: 'Multi-color laser light system with controller', image: 'https://images.pexels.com/photos/1749057/pexels-photo-1749057.jpeg?w=400&h=300&fit=crop', price: 4000, unit: 'per day' },

    // Furniture
    { name: 'Round Table (10 Seater)', category: 'Furniture', description: 'Premium round table with white linen', image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?w=400&h=300&fit=crop', price: 800, unit: 'per piece' },
    { name: 'Cocktail Table', category: 'Furniture', description: 'High cocktail table for standing arrangement', image: 'https://images.pexels.com/photos/2092907/pexels-photo-2092907.jpeg?w=400&h=300&fit=crop', price: 600, unit: 'per piece' },
    { name: 'Banquet Chair', category: 'Furniture', description: 'Gold banquet chair with cushion', image: 'https://images.pexels.com/photos/162927/wedding-g4da7819ca_1920.jpg?w=400&h=300&fit=crop', price: 200, unit: 'per piece' },
    { name: 'Sofa Set (3 Seater)', category: 'Furniture', description: 'Luxury velvet sofa for lounge area', image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?w=400&h=300&fit=crop', price: 3000, unit: 'per day' },
    { name: 'Stage Platform', category: 'Furniture', description: 'Modular stage platform 8x4 feet', image: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?w=400&h=300&fit=crop', price: 5000, unit: 'flat rate' },

    // Tableware
    { name: 'Gold Cutlery Set', category: 'Tableware', description: 'Premium gold-plated cutlery set per person', image: 'https://images.pexels.com/photos/6270039/pexels-photo-6270039.jpeg?w=400&h=300&fit=crop', price: 150, unit: 'per person' },
    { name: 'Champagne Flute Set', category: 'Tableware', description: 'Crystal champagne flutes set of 12', image: 'https://images.pexels.com/photos/948936/pexels-photo-948936.jpeg?w=400&h=300&fit=crop', price: 1200, unit: 'per set' },
    { name: 'Brass Thali Set', category: 'Tableware', description: 'Traditional brass thali with katori set', image: 'https://images.pexels.com/photos/6714064/pexels-photo-6714064.jpeg?w=400&h=300&fit=crop', price: 800, unit: 'per set' },
    { name: 'Napkin Ring Set', category: 'Tableware', description: 'Decorative napkin rings set of 20', image: 'https://images.pexels.com/photos/105807/pexels-photo-105807.jpeg?w=400&h=300&fit=crop', price: 600, unit: 'per set' },

    // Props
    { name: 'Photo Booth Props Kit', category: 'Props', description: 'Fun props - hats, glasses, signs, mustaches on sticks', image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?w=400&h=300&fit=crop', price: 1500, unit: 'per set' },
    { name: 'Welcome Sign Board', category: 'Props', description: 'Customized welcome sign with names and date', image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=400&h=300&fit=crop', price: 2000, unit: 'per piece' },
    { name: 'Confetti Cannon', category: 'Props', description: 'Biodegradable confetti cannon for grand entrance', image: 'https://images.pexels.com/photos/5765829/pexels-photo-5765829.jpeg?w=400&h=300&fit=crop', price: 300, unit: 'per piece' },
    { name: 'Sparkler Set', category: 'Props', description: 'Cold sparkler machine with 6 refills', image: 'https://images.pexels.com/photos/2526120/pexels-photo-2526120.jpeg?w=400&h=300&fit=crop', price: 3500, unit: 'per set' },
    { name: 'Name Board LED', category: 'Props', description: 'LED illuminated name board with custom text', image: 'https://images.pexels.com/photos/1707556/pexels-photo-1707556.jpeg?w=400&h=300&fit=crop', price: 2500, unit: 'per piece' },
  ];

  await AddOn.insertMany(addOns);
  console.log(`Seeded ${addOns.length} add-ons`);
};

export const getAddOns = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ];
    }

    const total = await AddOn.countDocuments(filter);
    const addOns = await AddOn.find(filter)
      .sort({ category: 1, name: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: addOns.length,
      total,
      addOns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAddOnCategories = async (req, res) => {
  try {
    const categories = await AddOn.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createAddOn = async (req, res) => {
  try {
    const addOn = await AddOn.create(req.body);
    res.status(201).json({ success: true, addOn });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateAddOn = async (req, res) => {
  try {
    const addOn = await AddOn.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!addOn) return res.status(404).json({ success: false, message: 'Add-on not found' });
    res.status(200).json({ success: true, addOn });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAddOn = async (req, res) => {
  try {
    const addOn = await AddOn.findByIdAndDelete(req.params.id);
    if (!addOn) return res.status(404).json({ success: false, message: 'Add-on not found' });
    res.status(200).json({ success: true, message: 'Add-on deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { seedAddOns };
