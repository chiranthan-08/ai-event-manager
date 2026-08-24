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

function getAIResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|namaskar)/i.test(input)) {
    return pick([
      "Hello! Welcome to AI Event Manager. I can help you plan weddings, birthdays, corporate events, and festivals. What are you celebrating?",
      "Namaste! I'm your AI Event Assistant. I can help you plan the perfect event. What are you celebrating today?",
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

const AIAssistant = ({ standalone = true }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! Welcome to AI Event Manager. I'm your personal event planning assistant.\n\nI can help you with:\n\nWeddings - From intimate to royal celebrations\nBirthdays - Kids to milestone parties\nCorporate - Annual days, launches, conferences\nFestivals - Diwali, Holi, and more\nVenues - Best places for your event\nDecorations - Theme ideas and pricing\nBudget Planning - Smart cost estimates\n\nJust tell me what you're planning!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang.code;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang.code;
    }
  }, [selectedLang]);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !autoSpeak) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[^\w\s.,!?;:'-]/g, '').trim();
    if (!clean) return;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }, [autoSpeak, selectedLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setTimeout(() => {
      try {
        const reply = getAIResponse(trimmed);
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        setTimeout(() => speak(reply), 150);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }]);
      }
      setLoading(false);
    }, 700);
  };

  const suggestions = [
    { icon: Lightbulb, title: 'Wedding Planning', prompt: 'Help me plan a wedding for 200 guests, budget 5 lakh' },
    { icon: Palette, title: 'Corporate Event', prompt: 'Suggest decorations for a corporate annual day for 500 people' },
    { icon: DollarSign, title: 'Birthday Party', prompt: 'Plan a birthday party for 50 guests, budget 50000' },
    { icon: MapPin, title: 'Venue Search', prompt: 'Suggest venues for a wedding in Bangalore' },
    { icon: Star, title: 'Theme Ideas', prompt: 'What are the best decoration themes?' },
    { icon: Calendar, title: 'Festival Event', prompt: 'Plan a Diwali celebration event' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-green-50">
      {standalone && <Navbar />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>AI Event Assistant</h1>
          <p className="text-gray-600 mt-2">Ask me anything about event planning</p>
          <p className="text-gray-400 mt-1 text-sm">Type or use the microphone to speak</p>
        </div>

        {messages.length <= 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => { setInput(s.prompt); }}
                  className="bg-white rounded-2xl p-4 text-left hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{s.prompt}</p>
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
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-saffron-300 text-xs font-medium text-gray-700"
                >
                  <Globe size={12} />{selectedLang.short}
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 min-w-[120px]">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 ${selectedLang.code === lang.code ? 'bg-saffron-50 text-saffron-600 font-bold' : 'text-gray-700'}`}
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
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
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
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 text-white shadow-lg animate-pulse'
                      : 'bg-gradient-to-br from-saffron-500 to-amber-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask about venues, decorations, themes, pricing...'}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Powered by AI Event Manager</p>
          </form>
        </div>
      </div>
      {standalone && <Footer />}
    </div>
  );
};

export default AIAssistant;
