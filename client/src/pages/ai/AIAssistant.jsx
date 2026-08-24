import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, Palette, DollarSign, MapPin, Star, Phone, Calendar } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const aiKnowledge = {
  greetings: {
    patterns: [/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|namaskar|yo|sup|hii+|helo|hlw)/i],
    responses: [
      "Hello! Welcome to AI Event Manager. I'm your personal event planning assistant. How can I help you today? You can ask me about:\n\n- Wedding, birthday, or corporate event planning\n- Venue suggestions and pricing\n- Decoration ideas and costs\n- Theme recommendations\n- Budget planning\n\nJust describe what you need, and I'll create a personalized plan for you!",
      "Namaste! I'm your AI Event Assistant. I can help you plan the perfect event - from weddings to corporate gatherings. What are you celebrating today?",
      "Hey there! Welcome to AI Event Manager. I'm here to help you plan amazing events. Tell me what you have in mind - whether it's a wedding, birthday party, corporate event, or festival celebration!"
    ]
  },
  venues: {
    patterns: [/venue|place|location|banquet|hall|resort|hotel|farmhouse|palace|farm/i],
    responses: [
      "Here are our top venue categories:\n\n🏛️ **Banquet Halls** - Perfect for 100-1000 guests\n   • Grand Palace Banquet, Jaipur - ₹2,50,000/day\n   • Leela Palace, Bangalore - ₹5,00,000/day\n   • Taj Coromandel, Chennai - ₹4,50,000/day\n\n🌿 **Outdoor Venues** - Gardens & Farmhouses\n   • The Fern Resort, Goa - ₹3,00,000/day\n   • Weekend Farmhouse, Bangalore - ₹1,50,000/day\n\n🏰 **Heritage Properties** - Royal Weddings\n   • Umaid Bhawan, Jodhpur - ₹15,00,000/day\n   • Rambagh Palace, Jaipur - ₹12,00,000/day\n\n🏖️ **Beach Venues** - Destination Events\n   • Grand Hyatt, Goa - ₹8,00,000/day\n   • Kumarakom Resort, Kerala - ₹6,00,000/day\n\nWould you like details about any specific venue type?"
    ]
  },
  decorations: {
    patterns: [/decor|decoration|stage|flower|light|drap|backdrop|mandap|rangoli|diya/i],
    responses: [
      "Here are our decoration packages:\n\n🌸 **Premium Floral Package** - ₹50,000 - ₹2,00,000\n   Fresh flowers, centerpieces, arch decorations, aisle decor\n\n✨ **Royal Chandelier Package** - ₹1,00,000 - ₹3,00,000\n   Crystal chandeliers, golden drapes, luxury lighting\n\n🪔 **Traditional Indian Package** - ₹30,000 - ₹1,50,000\n   Rangoli, diyas, marigold garlands, mandap decor\n\n🎪 **Garden Theme Package** - ₹40,000 - ₹1,80,000\n   Floral canopy, fairy lights, green backdrop, candle arrangements\n\n💎 **Luxury LED Package** - ₹80,000 - ₹2,50,000\n   LED walls, laser lights, fog machine, dance floor\n\nWhich style appeals to you? I can create a customized plan!"
    ]
  },
  pricing: {
    patterns: [/price|cost|budget|expensive|cheap|afford|how\s*much|rate|tariff|package/i],
    responses: [
      "Our event packages start from:\n\n💰 **Budget Friendly** - ₹50,000 - ₹1,50,000\n   Basic decor, standard setup, 50-100 guests\n\n💎 **Premium Range** - ₹2,00,000 - ₹5,00,000\n   Premium decor, professional lighting, 200-500 guests\n\n👑 **Luxury Range** - ₹5,00,000 - ₹15,00,000\n   Complete makeover, celebrity arrangements, 500-2000 guests\n\n🌟 **Royal Range** - ₹15,00,000+\n   Palatial setups, international artists, 2000+ guests\n\nI can create a detailed budget breakdown for your specific needs. Just tell me your event type and guest count!"
    ]
  },
  themes: {
    patterns: [/theme|style|concept|idea|themed|look|vibe|aesthetic/i],
    responses: [
      "Popular event themes we offer:\n\n🌺 **Royal Rajasthani** - Grand, majestic, traditional\n   Colors: Gold, Maroon, Deep Red\n   Elements: Palace decor, elephant motifs, mirror work\n\n🌿 **Garden Paradise** - Fresh, natural, elegant\n   Colors: Green, White, Pastels\n   Elements: Floral canopy, fairy lights, wooden accents\n\n✨ **Glamorous Night** - Modern, chic, dazzling\n   Colors: Black, Gold, Silver\n   Elements: Chandeliers, sequins, LED accents\n\n🎪 **Boho Chic** - Relaxed, artistic, unique\n   Colors: Earth tones, terracotta, sage\n   Elements: Macramé, pampas grass, rattan\n\n🏰 **Mughal Heritage** - Regal, opulent, timeless\n   Colors: Royal Blue, Gold, Cream\n   Elements: Arches, jali work, mirror mosaic\n\nWhich theme resonates with your vision?"
    ]
  },
  contact: {
    patterns: [/contact|phone|call|book|appointment|meet|visit|address|reach/i],
    responses: [
      "You can reach us through:\n\n📞 **Phone:** +91 98765 43210\n📧 **Email:** events@aievent.com\n📍 **Office:** 123 Event Plaza, MG Road, Bangalore\n\n⏰ **Working Hours:**\n   Monday - Saturday: 10 AM - 8 PM\n   Sunday: 11 AM - 6 PM\n\n🌐 **Online Booking:**\n   Visit our Register page to create an account and book online\n\n📱 **WhatsApp:** +91 98765 43210\n   Send us your event details for instant quotes!\n\nWould you like me to help you plan your event right here?"
    ]
  },
  services: {
    patterns: [/service|what\s*do|offer|provide|feature|include|everything/i],
    responses: [
      "Our complete event services include:\n\n🎉 **Event Planning**\n   Venue selection, vendor coordination, timeline management\n\n✨ **Decorations**\n   Floral, lighting, stage design, thematic decor\n\n🍽️ **Catering**\n   Multi-cuisine, live counters, custom menus\n\n🎵 **Entertainment**\n   DJ, live band, anchor, cultural performances\n\n📸 **Photography & Videography**\n   Professional teams, drone shots, cinematic reels\n\n👗 **Styling & Makeover**\n   Bridal, groom, family packages\n\n🚗 **Transportation**\n   Luxury cars, bus arrangements, valet parking\n\n🎂 **Cake & Desserts**\n   Custom cakes, dessert tables, sweet stations\n\nAll under one roof! What service are you looking for?"
    ]
  },
  weddings: {
    patterns: [/wedding|shaadi|marriage|nikah|nikaah|vivah|bride|groom|baraat/i],
    responses: [
      "Wedding Planning Packages:\n\n💕 **Intimate Wedding** (50-100 guests) - ₹3,00,000+\n   Garden mandap, floral decor, basic lighting, photographer\n\n🌸 **Classic Wedding** (200-500 guests) - ₹8,00,000+\n   Grand mandap, premium flowers, LED wall, DJ, videographer\n\n👑 **Royal Wedding** (500-2000 guests) - ₹25,00,000+\n   Palace venue, chandeliers, live band, celebrity performances\n\n🏰 **Destination Wedding** (100-500 guests) - ₹15,00,000+\n   Goa, Udaipur, Jaipur, Kerala venues + full planning\n\n**What's Included:**\n✅ Venue booking & decoration\n✅ Mandap & stage setup\n✅ Floral arrangements\n✅ Lighting & sound\n✅ Photography & video\n✅ Catering coordination\n✅ Guest management\n✅ Day-of coordination\n\nTell me your guest count and budget for a personalized plan!"
    ]
  },
  birthdays: {
    patterns: [/birthday|bday|b\'day|celebration|party|cake|turning|year/i],
    responses: [
      "Birthday Party Packages:\n\n🎂 **Kids Party** (20-50 guests) - ₹25,000+\n   Balloon decor, theme setup, game coordinator, magician\n\n🎉 **Teen Party** (30-80 guests) - ₹50,000+\n   Neon theme, DJ, photo booth, LED dance floor\n\n✨ **Milestone Birthday** (50-200 guests) - ₹1,50,000+\n   Premium decor, live band, custom cake, videographer\n\n👑 **Luxury Bash** (100-500 guests) - ₹5,00,000+\n   Celebrity appearance, grand venue, full entertainment\n\n**Popular Themes:**\n🎈 Superhero & Princess\n🌈 Rainbow & Unicorn\n🎪 Carnival & Circus\n🎵 Music & Dance Night\n🌹 Floral Garden\n\nWhat age group and how many guests?"
    ]
  },
  corporate: {
    patterns: [/corporate|company|office|annual|conference|seminar|workshop|meeting|launch|team/i],
    responses: [
      "Corporate Event Solutions:\n\n💼 **Annual Day Celebration** - ₹2,00,000+\n   Stage setup, LED screens, anchor, performances, awards\n\n🚀 **Product Launch** - ₹3,00,000+\n   Grand reveal setup, media coverage, branding, demos\n\n🎤 **Conference/Seminar** - ₹1,50,000+\n   Auditorium setup, AV equipment, live streaming\n\n🎉 **Team Building Event** - ₹1,00,000+\n   Outdoor venues, activities, games, BBQ\n\n🏆 **Award Night** - ₹5,00,000+\n   Red carpet, trophy, entertainment, gala dinner\n\n**Services Include:**\n✅ Professional stage & lighting\n✅ LED walls & projectors\n✅ Sound system & mics\n✅ Branding & banners\n✅ Anchor & host\n✅ Photography & videography\n✅ F&B coordination\n\nWhat type of corporate event are you planning?"
    ]
  },
  festivals: {
    patterns: [/festival|diwali|holi|ganesh|onam|navratri|durga|krishna|janmashtami|ugadi|pongal/i],
    responses: [
      "Festival Celebration Services:\n\n🪔 **Diwali Celebration** - ₹50,000+\n   Rangoli, 10,000 diyas, lighting, cultural performances\n\n🎨 **Holi Festival** - ₹40,000+\n   Organic colors, DJ, water games, food stalls\n\n🐘 **Ganesh Chaturthi** - ₹60,000+\n   Idol setup, aarti, decoration, procession\n\n🎊 **Navratri/Garba** - ₹75,000+\n   Stage, dhol, lighting, cultural troupe\n\n🦚 **Krishna Janmashtami** - ₹35,000+\n   Dahi handi setup, decoration, performances\n\n**We Provide:**\n✅ Venue decoration & lighting\n✅ Traditional rangoli & floral art\n✅ Sound & music arrangements\n✅ Cultural performance booking\n✅ Food stall coordination\n✅ Crowd management\n\nWhich festival are you celebrating?"
    ]
  },
  thanks: {
    patterns: [/thank|thanks|thx|tysm|appreciate|grateful/i],
    responses: [
      "You're most welcome! I'm glad I could help. If you have any more questions or need assistance with your event planning, feel free to ask anytime. Wishing you a wonderful celebration! 🎉",
      "Happy to help! Remember, I'm here 24/7 for all your event planning needs. Don't hesitate to reach out when you're ready to start planning!",
      "My pleasure! I hope the information was useful. Let me know if you'd like to dive deeper into any aspect of your event planning!"
    ]
  },
  unknown: {
    responses: [
      "I'd love to help you with that! While I specialize in event planning, I can assist you with:\n\n🎊 **Event Types:** Weddings, birthdays, corporate events, festivals, parties\n🏛️ **Venues:** Banquet halls, farms, resorts, hotels, palaces\n✨ **Decorations:** Floral, LED, traditional, modern themes\n💰 **Budget Planning:** From ₹50K to ₹50L+\n📋 **Planning Checklist:** Step-by-step guidance\n\nCould you tell me more about the event you're planning?",
      "I'm your AI Event Assistant, and I'm here to help you plan amazing events! Here's what I can help with:\n\n• **Planning** your perfect event from start to finish\n• **Finding** the best venues and decorations\n• **Suggesting** themes and budget-friendly ideas\n• **Coordinating** all event details\n\nJust tell me: What event are you planning, and how many guests are you expecting?",
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
    reply += "1️⃣ **Event Type:** Wedding, Birthday, Corporate, Festival, or Other?\n";
    reply += "2️⃣ **Guest Count:** How many people are you expecting?\n";
    reply += "3️⃣ **Budget:** What's your approximate budget?\n";
    reply += "4️⃣ **Date:** When is the event?\n\n";
    reply += "You can say something like: \"Wedding for 200 guests, budget 5 lakh\"";
    return reply;
  }

  return aiKnowledge.unknown.responses[Math.floor(Math.random() * aiKnowledge.unknown.responses.length)];
}

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! Welcome to AI Event Manager. I'm your personal event planning assistant. 🎉\n\nI can help you with:\n\n💐 **Weddings** - From intimate to royal celebrations\n🎂 **Birthdays** - Kids to milestone parties\n💼 **Corporate** - Annual days, launches, conferences\n🪔 **Festivals** - Diwali, Holi, and more\n🏛️ **Venues** - Best places for your event\n✨ **Decorations** - Theme ideas and pricing\n💰 **Budget Planning** - Smart cost estimates\n\nJust tell me what you're planning, and I'll create the perfect event for you!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
    { icon: Lightbulb, title: 'Wedding Planning', prompt: 'Help me plan a wedding for 200 guests with a garden theme, budget 5 lakh' },
    { icon: Palette, title: 'Corporate Event', prompt: 'Suggest decorations for a corporate annual day for 500 people, budget 3 lakh' },
    { icon: DollarSign, title: 'Birthday Party', prompt: 'Plan a birthday party for 50 guests with superhero theme, budget 50000' },
    { icon: MapPin, title: 'Venue Search', prompt: 'Suggest venues for a wedding in Bangalore for 300 guests' },
    { icon: Star, title: 'Theme Ideas', prompt: 'What are the best decoration themes for a wedding?' },
    { icon: Calendar, title: 'Festival Event', prompt: 'Plan a Diwali celebration event for 500 people' },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply = getAIResponse(currentInput);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 800 + Math.random() * 700);
  };

  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
  };

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
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about venues, decorations, themes, pricing..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-indian text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Powered by AI Event Manager - Ask anything about event planning!</p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAssistant;
