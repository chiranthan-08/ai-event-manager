import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Need replacements for these broken add-on images:
// 1. Balloon Arch (5765827 shows eye scan) → candidate: 33904644
// 2. Flower Wall Backdrop (949919 404) → candidate: 29369787
// 3. Table Runner Set (105807 404) → candidate: 17001744
// 4. Chair Sash Set (1395306 shows jewelry) → need chair sash
// 5. Rangoli Setup (6726362 shows cityscape) → candidate: 37791040
// 6. Lotus Float Bowl (1393278 404) → candidate: 37328683
// 7. Orchid Centerpiece (1028225 shows mountain house) → candidate: 30349393
// 8. Chandelier Rental (1114797 shows orange) → candidate: 16043728
// 9. Spot Light (1676050 404) → need spotlight
// 10. Silver Coin Gift (3665621 404) → need silver/gift
// 11. Banquet Chair (162927 404) → need banquet chair
// 12. Brass Thali Set (6714064 404) → need brass thali
// 13. Miniature Ganesha (6782567 shows bedroom) → need ganesha

const candidates = {
  // Chair sash / chair decoration
  '1246437': 'chair sash?',
  '33753145': 'spotlight concert',
  '6044266': 'chair decor?',
  '169193': 'chair sash',
  '3052361': 'chair',
  '2440471': 'chair decoration',
  
  // Spotlight / stage light
  '2608517': 'concert stage',
  '3184291': 'conference stage',
  
  // Silver coin / gift box
  '3665621': 'silver coin old 404',
  '1038002': 'gift box',
  '3641370': 'gift',
  '587741': 'silver coin',
  '1261426': 'silver',
  '3641056': 'gift box',
  
  // Banquet chair
  '1395967': 'round table with chairs',
  '2306281': 'banquet table',
  '1648776': 'chair',
  '2462015': 'gold chair',
  '3585798': 'banquet chair',
  
  // Brass thali
  '6714064': 'thali old 404',
  '5560033': 'brass plate',
  '6270039': 'gold cutlery',
  '4491135': 'thali',
  '6044228': 'indian food plate',
  
  // Ganesha idol
  '6782567': 'ganesha old wrong',
  '6782976': 'ganesha?',
  '3832027': 'ganesha',
  '5530641': 'ganesha idol',
  '4491135': 'ganesha',
};

for (const [id, label] of Object.entries(candidates)) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=400&h=300&fit=crop`;
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    console.log(`[${res.status}] ${id} => ${label}`);
  } catch (e) {
    console.log(`[ERROR] ${id} => ${label}: ${e.message}`);
  }
}
console.log('Done.');
