const decorationTemplates = {
  wedding: [
    { type: 'Floral Arch', description: 'Elegant white and blush pink floral arch with cascading roses, peonies, and greenery', estimatedCost: 15000, image: 'floral-arch' },
    { type: 'Centerpieces', description: 'Crystal vases with white roses, baby breath, and floating candles', estimatedCost: 3000, image: 'centerpieces' },
    { type: 'Fairy Light Canopy', description: 'Warm white fairy lights draped across the ceiling creating a starry atmosphere', estimatedCost: 8000, image: 'fairy-lights' },
    { type: 'Table Runners', description: 'Satin ivory table runners with scattered rose petals and gold accents', estimatedCost: 2000, image: 'table-runners' },
  ],
  birthday: [
    { type: 'Balloon Wall', description: 'Color-coordinated balloon wall with metallic accents and birthday message banner', estimatedCost: 5000, image: 'balloon-wall' },
    { type: 'Photo Booth', description: 'Themed photo booth with fun props, backdrop, and instant camera station', estimatedCost: 7000, image: 'photo-booth' },
    { type: 'Cake Display', description: 'Illuminated cake stand with decorative base and themed cake topper', estimatedCost: 3000, image: 'cake-display' },
    { type: 'Streamers & Banners', description: 'Hanging streamers, personalized banner, and confetti decorations', estimatedCost: 2000, image: 'streamers' },
  ],
  corporate: [
    { type: 'Branded Backdrop', description: 'Custom branded backdrop with company logo and professional lighting', estimatedCost: 12000, image: 'branded-backdrop' },
    { type: 'Stage Setup', description: 'Professional stage with podium, branded panels, and accent lighting', estimatedCost: 25000, image: 'stage-setup' },
    { type: 'Registration Desk', description: 'Elegant registration desk with digital check-in display and welcome signage', estimatedCost: 6000, image: 'reg-desk' },
    { type: 'Aisle Markers', description: 'Branded aisle markers and directional signage throughout the venue', estimatedCost: 4000, image: 'aisle-markers' },
  ],
  concert: [
    { type: 'Lighting Rig', description: 'Professional concert lighting rig with moving heads and LED par cans', estimatedCost: 50000, image: 'lighting-rig' },
    { type: 'Stage Design', description: 'Custom stage design with LED panels, pyrotechnic mounts, and artist branding', estimatedCost: 80000, image: 'stage-design' },
    { type: 'Sound Barriers', description: 'Decorative sound barriers with integrated LED strips and band logos', estimatedCost: 15000, image: 'sound-barriers' },
    { type: 'VIP Section', description: 'VIP area with premium seating, exclusive lighting, and branded elements', estimatedCost: 20000, image: 'vip-section' },
  ],
  festival: [
    { type: 'Entrance Gate', description: 'Grand entrance gate with themed decorations, lights, and welcome signage', estimatedCost: 30000, image: 'entrance-gate' },
    { type: 'Food Court Setup', description: 'Themed food court with decorative canopies, seating, and ambient lighting', estimatedCost: 20000, image: 'food-court' },
    { type: 'Art Installations', description: 'Interactive art installations and photo-worthy decorative elements', estimatedCost: 25000, image: 'art-installations' },
    { type: 'Pathway Decor', description: 'Decorated pathways with lanterns, flags, and directional markers', estimatedCost: 10000, image: 'pathway-decor' },
  ],
  seminar: [
    { type: 'Welcome Banner', description: 'Professional welcome banner with event theme and sponsor logos', estimatedCost: 3000, image: 'welcome-banner' },
    { type: 'Podium Setup', description: 'Branded podium with microphone stand and floral arrangement', estimatedCost: 5000, image: 'podium-setup' },
    { type: 'Seating Arrangement', description: 'Theater-style seating with reserved sections and clear signage', estimatedCost: 8000, image: 'seating-arrangement' },
    { type: 'Display Boards', description: 'Information display boards, schedule boards, and sponsor displays', estimatedCost: 4000, image: 'display-boards' },
  ],
};

const venueSuggestions = {
  low: [
    { name: 'Community Hall', capacity: '50-200', estimatedCost: '15000-30000', features: 'Basic amenities, parking, kitchen access' },
    { name: 'Outdoor Garden', capacity: '30-150', estimatedCost: '10000-25000', features: 'Natural setting, open air, photo opportunities' },
    { name: 'Restaurant Private Room', capacity: '20-80', estimatedCost: '20000-40000', features: 'Catering included, intimate setting, service staff' },
  ],
  medium: [
    { name: 'Banquet Hall', capacity: '100-500', estimatedCost: '50000-100000', features: 'Full facilities, AC, sound system, parking' },
    { name: 'Hotel Conference Room', capacity: '50-300', estimatedCost: '60000-120000', features: 'Professional setup, AV equipment, catering options' },
    { name: 'Rooftop Venue', capacity: '50-200', estimatedCost: '40000-80000', features: 'Scenic views, open sky, unique ambiance' },
  ],
  high: [
    { name: 'Luxury Resort', capacity: '100-1000', estimatedCost: '150000-500000', features: 'Premium amenities, multiple halls, accommodation, catering' },
    { name: 'Heritage Property', capacity: '100-500', estimatedCost: '200000-400000', features: 'Unique architecture, premium experience, photography spots' },
    { name: 'Convention Center', capacity: '200-2000', estimatedCost: '300000-800000', features: 'Large capacity, professional infrastructure, multiple zones' },
  ],
};

const themeSuggestions = {
  wedding: ['Royal Palace', 'Garden Romance', 'Vintage Elegance', 'Beach Paradise', 'Rustic Charm', 'Modern Minimalist'],
  birthday: ['Superhero Adventure', 'Princess Wonderland', 'Hollywood Glam', 'Retro Arcade', 'Tropical Luau', 'Winter Wonderland'],
  corporate: ['Professional Innovation', 'Tech Forward', 'Sustainable Future', 'Global Connectivity', 'Leadership Summit'],
  concert: ['Neon Nights', 'Rock Legend', 'Electronic Dreams', 'Acoustic Sessions', 'Cultural Fusion'],
  festival: ['Cultural Heritage', 'Food & Music', 'Art & Craft', 'Seasonal Celebration', 'Community Spirit'],
  seminar: ['Knowledge Hub', 'Industry Leaders', 'Future Trends', 'Professional Growth', 'Innovation Forum'],
};

const planningChecklist = {
  wedding: ['Book venue (6-12 months prior)', 'Hire wedding planner', 'Select theme and colors', 'Book photographer/videographer', 'Arrange catering', 'Order invitations', 'Book entertainment', 'Arrange transportation', 'Plan ceremony flow', 'Coordinate rehearsal dinner'],
  birthday: ['Set budget', 'Choose theme', 'Book venue', 'Plan menu', 'Order cake', 'Send invitations', 'Arrange entertainment', 'Plan activities', 'Set up decorations', 'Prepare party favors'],
  corporate: ['Define objectives', 'Set budget', 'Book venue', 'Arrange speakers', 'Plan logistics', 'Set up AV equipment', 'Prepare materials', 'Coordinate catering', 'Plan networking sessions', 'Arrange follow-up'],
  concert: ['Book artist/band', 'Secure venue', 'Arrange sound system', 'Plan lighting', 'Set up ticketing', 'Coordinate security', 'Arrange merchandise', 'Plan VIP experience', 'Set up recording', 'Coordinate media'],
  festival: ['Secure permits', 'Book vendors', 'Arrange stages', 'Plan activities', 'Set up security', 'Coordinate volunteers', 'Arrange waste management', 'Plan parking', 'Set up first aid', 'Coordinate marketing'],
  seminar: ['Select speakers', 'Book venue', 'Plan agenda', 'Set up registration', 'Arrange AV', 'Prepare materials', 'Plan breaks', 'Coordinate catering', 'Set up networking', 'Plan follow-up'],
};

const generateDecorations = (type, guests, budget, theme) => {
  const category = decorationTemplates[type] || decorationTemplates.corporate;
  const budgetMultiplier = budget > 500000 ? 1.5 : budget > 200000 ? 1.2 : 1;

  return category.map((decoration) => ({
    ...decoration,
    estimatedCost: Math.round(decoration.estimatedCost * budgetMultiplier),
    suitability: guests > 200 ? 'High' : guests > 100 ? 'Medium' : 'High',
    customNote: theme
      ? `Can be customized with "${theme}" theme elements`
      : 'Standard setup with customization options available',
  }));
};

const generateVenues = (guests, budget) => {
  let tier = 'medium';
  if (budget < 100000) tier = 'low';
  else if (budget > 300000) tier = 'high';

  return venueSuggestions[tier].map((venue) => ({
    ...venue,
    fitsGuests: true,
    recommendation: guests <= parseInt(venue.capacity.split('-')[0]) + 50 ? 'Recommended' : 'Consider',
  }));
};

export const getEventSuggestions = async (req, res) => {
  try {
    const { type, guests, budget, theme, location } = req.body;

    if (!type || !guests || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide event type, guest count, and budget',
      });
    }

    const normalizedType = type.toLowerCase();
    const decorations = generateDecorations(normalizedType, guests, budget, theme);
    const venues = generateVenues(guests, budget);
    const themes = themeSuggestions[normalizedType] || themeSuggestions.corporate;
    const checklist = planningChecklist[normalizedType] || planningChecklist.corporate;

    const totalDecorationCost = decorations.reduce((sum, d) => sum + d.estimatedCost, 0);
    const remainingBudget = budget - totalDecorationCost;

    const suggestions = {
      eventType: type,
      guestCount: guests,
      budget: {
        total: budget,
        decorationEstimate: totalDecorationCost,
        remaining: remainingBudget,
      },
      decorations,
      venues,
      themes,
      planningChecklist: checklist,
      tips: [
        `For ${guests} guests, consider venues with ${Math.ceil(guests * 1.2)} capacity for comfortable spacing`,
        `Allocate approximately ${Math.round(budget * 0.4)} for venue and ${Math.round(budget * 0.3)} for catering`,
        `Book vendors at least ${guests > 200 ? '3-6' : '1-3'} months in advance`,
        location ? `In ${location}, consider local weather patterns when planning outdoor elements` : 'Consider weather contingencies for outdoor venues',
      ],
    };

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    const apiKey = process.env.XAI_API_KEY;

    const systemMessage = {
      role: 'system',
      content: `You are an AI Event Planning Assistant for "AI Event Manager", an Indian event management company. You help users plan weddings, birthdays, corporate events, festivals, and more.

Key details about the company:
- We offer full-service event planning across India
- Packages range from budget (Rs 50,000) to royal (Rs 15,00,000+)
- We cover all major Indian cities: Bangalore, Mumbai, Delhi, Hyderabad, Pune, Goa, Jaipur, Udaipur, Chennai
- Services include: venue booking, decorations, catering, photography, entertainment, guest management
- Popular themes: Royal Rajasthani, Garden Paradise, Glamorous Night, Boho Chic, Mughal Heritage

Always respond in a helpful, friendly manner. Use Indian Rupees (Rs/₹) for pricing. Suggest specific venues, themes, and packages when relevant. Keep responses concise but informative. Format with line breaks for readability.`
    };

    const apiMessages = [systemMessage, ...messages.map(m => ({
      role: m.role,
      content: m.content
    }))];

    if (apiKey && apiKey.startsWith('xai-')) {
      try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'grok-3-mini-latest',
            messages: apiMessages,
            max_tokens: 1024,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return res.status(200).json({ success: true, reply });
          }
        }
        console.error('xAI API error:', response.status, await response.text());
      } catch (apiError) {
        console.error('xAI API call failed:', apiError.message);
      }
    }

    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
    const reply = generateLocalResponse(lastUserMsg);
    res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error('Chat AI error:', error.message);
    res.status(500).json({ success: false, message: 'AI service error' });
  }
};

function generateLocalResponse(input) {
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|namaskar)/i.test(input)) {
    return pick([
      "Hello! Welcome to AI Event Manager. I can help you plan weddings, birthdays, corporate events, and festivals. What are you celebrating?",
      "Namaste! I'm your AI Event Assistant powered by Grok. What event are you planning today?",
      "Hey there! Tell me what you have in mind - whether it's a wedding, birthday party, corporate event, or festival celebration!"
    ]);
  }

  if (input.length <= 3) {
    return pick([
      "Hello! How can I help you plan your event? Ask about venues, decorations, themes, or pricing!",
      "Hi there! Tell me about the event you're planning - wedding, birthday, corporate, or festival?",
      "Hey! I can help with venues, decorations, themes, pricing, and more. What do you need?"
    ]);
  }

  if (/thank|thanks|thx|appreciate/i.test(input)) {
    return pick([
      "You're most welcome! I'm glad I could help. Feel free to ask anytime!",
      "Happy to help! I'm here 24/7 for all your event planning needs.",
      "My pleasure! Let me know if you'd like to dive deeper into any aspect!"
    ]);
  }

  if (/contact|phone|call|book|appointment|visit|address/i.test(input)) {
    return "You can reach us through:\n\nPhone: +91 98765 43210\nEmail: events@aievent.com\nOffice: 123 Event Plaza, MG Road, Bangalore\n\nWorking Hours:\n  Mon-Sat: 10 AM - 8 PM\n  Sun: 11 AM - 6 PM\n\nWhatsApp: +91 98765 43210\n  Send us your event details for instant quotes!";
  }

  if (/festival|diwali|holi|ganesh|onam|navratri|krishna|ugadi|pongal/i.test(input)) {
    return "Festival Celebration Services:\n\nDiwali - Rs 50,000+\n  Rangoli, diyas, lighting, cultural performances\n\nHoli - Rs 40,000+\n  Organic colors, DJ, water games, food stalls\n\nGanesh Chaturthi - Rs 60,000+\n  Idol setup, aarti, decoration, procession\n\nNavratri/Garba - Rs 75,000+\n  Stage, dhol, lighting, cultural troupe\n\nWe Provide: Decoration, Sound, Cultural performances, Food stalls\n\nWhich festival are you celebrating?";
  }

  if (/wedding|shaadi|marriage|vivah|bride|groom|baraat/i.test(input)) {
    return "Wedding Planning Packages:\n\nIntimate Wedding (50-100 guests) - Rs 3,00,000+\n  Garden mandap, floral decor, basic lighting\n\nClassic Wedding (200-500 guests) - Rs 8,00,000+\n  Grand mandap, premium flowers, LED wall, DJ\n\nRoyal Wedding (500-2000 guests) - Rs 25,00,000+\n  Palace venue, chandeliers, live band, celebrity performances\n\nDestination Wedding (100-500 guests) - Rs 15,00,000+\n  Goa, Udaipur, Jaipur, Kerala venues + full planning\n\nWhat's Included:\n  Venue booking, Mandap setup, Floral arrangements\n  Lighting, Photography, Catering, Guest management\n\nTell me your guest count and budget!";
  }

  if (/birthday|bday|cake/i.test(input)) {
    return "Birthday Party Packages:\n\nKids Party (20-50 guests) - Rs 25,000+\n  Balloon decor, theme setup, game coordinator\n\nTeen Party (30-80 guests) - Rs 50,000+\n  Neon theme, DJ, photo booth, LED dance floor\n\nMilestone Birthday (50-200 guests) - Rs 1,50,000+\n  Premium decor, live band, custom cake\n\nLuxury Bash (100-500 guests) - Rs 5,00,000+\n  Celebrity appearance, grand venue, full entertainment\n\nPopular Themes: Superhero, Rainbow, Carnival, Music Night, Floral Garden\n\nWhat age group and how many guests?";
  }

  if (/corporate|company|office|annual|conference|seminar|workshop|team/i.test(input)) {
    return "Corporate Event Solutions:\n\nAnnual Day Celebration - Rs 2,00,000+\n  Stage setup, LED screens, anchor, performances\n\nProduct Launch - Rs 3,00,000+\n  Grand reveal setup, media coverage, branding\n\nConference/Seminar - Rs 1,50,000+\n  Auditorium setup, AV equipment, live streaming\n\nTeam Building Event - Rs 1,00,000+\n  Outdoor venues, activities, games, BBQ\n\nAward Night - Rs 5,00,000+\n  Red carpet, trophy, entertainment, gala dinner\n\nWhat type of corporate event are you planning?";
  }

  if (/venue|place|location|banquet|hall|resort|hotel|farmhouse|palace/i.test(input)) {
    return "Here are our top venue categories:\n\nBanquet Halls - 100-1000 guests\n  Grand Palace, Jaipur - Rs 2,50,000/day\n  Leela Palace, Bangalore - Rs 5,00,000/day\n\nOutdoor Venues - Gardens & Farmhouses\n  The Fern Resort, Goa - Rs 3,00,000/day\n  Farmhouse, Bangalore - Rs 1,50,000/day\n\nHeritage Properties\n  Umaid Bhawan, Jodhpur - Rs 15,00,000/day\n  Rambagh Palace, Jaipur - Rs 12,00,000/day\n\nBeach Venues\n  Grand Hyatt, Goa - Rs 8,00,000/day\n\nWould you like details about any specific venue type?";
  }

  if (/decor|decoration|stage|flower|light|mandap|rangoli|diya/i.test(input)) {
    return "Here are our decoration packages:\n\nPremium Floral - Rs 50,000 to 2,00,000\n  Fresh flowers, centerpieces, arch decorations\n\nRoyal Chandelier - Rs 1,00,000 to 3,00,000\n  Crystal chandeliers, golden drapes, luxury lighting\n\nTraditional Indian - Rs 30,000 to 1,50,000\n  Rangoli, diyas, marigold garlands, mandap decor\n\nGarden Theme - Rs 40,000 to 1,80,000\n  Floral canopy, fairy lights, green backdrop\n\nLuxury LED - Rs 80,000 to 2,50,000\n  LED walls, laser lights, fog machine, dance floor\n\nWhich style appeals to you?";
  }

  if (/theme|style|concept|idea|vibe|aesthetic/i.test(input)) {
    return "Popular event themes:\n\nRoyal Rajasthani - Gold, Maroon, Deep Red\n  Palace decor, elephant motifs, mirror work\n\nGarden Paradise - Green, White, Pastels\n  Floral canopy, fairy lights, wooden accents\n\nGlamorous Night - Black, Gold, Silver\n  Chandeliers, sequins, LED accents\n\nBoho Chic - Earth tones, terracotta, sage\n  Macrame, pampas grass, rattan\n\nMughal Heritage - Royal Blue, Gold, Cream\n  Arches, jali work, mirror mosaic\n\nWhich theme resonates with your vision?";
  }

  if (/price|cost|budget|how\s*much|rate|tariff/i.test(input)) {
    return "Our event packages start from:\n\nBudget Friendly - Rs 50,000 to 1,50,000\n  Basic decor, standard setup, 50-100 guests\n\nPremium Range - Rs 2,00,000 to 5,00,000\n  Premium decor, professional lighting, 200-500 guests\n\nLuxury Range - Rs 5,00,000 to 15,00,000\n  Complete makeover, celebrity arrangements, 500-2000 guests\n\nRoyal Range - Rs 15,00,000+\n  Palatial setups, international artists, 2000+ guests\n\nTell me your event type and guest count for a detailed breakdown!";
  }

  return pick([
    "I can help you with event planning! Try asking about:\n\n  Venues - Best places for your event\n  Decorations - Theme ideas and costs\n  Pricing - Budget-friendly packages\n  Weddings, Birthdays, Corporate events\n  Festival celebrations\n\nWhat would you like to know?",
    "I'm your AI Event Assistant! I can help with:\n\n  Event planning (weddings, birthdays, corporate)\n  Venue suggestions and pricing\n  Decoration ideas and themes\n  Budget planning\n\nJust tell me: What event are you planning?",
    "Let me help you plan your event! Tell me:\n\n1. What type of event?\n2. How many guests?\n3. What's your budget?\n\nWith these details, I can create a perfect plan!"
  ]);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const visualizeEvent = async (req, res) => {
  try {
    const { type, guests, budget, theme, venue, date } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, message: 'Please provide event type' });
    }

    const normalizedType = type.toLowerCase();
    const primaryColors = {
      wedding: { primary: '#D4A574', secondary: '#F5E6D3', accent: '#8B7355' },
      birthday: { primary: '#FF6B6B', secondary: '#FFE66D', accent: '#4ECDC4' },
      corporate: { primary: '#2C3E50', secondary: '#3498DB', accent: '#E74C3C' },
      concert: { primary: '#8E44AD', secondary: '#E91E63', accent: '#00BCD4' },
      festival: { primary: '#FF9800', secondary: '#4CAF50', accent: '#F44336' },
      seminar: { primary: '#34495E', secondary: '#1ABC9C', accent: '#9B59B6' },
    };

    const colors = primaryColors[normalizedType] || primaryColors.corporate;

    const sceneDescription = `
=== ${type.toUpperCase()} EVENT VISUALIZATION ===

VENUE: ${venue || 'Grand Hall'} (${guests || 100} guests capacity)

ENTRANCE:
- Grand ${normalizedType} entrance with ${theme || 'elegant'} themed decorations
- Welcome signage with event branding
- Red carpet walkway with ambient lighting

MAIN AREA:
- ${normalizedType === 'wedding' ? 'Aisle with floral arrangements on both sides' : 'Stage/podium area with professional backdrop'}
- ${guests > 200 ? 'Multi-level seating arrangement' : 'Intimate seating layout'} with clear sightlines
- Overhead ${normalizedType === 'concert' ? 'concert lighting rig' : 'ambient chandeliers and fairy lights'}

COLOR PALETTE:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}  
- Accent: ${colors.accent}

DÉCOR ELEMENTS:
- ${normalizedType === 'wedding' ? 'Floral centerpieces with candles' : normalizedType === 'birthday' ? 'Themed balloon installations' : normalizedType === 'corporate' ? 'Branded displays and banners' : 'Stage and lighting design'}
- Table settings with coordinated linens
- ${budget > 200000 ? 'Premium crystal and metallic accents' : 'Stylish yet cost-effective decorations'}

LIGHTING:
- ${normalizedType === 'concert' ? 'Dynamic concert lighting with moving heads' : 'Warm ambient lighting with spotlight accents'}
- ${normalizedType === 'wedding' ? 'Soft romantic glow with string lights' : 'Professional event lighting'}

PHOTO ZONES:
- Main backdrop with event branding
- ${normalizedType === 'wedding' ? 'Romantic corner with floral arch' : 'Fun photo booth area with props'}

OVERALL ATMOSPHERE:
A ${theme || 'beautifully'} curated ${type} experience for ${guests || 100} guests, featuring ${colors.primary} and ${colors.secondary} tones creating a ${normalizedType === 'corporate' ? 'professional yet inviting' : 'warm and celebratory'} ambiance.
    `.trim();

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="stageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.6" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="500" fill="url(#bgGrad)" rx="10"/>
  
  <!-- Venue outline -->
  <rect x="50" y="80" width="700" height="350" fill="none" stroke="${colors.accent}" stroke-width="2" stroke-dasharray="5,5" rx="5"/>
  
  <!-- Stage area -->
  <rect x="250" y="100" width="300" height="100" fill="url(#stageGrad)" rx="5"/>
  <text x="400" y="155" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${type.toUpperCase()} STAGE</text>
  
  <!-- Seating rows -->
  <rect x="100" y="230" width="600" height="20" fill="${colors.accent}" opacity="0.3" rx="3"/>
  <rect x="100" y="260" width="600" height="20" fill="${colors.accent}" opacity="0.25" rx="3"/>
  <rect x="100" y="290" width="600" height="20" fill="${colors.accent}" opacity="0.2" rx="3"/>
  <rect x="100" y="320" width="600" height="20" fill="${colors.accent}" opacity="0.15" rx="3"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="150" r="25" fill="${colors.secondary}" opacity="0.6"/>
  <circle cx="700" cy="150" r="25" fill="${colors.secondary}" opacity="0.6"/>
  <circle cx="150" cy="380" r="15" fill="${colors.accent}" opacity="0.4"/>
  <circle cx="650" cy="380" r="15" fill="${colors.accent}" opacity="0.4"/>
  
  <!-- Entrance -->
  <rect x="350" y="400" width="100" height="50" fill="${colors.primary}" rx="5"/>
  <text x="400" y="430" text-anchor="middle" fill="white" font-family="Arial" font-size="12">ENTRANCE</text>
  
  <!-- Title -->
  <text x="400" y="460" text-anchor="middle" fill="${colors.primary}" font-family="Arial" font-size="14" font-weight="bold">${guests || 100} GUESTS | ${theme || 'ELEGANT'} THEME</text>
  
  <!-- Event type badge -->
  <rect x="20" y="20" width="120" height="30" fill="${colors.accent}" rx="15"/>
  <text x="80" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${type.toUpperCase()}</text>
</svg>
    `.trim();

    res.status(200).json({
      success: true,
      visualization: {
        eventType: type,
        sceneDescription,
        svgPlaceholder: svgContent,
        colorPalette: colors,
        imageUrl: `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`,
        conceptSummary: `A ${theme || 'beautifully designed'} ${type} event for ${guests || 100} guests featuring ${colors.primary} and ${colors.secondary} color scheme with ${colors.accent} accents. The venue at ${venue || 'Grand Hall'} will feature ${normalizedType === 'wedding' ? 'romantic floral arrangements and soft lighting' : normalizedType === 'concert' ? 'dynamic stage lighting and concert setup' : 'professional staging and ambient décor'} creating an unforgettable experience.`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
