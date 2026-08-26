import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const urls = [
  { name: 'Rose Bouquet Premium', url: 'https://images.pexels.com/photos/462289/pexels-photo-462289.jpeg?w=400' },
  { name: 'Marigold Garland', url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?w=400' },
  { name: 'Jasmine String', url: 'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?w=400' },
  { name: 'Orchid Centerpiece', url: 'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?w=400' },
  { name: 'Lotus Float Bowl', url: 'https://images.pexels.com/photos/1393278/pexels-photo-1393278.jpeg?w=400' },
  { name: 'Tuberose Bundle', url: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?w=400' },
  { name: 'Welcome Drinks', url: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?w=400' },
  { name: 'Snack Counter Veg', url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400' },
  { name: 'Chaat Stall', url: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?w=400' },
  { name: 'Sweet Counter', url: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?w=400' },
  { name: 'Live Food Counter', url: 'https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?w=400' },
  { name: 'Cold Beverage Station', url: 'https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg?w=400' },
  { name: 'Balloon Arch', url: 'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg?w=400' },
  { name: 'Fabric Draping', url: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=400' },
  { name: 'Flower Wall Backdrop', url: 'https://images.pexels.com/photos/949919/pexels-photo-949919.jpeg?w=400' },
  { name: 'Table Runner Set', url: 'https://images.pexels.com/photos/105807/pexels-photo-105807.jpeg?w=400' },
  { name: 'Chair Sash Set', url: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?w=400' },
  { name: 'Rangoli Setup', url: 'https://images.pexels.com/photos/6726362/pexels-photo-6726362.jpeg?w=400' },
  { name: 'Dry Fruit Box', url: 'https://images.pexels.com/photos/5718014/pexels-photo-5718014.jpeg?w=400' },
  { name: 'Silver Coin Gift', url: 'https://images.pexels.com/photos/3665621/pexels-photo-3665621.jpeg?w=400' },
  { name: 'Customized Mug', url: 'https://images.pexels.com/photos/1566396/pexels-photo-1566396.jpeg?w=400' },
  { name: 'Scented Candle Set', url: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?w=400' },
  { name: 'Miniature Ganesha', url: 'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?w=400' },
  { name: 'String Fairy Lights', url: 'https://images.pexels.com/photos/1707556/pexels-photo-1707556.jpeg?w=400' },
  { name: 'LED Uplighter Set', url: 'https://images.pexels.com/photos/2526120/pexels-photo-2526120.jpeg?w=400' },
  { name: 'Chandelier Rental', url: 'https://images.pexels.com/photos/1114797/pexels-photo-1114797.jpeg?w=400' },
  { name: 'Spot Light', url: 'https://images.pexels.com/photos/1676050/pexels-photo-1676050.jpeg?w=400' },
  { name: 'Laser Light Show', url: 'https://images.pexels.com/photos/1749057/pexels-photo-1749057.jpeg?w=400' },
  { name: 'Round Table', url: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?w=400' },
  { name: 'Cocktail Table', url: 'https://images.pexels.com/photos/2092907/pexels-photo-2092907.jpeg?w=400' },
  { name: 'Banquet Chair', url: 'https://images.pexels.com/photos/162927/pexels-photo-162927.jpeg?w=400' },
  { name: 'Sofa Set', url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?w=400' },
  { name: 'Stage Platform', url: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?w=400' },
  { name: 'Gold Cutlery Set', url: 'https://images.pexels.com/photos/6270039/pexels-photo-6270039.jpeg?w=400' },
  { name: 'Champagne Flute Set', url: 'https://images.pexels.com/photos/948936/pexels-photo-948936.jpeg?w=400' },
  { name: 'Brass Thali Set', url: 'https://images.pexels.com/photos/6714064/pexels-photo-6714064.jpeg?w=400' },
  { name: 'Napkin Ring Set', url: 'https://images.pexels.com/photos/105807/pexels-photo-105807.jpeg?w=400' },
  { name: 'Photo Booth Props', url: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?w=400' },
  { name: 'Welcome Sign Board', url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=400' },
  { name: 'Confetti Cannon', url: 'https://images.pexels.com/photos/5765829/pexels-photo-5765829.jpeg?w=400' },
  { name: 'Sparkler Set', url: 'https://images.pexels.com/photos/2526120/pexels-photo-2526120.jpeg?w=400' },
  { name: 'Name Board LED', url: 'https://images.pexels.com/photos/1707556/pexels-photo-1707556.jpeg?w=400' },
];

for (const item of urls) {
  try {
    const res = await fetch(item.url, { method: 'HEAD', redirect: 'follow' });
    const status = res.status;
    if (status !== 200) {
      console.log(`BROKEN [${status}]: ${item.name} => ${item.url}`);
    }
  } catch (e) {
    console.log(`ERROR: ${item.name} => ${e.message}`);
  }
}
console.log('Done checking.');
