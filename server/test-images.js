import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const candidates = {
  // Lotus Float Bowl (need lotus flower)
  '37328683': 'lotus',
  '20215016': 'lotus',
  '17261739': 'lotus',
  
  // Flower Wall Backdrop (need floral backdrop)
  '29369787': 'floral backdrop',
  '31221954': 'floral wall',
  '36790408': 'wedding backdrop',
  
  // Table Runner Set (need table decor)
  '105807': 'table runner (old)',
  '2306281': 'banquet table',
  '1395967': 'round table',
  '1616113': 'fabric draping',
  
  // Silver Coin Gift (need silver/gift)
  '3665621': 'silver coin (old)',
  '5718014': 'dry fruit box',
  
  // Spot Light (need stage light)
  '1676050': 'spotlight (old)',
  '2526120': 'led light',
  
  // Banquet Chair (need chair)
  '162927': 'banquet chair (old)',
  '1395967': 'round table chair',
  
  // Brass Thali Set (need brass plate)
  '6714064': 'brass thali (old)',
  
  // Balloon Arch (need balloon)
  '5765827': 'balloon arch old',
  '33904644': 'balloon arch',
  '30144054': 'colorful balloons',
  
  // Chair Sash Set (need chair decor)
  '1395306': 'chair sash old',
  
  // Rangoli Setup (need rangoli)
  '6726362': 'rangoli old',
  
  // Orchid Centerpiece (need orchid)
  '1028225': 'orchid old',
  
  // Chandelier Rental (need chandelier)
  '1114797': 'chandelier old',
  
  // Miniature Ganesha (need ganesha)
  '6782567': 'ganesha old',
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
