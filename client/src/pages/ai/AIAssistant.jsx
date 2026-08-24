import { useState } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, Palette, DollarSign } from 'lucide-react';
import { getEventSuggestions } from '../../services/aiService';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';

const parseUserInput = (text) => {
  const lower = text.toLowerCase();

  let type = 'corporate';
  if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('marriage')) type = 'wedding';
  else if (lower.includes('birthday') || lower.includes('bday') || lower.includes('party')) type = 'birthday';
  else if (lower.includes('corporate') || lower.includes('annual') || lower.includes('conference') || lower.includes('summit') || lower.includes('meeting')) type = 'corporate';
  else if (lower.includes('concert') || lower.includes('music') || lower.includes('live')) type = 'concert';
  else if (lower.includes('festival') || lower.includes('diwali') || lower.includes('holi') || lower.includes('celebration')) type = 'festival';
  else if (lower.includes('seminar') || lower.includes('workshop') || lower.includes('training')) type = 'seminar';

  const guestMatch = lower.match(/(\d+)\s*(guest|people|person|attendee|member|pax)/);
  const guests = guestMatch ? parseInt(guestMatch[1]) : 200;

  const budgetMatch = lower.match(/(\d+)\s*(lakh|lac|k|thousand|crore|budget|rs|inr)/);
  let budget = 200000;
  if (budgetMatch) {
    const num = parseInt(budgetMatch[1]);
    if (lower.includes('crore')) budget = num * 10000000;
    else if (lower.includes('lakh') || lower.includes('lac')) budget = num * 100000;
    else if (lower.includes('k') || lower.includes('thousand')) budget = num * 1000;
    else budget = num;
  }

  const themeMatch = lower.match(/theme[:\s]+(\w[\w\s]*)/);
  const theme = themeMatch ? themeMatch[1].trim() : '';

  return { type, guests, budget, theme };
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    { icon: Lightbulb, title: 'Wedding Planning', prompt: 'Help me plan a wedding for 200 guests with a garden theme, budget 5 lakh' },
    { icon: Palette, title: 'Corporate Event', prompt: 'Suggest decorations for a corporate annual day for 500 people, budget 3 lakh' },
    { icon: DollarSign, title: 'Birthday Party', prompt: 'Plan a birthday party for 50 guests with superhero theme, budget 50000' },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const parsed = parseUserInput(input);
      const response = await getEventSuggestions(parsed);
      const data = response.data.suggestions || response.data;

      let reply = `🎉 **${data.eventType} Event Plan** for ${data.guestCount} guests\n\n`;
      reply += `💰 **Budget:** ₹${data.budget.total.toLocaleString()}\n`;
      reply += `   Decoration estimate: ₹${data.budget.decorationEstimate.toLocaleString()}\n`;
      reply += `   Remaining: ₹${data.budget.remaining.toLocaleString()}\n\n`;

      if (data.themes?.length) {
        reply += `🎨 **Theme Ideas:** ${data.themes.join(', ')}\n\n`;
      }

      if (data.venues?.length) {
        reply += `🏛️ **Venue Suggestions:**\n`;
        data.venues.forEach(v => {
          reply += `   • ${v.name} (${v.capacity} guests) - ₹${v.estimatedCost}\n`;
        });
        reply += '\n';
      }

      if (data.decorations?.length) {
        reply += `✨ **Decorations:**\n`;
        data.decorations.forEach(d => {
          reply += `   • ${d.type}: ${d.description.substring(0, 80)}... - ₹${d.estimatedCost.toLocaleString()}\n`;
        });
        reply += '\n';
      }

      if (data.planningChecklist?.length) {
        reply += `📋 **Planning Checklist:**\n`;
        data.planningChecklist.slice(0, 5).forEach(item => {
          reply += `   ✓ ${item}\n`;
        });
        reply += '\n';
      }

      if (data.tips?.length) {
        reply += `💡 **Tips:**\n`;
        data.tips.forEach(tip => { reply += `   • ${tip}\n`; });
      }

      const aiMessage = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
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
          <p className="text-gray-600 mt-2">Get smart suggestions for planning your perfect event</p>
        </div>

        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  className="bg-white rounded-2xl p-5 text-left hover:shadow-lg transition-all border border-gray-100 card-hover"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{suggestion.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{suggestion.prompt}</p>
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[400px] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Ask me anything about event planning!</p>
                <p className="text-gray-400 text-sm">Try: "Plan a wedding for 200 guests with 5 lakh budget"</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-saffron-500" />
                  <span className="text-gray-500 text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your event... (e.g., wedding for 200 guests, 5 lakh budget)"
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
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAssistant;
