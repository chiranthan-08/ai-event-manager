import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, Palette, DollarSign, MapPin, Star, Phone, Calendar, Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const LANGUAGES = [
  { code: 'en-US', label: 'English', short: 'EN' },
  { code: 'kn-IN', label: 'Kannada', short: 'KN' },
  { code: 'hi-IN', label: 'Hindi', short: 'HI' },
  { code: 'ta-IN', label: 'Tamil', short: 'TA' },
  { code: 'ml-IN', label: 'Malayalam', short: 'ML' },
];

const aiKnowledge = {
  greetings: {
    patterns: [
      /^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|namaskar|yo|sup|hii+|helo|hlw)/i,
      /ನಮಸ್ಕಾರ|ಹಲೋ|ಹಾಯ/i,
      /नमस्ते|हेलो|हाय/i,
      /வணக்கம்|ஹலோ|ஹாய்/i,
      /നമസ്കാരം|ഹലോ|ഹായ്/i
    ],
    responses: [
      "Hello! Welcome to AI Event Manager. I'm your personal event planning assistant. How can I help you today? You can ask me about:\n\n- Wedding, birthday, or corporate event planning\n- Venue suggestions and pricing\n- Decoration ideas and costs\n- Theme recommendations\n- Budget planning\n\nJust describe what you need, and I'll create a personalized plan for you!",
      "Namaste! I'm your AI Event Assistant. I can help you plan the perfect event - from weddings to corporate gatherings. What are you celebrating today?",
      "Hey there! Welcome to AI Event Manager. I'm here to help you plan amazing events. Tell me what you have in mind - whether it's a wedding, birthday party, corporate event, or festival celebration!"
    ]
  },
  venues: {
    patterns: [
      /venue|place|location|banquet|hall|resort|hotel|farmhouse|palace|farm/i,
      /ಸ್ಥಳ|ಹಾಲ್|ರೆಸಾರ್ಟ್|ಹೋಟೆಲ್|ಫಾರ್ಮ್‌ಹೌಸ್|ಅರಮನೆ/i,
      /स्थान|हॉल|रिसॉर्ट्स|होटल|फार्महाउस|महल/i,
      /இடம்|ஹால்|ரிசார்ட்|ஹோட்டல்|ஃபார்ம்ஹவுஸ்|அரண்மனை/i,
      /സ്ഥലം|ഹോൾ|റിസോർട്ട്|ഹോട്ടൽ|ഫാംഹൗസ്|കൊട്ടാരം/i
    ],
    responses: [
      "Here are our top venue categories:\n\nBanquet Halls - Perfect for 100-1000 guests\n   Grand Palace Banquet, Jaipur - Rs 2,50,000/day\n   Leela Palace, Bangalore - Rs 5,00,000/day\n   Taj Coromandel, Chennai - Rs 4,50,000/day\n\nOutdoor Venues - Gardens & Farmhouses\n   The Fern Resort, Goa - Rs 3,00,000/day\n   Weekend Farmhouse, Bangalore - Rs 1,50,000/day\n\nHeritage Properties - Royal Weddings\n   Umaid Bhawan, Jodhpur - Rs 15,00,000/day\n   Rambagh Palace, Jaipur - Rs 12,00,000/day\n\nBeach Venues - Destination Events\n   Grand Hyatt, Goa - Rs 8,00,000/day\n   Kumarakom Resort, Kerala - Rs 6,00,000/day\n\nWould you like details about any specific venue type?"
    ]
  },
  decorations: {
    patterns: [
      /decor|decoration|stage|flower|light|drap|backdrop|mandap|rangoli|diya/i,
      /ಅಲಂಕಾರ|ಹೂವು|ಬೆಳಕು|ಮಂಟಪ|ರಂಗೋಲಿ|ದೀಪ/i,
      /सजावट|फूल|प्रकाश|मंडप|रंगोली|दीया/i,
      /அலங்காரம்|பூ|ஒளி|மண்டபம்|ரங்கோலி|தீபம்/i,
      /അലങ്കരം|പൂവ്|വെളിച്ചം|മണ്ഡപം|രംഗോലി|ദീപം/i
    ],
    responses: [
      "Here are our decoration packages:\n\nPremium Floral Package - Rs 50,000 to 2,00,000\n   Fresh flowers, centerpieces, arch decorations, aisle decor\n\nRoyal Chandelier Package - Rs 1,00,000 to 3,00,000\n   Crystal chandeliers, golden drapes, luxury lighting\n\nTraditional Indian Package - Rs 30,000 to 1,50,000\n   Rangoli, diyas, marigold garlands, mandap decor\n\nGarden Theme Package - Rs 40,000 to 1,80,000\n   Floral canopy, fairy lights, green backdrop, candle arrangements\n\nLuxury LED Package - Rs 80,000 to 2,50,000\n   LED walls, laser lights, fog machine, dance floor\n\nWhich style appeals to you? I can create a customized plan!"
    ]
  },
  pricing: {
    patterns: [
      /price|cost|budget|expensive|cheap|afford|how\s*much|rate|tariff|package/i,
      /ಬೆಲೆ|ವೆಚ್ಚ|ಬಜೆಟ್|ಹೆಚ್ಚು|ಕಡಿಮೆ|ಎಷ್ಟು/i,
      /कीमत|लागत|बजट|महंगा|सस्ता|कितना/i,
      /விலை|செலவு|பட்ஜெட்|விலையுயர்ந்த|மலிவு|எவ்வளவு/i,
      /വില|ചെലവ്|ബജറ്റ്|വിലകൂടിയ|വിലകുറഞ്ഞ|എത്ര/i
    ],
    responses: [
      "Our event packages start from:\n\nBudget Friendly - Rs 50,000 to 1,50,000\n   Basic decor, standard setup, 50-100 guests\n\nPremium Range - Rs 2,00,000 to 5,00,000\n   Premium decor, professional lighting, 200-500 guests\n\nLuxury Range - Rs 5,00,000 to 15,00,000\n   Complete makeover, celebrity arrangements, 500-2000 guests\n\nRoyal Range - Rs 15,00,000+\n   Palatial setups, international artists, 2000+ guests\n\nI can create a detailed budget breakdown for your specific needs. Just tell me your event type and guest count!"
    ]
  },
  themes: {
    patterns: [
      /theme|style|concept|idea|themed|look|vibe|aesthetic/i,
      /ಥೀಮ್|ಶೈಲಿ|ಕಲ್ಪನೆ|ಐಡಿಯಾ|ನೋಟ/i,
      /थीम|शैली|अवधारणा|विचार|लुक/i,
      /தீம்|ஸ்டைல்|கருத்து|ஐடியா|தோற்றம்/i,
      /തീം|ശൈലി|സങ്കൽപ്പം|ആശയം|രൂപം/i
    ],
    responses: [
      "Popular event themes we offer:\n\nRoyal Rajasthani - Grand, majestic, traditional\n   Colors: Gold, Maroon, Deep Red\n   Elements: Palace decor, elephant motifs, mirror work\n\nGarden Paradise - Fresh, natural, elegant\n   Colors: Green, White, Pastels\n   Elements: Floral canopy, fairy lights, wooden accents\n\nGlamorous Night - Modern, chic, dazzling\n   Colors: Black, Gold, Silver\n   Elements: Chandeliers, sequins, LED accents\n\nBoho Chic - Relaxed, artistic, unique\n   Colors: Earth tones, terracotta, sage\n   Elements: Macrame, pampas grass, rattan\n\nMughal Heritage - Regal, opulent, timeless\n   Colors: Royal Blue, Gold, Cream\n   Elements: Arches, jali work, mirror mosaic\n\nWhich theme resonates with your vision?"
    ]
  },
  contact: {
    patterns: [
      /contact|phone|call|book|appointment|meet|visit|address|reach/i,
      /ಸಂಪರ್ಕ|ಫೋನ್|ಕರೆ|ಭೇಟಿ|ವಿಳಾಸ/i,
      /संपर्क|फ़ोन|कॉल|बुकिंग|मिलना|पता/i,
      /தொடர்பு|தொலைபேசி|அழைப்பு|முகவரி/i,
      /ബന്ധം|ഫോൺ|കോൾ|വിലാസം/i
    ],
    responses: [
      "You can reach us through:\n\nPhone: +91 98765 43210\nEmail: events@aievent.com\nOffice: 123 Event Plaza, MG Road, Bangalore\n\nWorking Hours:\n   Monday - Saturday: 10 AM - 8 PM\n   Sunday: 11 AM - 6 PM\n\nOnline Booking:\n   Visit our Register page to create an account and book online\n\nWhatsApp: +91 98765 43210\n   Send us your event details for instant quotes!\n\nWould you like me to help you plan your event right here?"
    ]
  },
  services: {
    patterns: [
      /service|what\s*do|offer|provide|feature|include|everything/i,
      /ಸೇವೆ|ಯಾವುದು|ಒದಗಿಸು|ಸೇವಾ|ಫೀಚರ್/i,
      /सेवा|क्या|प्रदान|फ़ीचर|शामिल/i,
      /சேவை|என்ன|வழங்கு|அம்சம்|இதில் அடங்கும்/i,
      /സേവനം|എന്ത്|നൽകുന്നു|ഫീച്ചർ|ഉൾപ്പെടുന്നു/i
    ],
    responses: [
      "Our complete event services include:\n\nEvent Planning\n   Venue selection, vendor coordination, timeline management\n\nDecorations\n   Floral, lighting, stage design, thematic decor\n\nCatering\n   Multi-cuisine, live counters, custom menus\n\nEntertainment\n   DJ, live band, anchor, cultural performances\n\nPhotography and Videography\n   Professional teams, drone shots, cinematic reels\n\nStyling and Makeover\n   Bridal, groom, family packages\n\nTransportation\n   Luxury cars, bus arrangements, valet parking\n\nCake and Desserts\n   Custom cakes, dessert tables, sweet stations\n\nAll under one roof! What service are you looking for?"
    ]
  },
  weddings: {
    patterns: [
      /wedding|shaadi|marriage|nikah|nikaah|vivah|bride|groom|baraat/i,
      /ಮದುವೆ|ಶಾದಿ|ವಿವಾಹ|ಮಣ್ಣು|ಗಂಡು|ಹೆಣ್ಣು/i,
      /शादी|विवाह|दुल्हन|दूल्हा|बरात/i,
      /திருமணம்|மணமகன்|மணமகள்|கல்யாணம்/i,
      /വിവാഹം|വധു|വരൻ|കല്യാണം/i
    ],
    responses: [
      "Wedding Planning Packages:\n\nIntimate Wedding (50-100 guests) - Rs 3,00,000+\n   Garden mandap, floral decor, basic lighting, photographer\n\nClassic Wedding (200-500 guests) - Rs 8,00,000+\n   Grand mandap, premium flowers, LED wall, DJ, videographer\n\nRoyal Wedding (500-2000 guests) - Rs 25,00,000+\n   Palace venue, chandeliers, live band, celebrity performances\n\nDestination Wedding (100-500 guests) - Rs 15,00,000+\n   Goa, Udaipur, Jaipur, Kerala venues + full planning\n\nWhat is Included:\nVenue booking and decoration\nMandap and stage setup\nFloral arrangements\nLighting and sound\nPhotography and video\nCatering coordination\nGuest management\nDay-of coordination\n\nTell me your guest count and budget for a personalized plan!"
    ]
  },
  birthdays: {
    patterns: [
      /birthday|bday|b\'day|celebration|party|cake|turning|year/i,
      /ಹುಟ್ಟುಹಬ್ಬ|ಪಾರ್ಟಿ|ಕೇಕ್|ಆಚರಣೆ/i,
      /जन्मदिन|पार्टी|केक|उत्सव/i,
      /பிறந்தநாள்|விழா|கேக்|கொண்டாட்டம்/i,
      /ജന്മദിനം|പാർട്ടി|കേക്ക്|ആഘോഷം/i
    ],
    responses: [
      "Birthday Party Packages:\n\nKids Party (20-50 guests) - Rs 25,000+\n   Balloon decor, theme setup, game coordinator, magician\n\nTeen Party (30-80 guests) - Rs 50,000+\n   Neon theme, DJ, photo booth, LED dance floor\n\nMilestone Birthday (50-200 guests) - Rs 1,50,000+\n   Premium decor, live band, custom cake, videographer\n\nLuxury Bash (100-500 guests) - Rs 5,00,000+\n   Celebrity appearance, grand venue, full entertainment\n\nPopular Themes:\nSuperhero and Princess\nRainbow and Unicorn\nCarnival and Circus\nMusic and Dance Night\nFloral Garden\n\nWhat age group and how many guests?"
    ]
  },
  corporate: {
    patterns: [
      /corporate|company|office|annual|conference|seminar|workshop|meeting|launch|team/i,
      /ಕಂಪನಿ|ಕಾರ್ಯಾಲಯ|ವಾರ್ಷಿಕ|ಸಮ್ಮೇಳನ|ಕಾರ್ಯಾಗಾರ|ತಂಡ/i,
      /कंपनी|कार्यालय|वार्षिक|सम्मेलन|कार्यशाला|टीम/i,
      /நிறுவனம்|அலுவலகம்|ஆண்டு|மாநாட்டு|குழு/i,
      /കമ്പനി|ഓഫീസ്|വാർഷിക|സമ്മേളനം|ടീം/i
    ],
    responses: [
      "Corporate Event Solutions:\n\nAnnual Day Celebration - Rs 2,00,000+\n   Stage setup, LED screens, anchor, performances, awards\n\nProduct Launch - Rs 3,00,000+\n   Grand reveal setup, media coverage, branding, demos\n\nConference or Seminar - Rs 1,50,000+\n   Auditorium setup, AV equipment, live streaming\n\nTeam Building Event - Rs 1,00,000+\n   Outdoor venues, activities, games, BBQ\n\nAward Night - Rs 5,00,000+\n   Red carpet, trophy, entertainment, gala dinner\n\nServices Include:\nProfessional stage and lighting\nLED walls and projectors\nSound system and mics\nBranding and banners\nAnchor and host\nPhotography and videography\nF and B coordination\n\nWhat type of corporate event are you planning?"
    ]
  },
  festivals: {
    patterns: [
      /festival|diwali|holi|ganesh|onam|navratri|durga|krishna|janmashtami|ugadi|pongal/i,
      /ಹಬ್ಬ|ದೀಪಾವಳಿ|ಹೋಳಿ|ಗಣೇಶ|ಓಣಂ|ನವರಾತ್ರಿ|ಕೃಷ್ಣ|ಯುಗಾದಿ|ಪೊಂಗಲ್/i,
      /त्योहार|दीपावली|होली|गणेश|ओणम|नवरात्रि|कृष्ण|उगाड़ी|पोंगल/i,
      /விழா|தீபாவளி|ஹோளி|கணேச்|ஓணம்|நவராத்திரி|கிருஷ்ணா|பொங்கல்/i,
      /ഉത്സവം|ദീപാവലി|ഹോളി|ഗണേശ്|ഓണം|നവരാത്രി|കൃഷ്ണ|പൊങ്കൽ/i
    ],
    responses: [
      "Festival Celebration Services:\n\nDiwali Celebration - Rs 50,000+\n   Rangoli, 10,000 diyas, lighting, cultural performances\n\nHoli Festival - Rs 40,000+\n   Organic colors, DJ, water games, food stalls\n\nGanesh Chaturthi - Rs 60,000+\n   Idol setup, aarti, decoration, procession\n\nNavratri or Garba - Rs 75,000+\n   Stage, dhol, lighting, cultural troupe\n\nKrishna Janmashtami - Rs 35,000+\n   Dahi handi setup, decoration, performances\n\nWe Provide:\nVenue decoration and lighting\nTraditional rangoli and floral art\nSound and music arrangements\nCultural performance booking\nFood stall coordination\nCrowd management\n\nWhich festival are you celebrating?"
    ]
  },
  thanks: {
    patterns: [
      /thank|thanks|thx|tysm|appreciate|grateful/i,
      /ಧನ್ಯವಾದ|ಕೃತಜ್ಞ|ಥ್ಯಾಂಕ್/i,
      /धन्यवाद|शुक्रिया|थैंक यू/i,
      /நன்றி|ஸ்துதி|தாங்ஸ்/i,
      /നന്ദി|താങ്ക്സ്/i
    ],
    responses: [
      "You're most welcome! I'm glad I could help. If you have any more questions or need assistance with your event planning, feel free to ask anytime. Wishing you a wonderful celebration!",
      "Happy to help! Remember, I'm here 24/7 for all your event planning needs. Don't hesitate to reach out when you're ready to start planning!",
      "My pleasure! I hope the information was useful. Let me know if you'd like to dive deeper into any aspect of your event planning!"
    ]
  },
  unknown: {
    responses: [
      "I'd love to help you with that! While I specialize in event planning, I can assist you with:\n\nEvent Types: Weddings, birthdays, corporate events, festivals, parties\nVenues: Banquet halls, farms, resorts, hotels, palaces\nDecorations: Floral, LED, traditional, modern themes\nBudget Planning: From 50K to 50 Lakhs+\nPlanning Checklist: Step-by-step guidance\n\nCould you tell me more about the event you're planning?",
      "I'm your AI Event Assistant, and I'm here to help you plan amazing events! Here's what I can help with:\n\nPlanning your perfect event from start to finish\nFinding the best venues and decorations\nSuggesting themes and budget-friendly ideas\nCoordinating all event details\n\nJust tell me: What event are you planning, and how many guests are you expecting?",
      "Great question! I'm focused on event planning and management. Let me know:\n\n1. What type of event? (wedding, birthday, corporate, festival)\n2. How many guests?\n3. What's your budget?\n4. Preferred date?\n\nWith these details, I can create a perfect plan for you!"
    ]
  }
};

function getAIResponse(userInput) {
  const input = userInput.trim().toLowerCase();

  for (const [key, data] of Object.entries(aiKnowledge)) {
    if (key === 'unknown') continue;
    for (const pattern of data.patterns) {
      if (pattern.test(input)) {
        return data.responses[Math.floor(Math.random() * data.responses.length)];
      }
    }
  }

  if (input.length <= 3) {
    return aiKnowledge.greetings.responses[Math.floor(Math.random() * aiKnowledge.greetings.responses.length)];
  }

  const eventKeywords = ['wedding', 'birthday', 'corporate', 'party', 'festival', 'plan', 'event', 'celebrate'];
  if (eventKeywords.some(k => input.includes(k))) {
    let reply = "I'd be happy to help you plan your event! To give you the best suggestions, please tell me:\n\n";
    reply += "1. Event Type: Wedding, Birthday, Corporate, Festival, or Other?\n";
    reply += "2. Guest Count: How many people are you expecting?\n";
    reply += "3. Budget: What's your approximate budget?\n";
    reply += "4. Date: When is the event?\n\n";
    reply += "You can say something like: Wedding for 200 guests, budget 5 lakh";
    return reply;
  }

  return aiKnowledge.unknown.responses[Math.floor(Math.random() * aiKnowledge.unknown.responses.length)];
}

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! Welcome to AI Event Manager. I'm your personal event planning assistant.\n\nI can help you with:\n\nWeddings - From intimate to royal celebrations\nBirthdays - Kids to milestone parties\nCorporate - Annual days, launches, conferences\nFestivals - Diwali, Holi, and more\nVenues - Best places for your event\nDecorations - Theme ideas and pricing\nBudget Planning - Smart cost estimates\n\nJust tell me what you're planning, and I'll create the perfect event for you! You can type or use the microphone to speak."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang.code;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
        if (event.results[0].isFinal) {
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if (window.speechSynthesis) {
      setTtsSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang.code;
    }
  }, [selectedLang]);

  const speak = useCallback((text) => {
    if (!synthRef.current || !autoSpeak) return;
    synthRef.current.cancel();
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').replace(/\*\*/g, '').replace(/[#✅❌💰👑🏰🌟💎🪔🌸✨🎪🌺🌿🏰🎂💼🎉🎆🪔📞📧📍⏰🌐📱🗺️📸👗🚗🎈🌈🎵🌹🎤🚀🏆🍽️]/gu, '').trim();
    if (!cleanText) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find(v => v.lang === selectedLang.code);
    if (matchingVoice) utterance.voice = matchingVoice;
    synthRef.current.speak(utterance);
  }, [autoSpeak, selectedLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      synthRef.current?.cancel();
      setInput('');
      recognitionRef.current.lang = selectedLang.code;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const currentInput = input;
    setInput('');
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      try {
        const reply = getAIResponse(currentInput);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        setTimeout(() => speak(reply), 100);
      } catch (err) {
        const errMsg = "Sorry, something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
      }
      setLoading(false);
    }, delay);
  };

  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
  };

  const suggestions = [
    { icon: Lightbulb, title: 'Wedding Planning', prompt: 'Help me plan a wedding for 200 guests with a garden theme, budget 5 lakh' },
    { icon: Palette, title: 'Corporate Event', prompt: 'Suggest decorations for a corporate annual day for 500 people, budget 3 lakh' },
    { icon: DollarSign, title: 'Birthday Party', prompt: 'Plan a birthday party for 50 guests with superhero theme, budget 50000' },
    { icon: MapPin, title: 'Venue Search', prompt: 'Suggest venues for a wedding in Bangalore for 300 guests' },
    { icon: Star, title: 'Theme Ideas', prompt: 'What are the best decoration themes for a wedding?' },
    { icon: Calendar, title: 'Festival Event', prompt: 'Plan a Diwali celebration event for 500 people' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-green-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>AI Event Assistant</h1>
          <p className="text-gray-600 mt-2">Ask me anything about event planning - venues, decorations, themes, pricing & more!</p>
          <p className="text-gray-400 mt-1 text-sm">Type or use the microphone to speak in English, Kannada, Hindi, Tamil, or Malayalam</p>
        </div>

        {messages.length <= 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  className="bg-white rounded-2xl p-4 text-left hover:shadow-lg transition-all border border-gray-100 card-hover"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{suggestion.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{suggestion.prompt}</p>
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[400px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs text-gray-500">{isListening ? 'Listening...' : 'Online'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-1.5 rounded-lg transition-colors ${autoSpeak ? 'bg-saffron-100 text-saffron-600' : 'bg-gray-200 text-gray-500'}`}
                title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
              >
                {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-saffron-300 transition-colors text-xs font-medium text-gray-700"
                >
                  <Globe size={12} />
                  {selectedLang.short}
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 min-w-[120px]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 transition-colors ${selectedLang.code === lang.code ? 'bg-saffron-50 text-saffron-600 font-bold' : 'text-gray-700'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    {message.role === 'assistant' && ttsSupported && (
                      <button
                        onClick={() => speak(message.content)}
                        className="mt-2 text-xs text-saffron-500 hover:text-saffron-700 flex items-center gap-1"
                      >
                        <Volume2 size={12} /> Read aloud
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-saffron-500" />
                    <span className="text-gray-500 text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                      : 'bg-gradient-to-br from-saffron-500 to-amber-500 text-white hover:shadow-lg'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening... speak now' : 'Ask about venues, decorations, themes, pricing...'}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-indian text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              {speechSupported ? 'Click mic to speak or type your message' : 'Type your message below'}
              {' '}&middot; Powered by AI Event Manager
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAssistant;
